# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-17 10:02:57
# Last modified: 2017-01-16 18:46:48
# Python release: 2.7
# """
import uuid
import json
import datetime
from django.db import transaction
from rest_framework import serializers
from django.utils import timezone
from .models import Mission, MissionType, MissionExecution
from djcelery.models import PeriodicTask, CrontabSchedule


class CrontabScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = CrontabSchedule
        fields = (
            'url',
            'id',
            'minute',
            'hour',
            'day_of_week',
            'day_of_month',
            'month_of_year'
        )


class PeriodicTaskSerializer(serializers.ModelSerializer):
    crontab = CrontabScheduleSerializer()
    task = serializers.HiddenField(
        default='mission.tasks.pull_users_from_redshift')

    class Meta:
        model = PeriodicTask
        fields = (
            'url',
            'id',
            'task',
            'crontab',
            'enabled',
            'kwargs',
            'expires'
        )

    def create(self, validate_data):
        crontab = validate_data.pop('crontab')
        schedule = CrontabSchedule.objects.create(**crontab)
        validate_data['name'] = '__'.join(
            (timezone.now().strftime('%Y-%m-%d %H:%M:%S'), str(uuid.uuid1())))
        task = PeriodicTask.objects.create(crontab=schedule, **validate_data)

        return task

    def update(self, instance, validate_data):
        crontab_data = validate_data.pop('crontab')
        crontab = instance.crontab

        instance.name = validate_data.get('name', instance.name)
        instance.task = validate_data.get('task', instance.task)
        instance.enabled = validate_data.get('enabled', instance.enabled)
        instance.save()

        crontab.minute = crontab_data.get('minute', '*')
        crontab.hour = crontab_data.get('hour', '*')
        crontab.day_of_week = crontab_data.get(
            'day_of_week', '*')
        crontab.day_of_month = crontab_data.get(
            'day_of_month', '*')
        crontab.month_of_year = crontab_data.get(
            'month_of_year', '*')
        crontab.save()

        return instance


class MissionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = MissionType
        fields = ('url', 'id', 'type')


class MissionSerializer(serializers.ModelSerializer):
    celery_periodtask = PeriodicTaskSerializer(required=False)
    last_succeeded = serializers.ReadOnlyField(source='get_last_succeeded')
    game = serializers.ReadOnlyField(source='get_game')
    platform = serializers.ReadOnlyField(source='get_platform')
    executed = serializers.ReadOnlyField(source='get_executed')
    succeeded = serializers.ReadOnlyField(source='get_succeeded')
    failed = serializers.ReadOnlyField(source='get_failed')
    processing = serializers.ReadOnlyField(source='get_processing')
    editable = serializers.ReadOnlyField(source='get_editable')

    class Meta:
        model = Mission
        fields = (
            'url',
            'id',
            'name',
            'status',
            'filter_day',
            'version',
            'celery_periodtask',
            'mission_type',
            'recallml',
            'template',
            'last_succeeded',
            'once_exedatetime',
            'game',
            'platform',
            'executed',
            'succeeded',
            'failed',
            'processing',
            'editable'
        )

    @transaction.atomic
    def create(self, validate_data):
        status = validate_data.get('status', None)
        mission_mark = str(uuid.uuid1())
        validate_data['mark'] = mission_mark
        celery_periodtask_data = validate_data.pop('celery_periodtask')
        celery_periodtask_data['kwargs'] = json.dumps(
            {'mission_mark': mission_mark})
        if status == 'started':
            celery_periodtask_data['enabled'] = True
        elif status == 'stopped' or status == 'completed':
            celery_periodtask_data['enabled'] = False
        if validate_data.get('mission_type').type == 'once':
            once_exedatetime = validate_data.get('once_exedatetime')
            celery_periodtask_data[
                'expires'] = once_exedatetime + datetime.timedelta(days=20)
            celery_periodtask_data['crontab'][
                'minute'] = once_exedatetime.minute
            celery_periodtask_data['crontab']['hour'] = once_exedatetime.hour
            celery_periodtask_data['crontab'][
                'day_of_month'] = once_exedatetime.day
            celery_periodtask_data['crontab'][
                'month_of_year'] = once_exedatetime.month
        serializer = PeriodicTaskSerializer(data=celery_periodtask_data)
        if serializer.is_valid():
            task = serializer.save()
        mission = Mission.objects.create(
            celery_periodtask=task, **validate_data)

        return mission

    @transaction.atomic
    def update(self, instance, validate_data):
        status = validate_data.get('status', None)
        celery_periodtask_data = validate_data.pop('celery_periodtask')

        if status == 'started':
            celery_periodtask_data['enabled'] = True
        elif status == 'stopped' or status == 'completed':
            celery_periodtask_data['enabled'] = False

        if validate_data.get('mission_type').type == 'once':
            once_exedatetime = validate_data.get('once_exedatetime')
            celery_periodtask_data[
                'expires'] = once_exedatetime + datetime.timedelta(days=2)
            celery_periodtask_data['crontab'][
                'minute'] = once_exedatetime.minute
            celery_periodtask_data['crontab']['hour'] = once_exedatetime.hour
            celery_periodtask_data['crontab'][
                'day_of_month'] = once_exedatetime.day
            celery_periodtask_data['crontab'][
                'month_of_year'] = once_exedatetime.month
        serializer = PeriodicTaskSerializer(
            instance.celery_periodtask,
            data=celery_periodtask_data,
            partial=True)
        if serializer.is_valid():
            serializer.save()

        instance.once_exedatetime = validate_data.get(
            'once_exedatetime', instance.once_exedatetime)

        instance.name = validate_data.get('name', instance.name)
        instance.status = validate_data.get('status', instance.status)
        instance.filter_day = validate_data.get(
            'filter_day', instance.filter_day)
        instance.version = validate_data.get('version', instance.version)
        instance.recallml = validate_data.get('recallml', instance.recallml)
        # instance.clusterml = validate_data.get(
        #     'clusterml', instance.clusterml)
        instance.template = validate_data.get('template', instance.template)
        instance.save()

        return instance


class MissionExecutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = MissionExecution
        fields = ('url', 'id', 'start', 'end', 'status', 'mission')
