# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-08 16:37:04
# Last modified: 2016-11-16 10:04:42
# Python release: 2.7
# """

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery,platforms
from django.conf import settings

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scopeSite.settings')

app = Celery('scopeSite')
platforms.C_FORCE_ROOT = True

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


@app.task
def task_test():
    print('test task')


@app.task
def task_test2():
    print('test task2')
