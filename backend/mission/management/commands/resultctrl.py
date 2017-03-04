# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-12-06 13:00:51
# Last modified: 2016-12-23 16:47:23
# Python release: 2.7
# """
import pickle
import redis
import time
from django.core.management.base import BaseCommand
from scopeSite.settings import RESULT_BROKER_URL
from mission.tasks import push_result_to_redshift


class Command(BaseCommand):
    help = 'Result Push Controller'

    def handle(self, *args, **options):
        rc = redis.from_url(RESULT_BROKER_URL)
        while True:
            keys = [key for key in rc.keys() if not key.endswith('kwargs')]
            print keys
            for key in keys:
                print rc.get(key)
                if int(rc.get(key)) == 0:
                    print 'push', key
                    kwargsKey = '_'.join((key, 'kwargs'))
                    kwargs = pickle.loads(rc.get(kwargsKey))
                    push_result_to_redshift.delay(kwargs=kwargs)
                    rc.delete(key)
                    rc.delete(key + '_kwargs')
                else:
                    print 'unpush', key
                    kwargsKey = '_'.join((key, 'kwargs'))
                    print rc.get(key)
                    print rc.get(kwargsKey)
            time.sleep(5)
