# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 13:03:41
# Last modified: 2016-11-30 14:50:12
# Python release: 2.7
# """
from rest_framework import serializers
from .models import Theme, NotifcationType, Template


class ThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theme
        fields = ('url', 'id', 'name')


class NotifcationTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = NotifcationType
        fields = ('url', 'id', 'type')


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template
        fields = (
            'url',
            'id',
            'name',
            'custom_mark',
            'custom_content',
            'theme',
            'type',
            'version',
            'clusterml'
        )
