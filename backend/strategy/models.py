# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-09-21 18:49:47
# Last modified: 2016-09-22 11:30:44
# Python release: 2.7
# """
from __future__ import unicode_literals
from django.db import models


class UserClass(models.Model):
    name = models.CharField(max_length=30)

    def __unicode__(self):
        return self.name


class Worker(models.Model):
    name = models.CharField(max_length=30)

    class Meta:
        abstract = True


class FBNotificationWorker(Worker):

    def __unicode__(self):
        return self.name


class TargetGroup(models.Model):
    name = models.CharField(max_length=30)
    rpt_date = models.DateField(null=True, blank=True)

    def __unicode__(self):
        return self.name


class Target(models.Model):
    uid = models.CharField(max_length=50)
    name = models.CharField(max_length=30)
    game_id = models.IntegerField()
    user_class = models.ForeignKey(UserClass, null=True, blank=True)

    class Meta:
        abstract = True


class FBTarget(Target):
    appuid = models.CharField(max_length=50)
    target_group = models.ForeignKey(TargetGroup)

    def __unicode__(self):
        return '%s:%d:%s:%s' % (
            self.target_group.name, self.game_id, self.uid, self.name)


class Plan(models.Model):
    name = models.CharField(max_length=100)
    detail = models.CharField(max_length=200)

    def __unicode__(self):
        return self.name


class Strategy(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        abstract = True


class FBStrategy(Strategy):
    worker = models.ForeignKey(FBNotificationWorker)
    target_group = models.ForeignKey(TargetGroup)
    plan = models.ForeignKey(Plan)

    def __unicode__(self):
        return self.name
