# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 18:49:36
# Last modified: 2016-12-23 09:45:47
# Python release: 2.7
# """
from __future__ import unicode_literals

from django.db import models
from mission.models import MissionExecution
from game.models import Version
# from django_celery_results.models import TaskResult
# from djcelery.models import TaskMeta as TaskResult


class PushResult(models.Model):
    STATUSCHOICE = (
        ('succeeded', u'已成功'),
        ('failed', u'已失败'),
        ('unstarted', u'未开始'),
    )
    uid = models.CharField(max_length=100, help_text=u'用户ID')
    GID = models.CharField(max_length=10, help_text=u'数据分析部game_id')
    mail = models.EmailField(null=True, blank=True, help_text=u'邮箱地址')
    phone = models.CharField(max_length=20, null=True,
                             blank=True, help_text=u'手机号')
    theme = models.CharField(max_length=20, blank=True, null=True,
                             help_text=u'模板主题')
    area_id = models.CharField(max_length=5, help_text=u'数据分析部使用')
    data_desc = models.DateField(help_text=u'入redshift时间')
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
    status = models.CharField(
        max_length=20, choices=STATUSCHOICE, help_text=u'推送执行状态')
    execution = models.ForeignKey(MissionExecution)
    execution_time = models.DateTimeField(
        help_text=u'推送执行时间', null=True, blank=True)
    version = models.ForeignKey(Version)
    celery_task_id = models.CharField(max_length=50, null=True, blank=True,
                                      help_text=u'send celery task id')
    error_type = models.CharField(
        max_length=50, null=True, blank=True, help_text=u'失败类型')
    error_code = models.IntegerField(null=True, blank=True, help_text=u'失败代码')
    error_msg = models.TextField(null=True, blank=True, help_text=u'失败原因记录')

    class Meta:
        ordering = ['-id']

