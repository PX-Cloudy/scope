# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-12-07 11:25:05
# Last modified: 2017-01-16 16:54:23
# Python release: 2.7
# """
import redis
import pickle
import datetime
from celery import shared_task
from scopeSite.settings import RESULT_BROKER_URL
from mission.models import Mission, UserPool, MissionExecution
from result.models import PushResult
from utils.utils import get_redshift_conn, get_sender

rc = redis.from_url(RESULT_BROKER_URL)


@shared_task(bind=True)
def push_result_to_redshift(self, kwargs):
    print 'complete'
    mission_exe = MissionExecution.objects.get(id=kwargs['mission_exe'])
    mission = Mission.objects.get(id=kwargs['mission'])
    users = PushResult.objects.filter(execution=mission_exe)

    status = {
        'succeeded': 0,
        'unstarted': 1,
        'failed': 2
    }

    try:
        conn = get_redshift_conn()
        cur = conn.cursor()
    except Exception as e:
        print e
        mission_exe.status = 'failed'
        mission_exe.end = datetime.datetime.now()
        mission_exe.save()

        if mission.mission_type.type == 'once':
            mission.status = 'failed'
            mission.save()

        return

    insert_values = [(
        user.GID,
        user.data_desc,
        user.uid,
        user.area_id,
        user.theme,
        user.cluster_mark,
        user.mail,
        user.phone if isinstance(user.phone, int) else None,
        status[user.status],
        user.error_code,
        user.error_msg if not user.error_msg or len(
            user.error_msg) < 256 else user.error_msg[0:250],
    ) for user in users]

    sqlStr = '''
    insert into ml.push_result_record(game_id,data_desc,uid,area_id,
    theme,scheme_id,email,phone,result,error_code,error_info)
    values (%s, %s, %s, %s, %s, %s ,%s, %s, %s, %s, %s)
    '''
    cur.executemany(sqlStr, insert_values)
    conn.commit()
    conn.close()

    mission_exe.status = 'succeeded'
    mission_exe.end = datetime.datetime.now()
    mission_exe.save()

    if mission.mission_type.type == 'once':
        mission.status = 'completed'
        mission.celery_periodtask.enabled = False
        mission.celery_periodtask.save()
        mission.save()

    rc.delete(kwargs['pull_task_id'])


@shared_task(bind=True)
def send_notification(self, kwargs):
    kwargs['send_task_id'] = self.request.id
    send_status = 'succeeded'

    sender = kwargs['sender']
    res = sender.send(**kwargs)
    if res['error_code'] != 0:
        send_status = 'failed'

    mission_exe = MissionExecution.objects.get(id=kwargs['mission_exe'])
    PushResult.objects.filter(
        uid=kwargs['uid'],
        cluster_mark=kwargs['cluster_mark'],
        execution=mission_exe).update(
        celery_task_id=self.request.id,
        status=send_status,
        execution_time=datetime.datetime.now(),
        error_code=res['error_code'],
        error_type=res['error_type'],
        error_msg=res['error_msg'],
    )

    rc.decr(kwargs['pull_task_id'], 1)


@shared_task(bind=True)
def pull_users_from_redshift(self, **kwargs):
    mission = Mission.objects.get(mark=kwargs['mission_mark'])
    template = mission.template
    version = mission.version

    GID = version.GID
    theme_name = template.theme.name
    filter_day = mission.filter_day
    recallml = mission.recallml
    recall_filter = True if recallml else False
    template_custom_mark = template.custom_mark
    clusterml = template.clusterml
    cluster_filter = True if clusterml else False
    if clusterml:
        clusterdc = clusterml.clustermldocument_set

    platform = version.platform.name
    notify_type = template.type.type

    mission_exe = MissionExecution(
        start=datetime.datetime.now(),
        status='processing',
        celery_task_id=self.request.id,
        mission=mission,
    )
    mission_exe.save()

    try:
        conn = get_redshift_conn()
        cur = conn.cursor()
    except Exception as e:
        MissionExecution.objects.filter(
            mission=mission,
            celery_task_id=self.request.id
        ).update(status='failed')
        print e
        return

    sqlStr = '''
    select max(data_desc) from ml.push_uid_pool
    where game_id={GID} and theme='{theme_name}'
    '''.format(GID=GID, theme_name=theme_name)
    cur.execute(sqlStr)
    max_data_desc = cur.fetchone()[0]

    if max_data_desc:
        sqlStr = '''
        select uid, game_id, email, phone, data_desc, theme, scheme_id, area_id
        from ml.push_uid_pool
        where game_id={GID} and theme='{theme_name}'
        and data_desc='{data_desc}'
        '''.format(
            GID=GID,
            theme_name=theme_name,
            data_desc=max_data_desc.strftime('%Y-%m-%d'))

        cur.execute(sqlStr)
        results = cur.fetchall()
        print results
    else:
        results = []
    conn.close()

    # 1. get the sended user by filter_day from push result table,
    # then divide the users into filter_results and sending results.
    # filter_results will not be sended. sending_results will be
    # handled by step 2,3.

    if filter_day:
        tmp = PushResult.objects.filter(
            GID=GID,
            theme=theme_name,
            status='succeeded',
            data_desc__gte=max_data_desc - datetime.timedelta(days=filter_day)
        ).values_list()

        sended = [item[1] for item in tmp]
    else:
        sended = []

    def sended_filter(r):
        return r in sended
    filter_results = filter(lambda r: sended_filter(r[0]), results)
    sending_results = filter(lambda r: not sended_filter(r[0]), results)

    filter_users = [UserPool(
        uid=item[0],
        GID=str(item[1]),
        mail=item[2],
        phone=str(item[3]),
        data_desc=item[4],
        day_filter=True,
        recall_filter=recall_filter,
        cluster_filter=cluster_filter,
        cluster_mark=item[6] if not template_custom_mark else None,
        area_id=item[7],
        mission=mission,
        execution=mission_exe
    ) for item in filter_results]

    push_filter_users_results = [PushResult(
        uid=item[0],
        GID=str(item[1]),
        mail=item[2],
        phone=str(item[3]),
        data_desc=item[4],
        theme=item[5],
        day_filter=True,
        recall_filter=recall_filter,
        cluster_filter=cluster_filter,
        cluster_mark=item[6] if not template_custom_mark else None,
        status='unstarted',
        area_id=item[7],
        execution=mission_exe,
        version=version,
    ) for item in filter_results]

    # insert filter users into temp table
    UserPool.objects.bulk_create(filter_users)
    # init push result table for filter_users
    PushResult.objects.bulk_create(push_filter_users_results)

    # 2. import recall,cluster model to handle sending uses
    sending_users = list()
    push_sending_users_results = list()
    for item in sending_results:
        recall_mark = None
        # cluster_mark = None
        # 2.1 recall model classify
        if recallml:
            # classify and set recall mark
            pass

        # 2.2 cluster model classfy
        if clusterml:
            # classify and set cluster_mark
            pass

        # no cluster model now, but rubbish requirment need it
        cluster_mark = item[6]

        sending_users.append(UserPool(
            uid=item[0],
            GID=str(item[1]),
            mail=item[2],
            phone=str(item[3]),
            data_desc=item[4],
            day_filter=False,
            recall_filter=recall_filter,
            recall_mark=recall_mark,
            cluster_filter=cluster_filter,
            cluster_mark=cluster_mark if not template_custom_mark else None,
            area_id=item[7],
            mission=mission,
            execution=mission_exe
        ))

        push_sending_users_results.append(PushResult(
            uid=item[0],
            GID=str(item[1]),
            mail=item[2],
            phone=str(item[3]),
            data_desc=item[4],
            theme=item[5],
            day_filter=False,
            recall_filter=recall_filter,
            recall_mark=recall_mark,
            cluster_filter=cluster_filter,
            cluster_mark=cluster_mark if not template_custom_mark else None,
            status='unstarted',
            area_id=item[7],
            execution=mission_exe,
            version=version
        ))

    # insert filter users into temp table
    UserPool.objects.bulk_create(sending_users)
    # init push result table for filter_users
    PushResult.objects.bulk_create(push_sending_users_results)

    # 3. get notify content and platform, then call async send task
    sender_name_group = [notify_type, 'Handler']
    if notify_type == 'Notification':
        sender_name_group.insert(0, platform)
    sender_name = ''.join(sender_name_group)

    # call get sender function
    sender = get_sender(sender_name)

    kwargs = {
        'mission': mission.id,
        'mission_exe': mission_exe.id,
        'appkey': version.appkey,
        'pull_task_id': self.request.id,
        'sender': sender,
    }

    # save this execution config in redis
    rc.set(kwargs['pull_task_id'], len(sending_users))
    rc.set('_'.join((kwargs['pull_task_id'], 'kwargs')), pickle.dumps(kwargs))

    for item in sending_users:
        if not item.recall_mark:
            kwargs['uid'] = item.uid
            if template_custom_mark:
                kwargs['content'] = template.custom_content
                kwargs['cluster_mark'] = None
            else:
                kwargs['content'] = clusterdc.get(
                    class_mark=item.cluster_mark).content
                kwargs['cluster_mark'] = item.cluster_mark

            send_notification.delay(kwargs=kwargs)
