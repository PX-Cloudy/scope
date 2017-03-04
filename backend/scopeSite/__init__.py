# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-11-08 16:38:56
# Last modified: 2016-11-08 16:40:06
# Python release: 2.7
# """

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from __future__ import absolute_import, unicode_literals
from .celery import app as celery_app  # noqa


__all__ = ['celery_app']
