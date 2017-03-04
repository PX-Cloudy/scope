# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 17:28:15
# Last modified: 2016-11-16 13:29:34
# Python release: 2.7
# """
from django.contrib import admin
from djcelery.models import TaskMeta
from .models import MissionType, Mission, MissionExecution

# Register your models here.
admin.site.register(MissionType)
admin.site.register(Mission)
admin.site.register(MissionExecution)
admin.site.register(TaskMeta)
