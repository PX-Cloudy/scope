# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-16 19:13:57
# Last modified: 2016-11-30 14:45:08
# Python release: 2.7
# """
from rest_framework import serializers
from .models import RecallML, ClusterML, ClusterMLDocument


class RecallMLSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecallML
        fields = ('url', 'id', 'name', 'dist', 'sqlStr', 'version')


class ClusterMLSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClusterML
        fields = ('url', 'id', 'name', 'dist', 'sqlStr', 'version')


class ClusterMLDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClusterMLDocument
        fields = (
            'url',
            'id',
            'class_mark',
            'content',
            'keywords',
            'clusterml'
        )
