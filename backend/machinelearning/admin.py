# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-14 17:29:09
# Last modified: 2016-11-14 17:29:12
# Python release: 2.7
# """
from django.contrib import admin

from .models import RecallML, ClusterML, ClusterMLDocument

# Register your models here.
admin.site.register(RecallML)
admin.site.register(ClusterML)
admin.site.register(ClusterMLDocument)
