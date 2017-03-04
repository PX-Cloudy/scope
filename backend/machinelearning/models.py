# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 16:45:38
# Last modified: 2016-12-30 10:12:36
# Python release: 2.7
# """
from __future__ import unicode_literals

from django.db import models
from game.models import Version


class RecallML(models.Model):
    name = models.CharField(max_length=100, help_text=u'模型名字')
    dist = models.CharField(max_length=1000, help_text=u'模型地址')
    sqlStr = models.TextField(null=True, blank=True)
    version = models.ForeignKey(Version)

    def __unicode__(self):
        return ':'.join([
            self.version.game.name,
            str(self.version.GID),
            self.version.gamedb,
            self.name])


class ClusterML(models.Model):
    name = models.CharField(max_length=100, help_text=u'模型名字')
    dist = models.CharField(max_length=1000, help_text=u'模型地址')
    sqlStr = models.TextField(null=True, blank=True)
    version = models.ForeignKey(Version)

    def __unicode__(self):
        return ':'.join([
            self.version.game.name,
            str(self.version.GID),
            self.version.gamedb,
            self.name])


class ClusterMLDocument(models.Model):
    class_mark = models.IntegerField(help_text=u'聚类分类标识')
    content = models.TextField(help_text=u'针对某一分类的文案')
    keywords = models.TextField(null=True, blank=True, help_text=u'某一分类关键词')
    clusterml = models.ForeignKey(ClusterML)

    def __unicode__(self):
        return ':'.join([
            self.clusterml.version.game.name,
            str(self.clusterml.version.GID),
            self.clusterml.version.gamedb,
            self.clusterml.name,
            str(self.class_mark)])
