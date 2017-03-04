# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-16 16:25:21
# Last modified: 2016-12-21 11:29:18
# Python release: 2.7
# """
from __future__ import unicode_literals

from rest_framework import serializers
from .models import Game, Platform, Version


class PlatformSerializer(serializers.ModelSerializer):

    class Meta:
        model = Platform
        fields = ('url', 'id', 'name',)


class VersionSerializer(serializers.ModelSerializer):
    mission_total = serializers.ReadOnlyField(source='get_mission_total')
    mission_started = serializers.ReadOnlyField(source='get_mission_started')
    mission_stopped = serializers.ReadOnlyField(source='get_mission_stopped')
    mission_processing = serializers.ReadOnlyField(
        source='get_mission_processing')

    class Meta:
        model = Version
        fields = (
            'url',
            'id',
            'GID',
            'gamedb',
            'versions',
            'timezone_diff',
            'is_enable',
            'orderid',
            'terminal_type',
            'game_timezone',
            'appkey',
            'game',
            'platform',
            'mission_total',
            'mission_started',
            'mission_stopped',
            'mission_processing',
        )


class GameSerializer(serializers.ModelSerializer):
    # versions = VersionSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('url', 'id', 'name',)
