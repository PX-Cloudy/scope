# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 15:06:47
# Last modified: 2016-12-28 15:14:16
# Python release: 2.7
# """
import django_filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import PushResult
from game.models import Game, Platform, Version
from .serializer import PushResultSerializer


class PushResultStatusView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):
        return Response(dict(PushResult.STATUSCHOICE))


class PushResultSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request):

        if 'version' in request.query_params:
            versions = Version.objects.filter(
                id=int(request.query_params.get('version')))
        else:
            versions = Version.objects.all()

        if 'game' in request.query_params:
            games = Game.objects.filter(
                id=int(request.query_params.get('game')))
            versions = versions.filter(game_id__in=games)

        if 'platform' in request.query_params:
            platforms = Platform.objects.filter(
                id=int(request.query_params.get('platform')))
            versions = versions.filter(platform_id__in=platforms)

        res = {
            'total': 0,
            'succeeded': 0,
            'failed': 0,
            'unstarted': 0,
            'filtered': 0,
        }

        results = PushResult.objects.filter(version__in=versions)
        res['total'] = results.count()
        res['succeeded'] = results.filter(status='succeeded').count()
        res['failed'] = results.filter(status='failed').count()
        res['unstarted'] = results.filter(status='unstarted').count()
        res['filtered'] = results.filter(day_filter=True).count()

        return Response(res)


class PushResultFilter(django_filters.FilterSet):
    game = django_filters.NumberFilter(name='game', method='filter_game')
    platform = django_filters.NumberFilter(
        name='platform', method='filter_platform')
    day_filter = django_filters.CharFilter(
        name='day_filter', method='filter_day')

    class Meta:
        model = PushResult
        fields = [
            'uid',
            'GID',
            'data_desc',
            'theme',
            'day_filter',
            'recall_filter',
            'recall_mark',
            'cluster_filter',
            'cluster_mark',
            'status',
            'execution',
            'execution_time',
            'version',
            'game',
            'platform'
        ]

    def filter_game(self, queryset, name, value):
        versions = Version.objects.filter(game__id=value)
        return queryset.filter(version_id__in=versions)

    def filter_platform(self, queryset, name, value):
        versions = Version.objects.filter(platform__id=value)
        return queryset.filter(version_id__in=versions)

    def filter_day(self, queryset, name, value):
        return queryset.filter(
            day_filter=True) if value == 'true' else queryset.filter(
                day_filter=False)


class PushResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PushResult.objects.all()
    serializer_class = PushResultSerializer
    filter_class = PushResultFilter
