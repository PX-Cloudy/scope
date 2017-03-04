# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-16 16:50:42
# Last modified: 2016-12-28 14:18:25
# Python release: 2.7
# """
from rest_framework import viewsets, permissions, status, pagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import transaction
from .models import Game, Platform, Version
from .serializer import GameSerializer, PlatformSerializer, VersionSerializer


class GameResultsSetPagination(pagination.PageNumberPagination):
    page_size = 100


class VersionResultsSetPagination(pagination.PageNumberPagination):
    page_size = 300


class UserView(APIView):

    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User(username=username)
            user.set_password(password)
            user.save()
        except Exception:
            return Response(
                {'result': 'failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response({'result': 'success'}, status=status.HTTP_201_CREATED)


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    filter_fields = ('id', 'name',)
    pagination_class = GameResultsSetPagination


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    filter_fields = ('id', 'name',)
    pagination_class = GameResultsSetPagination


class VersionViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.all()
    serializer_class = VersionSerializer
    filter_fields = ('id', 'gamedb', 'game', 'platform', 'GID')
    pagination_class = VersionResultsSetPagination
