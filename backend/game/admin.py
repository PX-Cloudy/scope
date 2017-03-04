# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 17:28:47
# Last modified: 2016-11-16 17:24:28
# Python release: 2.7
# """
from django.contrib import admin
from .models import Game, Platform, Version

# Register your models here.
admin.site.register(Platform)
admin.site.register(Game)
admin.site.register(Version)
