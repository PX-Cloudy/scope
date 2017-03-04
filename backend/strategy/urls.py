# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-08 17:40:16
# Last modified: 2016-11-08 17:51:41
# Python release: 2.7
# """
from django.conf.urls import url
import views

urlpatterns = [
    url(r'^$', views.index),
]
