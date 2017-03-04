# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-16 14:08:54
# Last modified: 2016-11-17 14:22:49
# Python release: 2.7
# """
from django.contrib import admin
from .models import Theme, NotifcationType, Template


admin.site.register(Theme)
admin.site.register(NotifcationType)
admin.site.register(Template)
