# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 10:14:07
# Last modified: 2016-12-30 10:40:11
# Python release: 2.7
# """
import django_filters
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from djcelery.models import PeriodicTask, CrontabSchedule
from game.models import Version
from .models import MissionType, Mission, MissionExecution
from .serializer import MissionTypeSerializer, MissionSerializer,\
    MissionExecutionSerializer, PeriodicTaskSerializer,\
    CrontabScheduleSerializer


class MissionStatusView(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        return Response(dict(Mission.STATUSCHOICE))


class MissionExecutionStatusView(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        return Response(dict(MissionExecution.STATUSCHOICE))


class MissionTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MissionType.objects.all()
    serializer_class = MissionTypeSerializer
    filter_fields = ('type',)


class MissionFilter(django_filters.FilterSet):
    game = django_filters.NumberFilter(name='game', method='filter_game')
    platform = django_filters.NumberFilter(
        name='platform', method='filter_platform')

    class Meta:
        model = Mission
        fields = [
            'status',
            'version',
            'mission_type',
            'recallml',
            'template',
            #'clusterml',
            'game',
            'platform'
        ]

    def filter_game(self, queryset, name, value):
        versions = Version.objects.filter(game__id=value)
        return queryset.filter(version_id__in=versions)

    def filter_platform(self, queryset, name, value):
        versions = Version.objects.filter(platform__id=value)
        return queryset.filter(version_id__in=versions)


class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    filter_class = MissionFilter


class MissionExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MissionExecution.objects.all()
    serializer_class = MissionExecutionSerializer
    filter_fields = ('status', 'mission')


class PeriodicTaskViewSet(viewsets.ModelViewSet):
    queryset = PeriodicTask.objects.all()
    serializer_class = PeriodicTaskSerializer


class CrontabScheduleViewSet(viewsets.ModelViewSet):
    queryset = CrontabSchedule.objects.all()
    serializer_class = CrontabScheduleSerializer
