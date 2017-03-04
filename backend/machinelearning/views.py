# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-16 19:17:23
# Last modified: 2016-11-17 13:01:05
# Python release: 2.7
# """
from rest_framework import viewsets
from .models import RecallML, ClusterML, ClusterMLDocument
from .serializer import RecallMLSerializer,\
    ClusterMLSerializer, ClusterMLDocumentSerializer


class RecallMLViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecallML.objects.all()
    serializer_class = RecallMLSerializer
    filter_fields = ('name', 'version')


class ClusterMLViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClusterML.objects.all()
    serializer_class = ClusterMLSerializer
    filter_fields = ('name', 'version')


class ClusterMLDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClusterMLDocument.objects.all()
    serializer_class = ClusterMLDocumentSerializer
    filter_fields = ('class_mark', 'clusterml')
