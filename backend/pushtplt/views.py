# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 14:23:54
# Last modified: 2016-12-23 14:49:15
# Python release: 2.7
# """
import django_filters
from rest_framework import viewsets
from game.models import Version
from .models import Theme, NotifcationType, Template
from .serializer import ThemeSerializer, NotifcationTypeSerializer,\
    TemplateSerializer


class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer


class NotifcationTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NotifcationType.objects.all()
    serializer_class = NotifcationTypeSerializer


class TemplateFilter(django_filters.FilterSet):
    game = django_filters.NumberFilter(name='game', method='filter_game')
    platform = django_filters.NumberFilter(
        name='platform', method='filter_platform')

    class Meta:
        model = Template
        fields = [
            'name',
            'theme',
            'type',
            'version',
            'clusterml',
            'custom_mark',
            'game',
            'platform'
        ]

    def filter_game(self, queryset, name, value):
        versions = Version.objects.filter(game__id=value)
        return queryset.filter(version_id__in=versions)

    def filter_platform(self, queryset, name, value):
        versions = Version.objects.filter(platform__id=value)
        return queryset.filter(version_id__in=versions)


class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    filter_class = TemplateFilter
