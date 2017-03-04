# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 18:21:17
# Last modified: 2016-12-30 10:10:12
# Python release: 2.7
# """
from __future__ import unicode_literals

from django.db import models
from game.models import Version
from machinelearning.models import ClusterML


# Create your models here.
class Theme(models.Model):
    name = models.CharField(max_length=50, help_text=u'主题名称')

    def __unicode__(self):
        return self.name


class NotifcationType(models.Model):
    type = models.CharField(max_length=50, help_text=u'通知类型')

    def __unicode__(self):
        return self.type


class Template(models.Model):
    name = models.CharField(max_length=50, help_text=u'模板名称')
    custom_mark = models.BooleanField(default=False, help_text=u'通知内容自定义标识')
    custom_content = models.TextField(
        null=True, blank=True, help_text=u'自定义通知内容')
    theme = models.ForeignKey(Theme, help_text=u'主题')
    type = models.ForeignKey(NotifcationType)
    version = models.ForeignKey(Version)
    clusterml = models.ForeignKey(ClusterML, null=True)

    class Meta:
        ordering = ('-id',)

    def __unicode__(self):
        return ':'.join([
            self.version.game.name,
            str(self.version.GID),
            self.version.gamedb,
            self.name,
            self.type.type
        ])
