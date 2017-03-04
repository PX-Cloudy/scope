# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-12-23 16:46:20
# Last modified: 2017-02-15 13:22:56
# Python release: 2.7
# """
import sys
from django.core.management.base import BaseCommand
from pushtplt.models import Theme, NotifcationType
from mission.models import MissionType
from game.models import Game, Platform, Version
from utils.utils import get_redshift_conn


themes = [
    'recall',
]

notiTypes = [
    'Notification'
]

missType = [
    'once',
    'loop'
]


class Command(BaseCommand):
    help = 'Result Push Controller'

    def handle(self, *args, **options):
        try:
            conn = get_redshift_conn()
            cur = conn.cursor()
            cur.execute('select * from general.business_gamename_dim')
            results = cur.fetchall()
        except Exception as e:
            print 'ConnectionError Redshift Error'
            print e.message
            sys.exit(1)

        games = list(set([item[2] for item in results]))
        platforms = list(set([item[6] for item in results]))

        print len(results), len(games), len(platforms)

        for item in results:
            game, g_created = Game.objects.get_or_create(name=item[2])
            platform, p_created = Platform.objects.get_or_create(name=item[6])
            Version(
                GID=item[0],
                gamedb=item[1],
                versions=item[3],
                timezone_diff=item[4],
                is_enable=item[5],
                orderid=item[7],
                terminal_type=item[8],
                game_timezone=item[9],
                game=game,
                platform=platform
            ).save()

        for item in themes:
            Theme(name=item).save()
        for item in notiTypes:
            NotifcationType(type=item).save()
        for item in missType:
            MissionType(type=item).save()
