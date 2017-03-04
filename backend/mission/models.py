# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 16:21:30
# Last modified: 2016-12-30 14:07:38
# Python release: 2.7
# """
from __future__ import unicode_literals

from django.db import models
from django.db.models import signals
from django.core.exceptions import ObjectDoesNotExist
# from django_celery_beat.models import PeriodicTask
# from django_celery_results.models import TaskResult
from djcelery.models import PeriodicTask
from game.models import Version
from machinelearning.models import RecallML
from pushtplt.models import Template


# Create your models here.
class MissionType(models.Model):
    type = models.CharField(max_length=20, help_text=u'任务类型')

    def __unicode__(self):
        return self.type


class Mission(models.Model):
    STATUSCHOICE = (
        ('started', u'已开启'),
        ('stopped', u'已停止'),
        ('completed', u'已完成'),
    )
    name = models.CharField(max_length=200, help_text=u'任务名称')
    status = models.CharField(
        max_length=20, choices=STATUSCHOICE, default='started',
        help_text=u'任务状态')
    filter_day = models.IntegerField(default=0, help_text=u'过滤上一次发送时间')
    mark = models.CharField(max_length=50, help_text=u'celery 标识字段')
    version = models.ForeignKey(Version)
    mission_type = models.ForeignKey(MissionType)
    celery_periodtask = models.ForeignKey(PeriodicTask, null=True)
    recallml = models.ForeignKey(RecallML, null=True, blank=True)
    template = models.ForeignKey(Template)
    once_exedatetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def get_executed(self):
        return self.get_failed() + self.get_succeeded()

    def get_failed(self):
        return self.missionexecution_set.filter(status='failed').count()

    def get_succeeded(self):
        return self.missionexecution_set.filter(status='succeeded').count()

    def get_processing(self):
        return self.missionexecution_set.filter(status='processing').count()

    def get_editable(self):
        if self.mission_type.type == 'once':
            if self.status != 'completed' and self.get_processing() == 0:
                return True
            else:
                return False
        elif self.mission_type.type == 'loop':
            if self.get_processing() == 0:
                return True
            else:
                return False

    def get_platform(self):
        return self.version.platform.id

    def get_game(self):
        return self.version.game.id

    def get_last_succeeded(self):
        try:
            last_succeeded = self.missionexecution_set.latest('end')
            return last_succeeded.end
        except ObjectDoesNotExist:
            return ''

    def __unicode__(self):
        return ':'.join([
            self.version.game.name,
            str(self.version.GID),
            self.version.gamedb,
            self.name,
            self.template.name])


def delete_celery_periodtask(sender, instance, **kwargs):
    if instance.celery_periodtask:
        instance.celery_periodtask.delete()

signals.post_delete.connect(delete_celery_periodtask, sender=Mission)


def delete_celery_periodtask_crontab(sender, instance, **kwargs):
    if instance.celery_periodtask and instance.celery_periodtask.crontab:
        instance.celery_periodtask.crontab.delete()

signals.post_delete.connect(delete_celery_periodtask_crontab, sender=Mission)


class MissionExecution(models.Model):
    STATUSCHOICE = (
        ('succeeded', u'已成功'),
        ('failed', u'已失败'),
        ('processing', u'进行中'),
    )
    start = models.DateTimeField(help_text=u'任务开始时间')
    end = models.DateTimeField(null=True, blank=True, help_text=u'任务结束时间')
    status = models.CharField(
        max_length=20, choices=STATUSCHOICE, default='processing',
        help_text=u'任务状态')
    celery_task_id = models.CharField(
        max_length=50, help_text=u'celery task id')
    mission = models.ForeignKey(Mission)

    class Meta:
        ordering = ['-id']

    def __unicode__(self):
        return ':'.join([
            self.mission.version.game.name,
            str(self.mission.version.GID),
            self.mission.version.gamedb,
            self.mission.name,
            self.mission.status])


class UserPool(models.Model):
    uid = models.CharField(max_length=100, help_text=u'用户ID')
    GID = models.CharField(max_length=10, help_text=u'数据分析部game_id')
    mail = models.EmailField(null=True, blank=True, help_text=u'邮箱地址')
    phone = models.CharField(max_length=20, null=True,
                             blank=True, help_text=u'手机号')
    data_desc = models.DateField(help_text=u'入redshift时间')
    area_id = models.CharField(max_length=5, help_text=u'数据分析部使用')
    day_filter = models.BooleanField(
        help_text=u'是否被按天过滤', blank=True, default=False)
    recall_filter = models.BooleanField(
        help_text=u'是否采用召回模型', blank=True, default=False)
    recall_mark = models.IntegerField(
        help_text=u'召回模型标识', null=True, blank=True)
    cluster_filter = models.BooleanField(
        help_text=u'是否采用聚类模型', blank=True, default=False)
    cluster_mark = models.IntegerField(
        help_text=u'聚类模型标识', null=True, blank=True)
    mission = models.ForeignKey(Mission)
    execution = models.ForeignKey(MissionExecution)

    class Meta:
        ordering = ['-id']
