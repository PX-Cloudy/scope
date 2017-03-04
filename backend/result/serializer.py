# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 14:54:56
# Last modified: 2016-12-12 14:25:32
# Python release: 2.7
# """
from rest_framework import serializers
from .models import PushResult


class PushResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = PushResult
        fields = (
            'url',
            'id',
            'uid',
            'GID',
            'data_desc',
            'day_filter',
            'recall_filter',
            'recall_mark',
            'cluster_filter',
            'cluster_mark',
            'status',
            'theme',
            'execution',
            'execution_time',
            'version',
        )
