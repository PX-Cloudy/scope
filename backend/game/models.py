# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 17:24:03
# Last modified: 2016-12-30 10:09:05
# Python release: 2.7
# """
from __future__ import unicode_literals

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


# Create Token when user created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Create your models here.
class Game(models.Model):
    name = models.CharField(max_length=100, help_text=u'游戏大类名称')

    def __unicode__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField(max_length=100, help_text=u'平台名称')

    def __unicode__(self):
        return self.name


class Version(models.Model):
    GID = models.IntegerField(help_text=u'数据分析部game_id')
    gamedb = models.CharField(max_length=100, help_text=u'数据分析部gamedb')
    versions = models.CharField(
        max_length=300, blank=True, null=True, default=None,
        help_text=u'version信息')
    timezone_diff = models.IntegerField(null=True, blank=True, default=None)
    is_enable = models.IntegerField(null=True, blank=True, default=None)
    orderid = models.IntegerField(null=True, blank=True, default=None)
    terminal_type = models.IntegerField(null=True, blank=True, default=None)
    game_timezone = models.IntegerField(null=True, blank=True, default=None)
    appkey = models.CharField(
        max_length=100, null=True, blank=True, default=None)
    game = models.ForeignKey(Game, related_name='versions')
    platform = models.ForeignKey(Platform)

    class Meta:
        ordering = ('GID',)

    def __unicode__(self):
        return ':'.join([
            self.game.name,
            str(self.GID),
            self.gamedb
        ])

    def get_mission_total(self):
        return self.mission_set.all().count()

    def get_mission_started(self):
        return self.mission_set.filter(status='started').count()

    def get_mission_stopped(self):
        q_stopped = models.Q(status='stopped')
        q_completed = models.Q(status='completed')
        return self.mission_set.filter(q_stopped | q_completed).count()

    def get_mission_processing(self):
        processing = [item.get_processing() for item in self.mission_set.all()]
        return reduce(lambda x, y: x+y, processing, 0)
