# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-09-21 18:37:19
# Last modified: 2016-09-22 11:01:48
# Python release: 2.7
# """
from django.contrib import admin
from models import UserClass
from models import FBNotificationWorker
from models import TargetGroup
from models import FBTarget
from models import Plan
from models import FBStrategy

admin.site.register(UserClass)
admin.site.register(FBNotificationWorker)
admin.site.register(TargetGroup)
admin.site.register(FBTarget)
admin.site.register(Plan)
admin.site.register(FBStrategy)
