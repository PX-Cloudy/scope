# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description:
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-12-05 14:20:05
# Last modified: 2016-12-08 14:26:53
# Python release: 2.7
# """
import sys
import psycopg2
from facebook import GraphAPI, GraphAPIError
from scopeSite.settings import APIVERSION, redshift


def get_redshift_conn():
    host = redshift['host']
    port = redshift['port']
    user = redshift['user']
    password = redshift['password']
    db = redshift['db']

    conn = psycopg2.connect(
        host=host,
        user=user,
        port=port,
        password=password,
        dbname=db
    )
    return conn


class FacebookApiException(Exception):

    def __init__(self, emsg, etype, ecode):
        self.etype = etype
        self.ecode = ecode
        super(FacebookApiException, self).__init__(emsg)


class FacebookApi(object):

    def __init__(self, token, version=APIVERSION):
        self.graph = GraphAPI(token, api_version=version)

    def request(self, method, edge, params=None):
        if hasattr(self.graph, method):
            try:
                return getattr(self.graph, method)(edge, params)
            except GraphAPIError as e:
                raise FacebookApiException(
                    e.message, e.type, e.code)
        else:
            raise FacebookApiException(
                'The HTTP Method is NOT Support!', -1, 'SysException')

    def me(self, params=None):
        return self.request('get', 'me', params)


class NotificationHandler(object):

    def __init__(self):
        self.name = 'NotificationHandler'

    def send(self, **kwargs):
        pass


class FacebookNotificationHandler(NotificationHandler):

    def __init__(self):
        self.name = 'FacebookNotificationHandler'

    def send(self, **kwargs):
        params = dict()
        params['template'] = kwargs['content']
        edge = '%s/notifications' % kwargs['uid']
        res = {
            'error_code': 0,
            'error_type': None,
            'error_msg': 'success',
        }

        try:
            fb = FacebookApi(kwargs['appkey'])
            fb.request('post', edge, params)
            print edge, params
        except FacebookApiException as e:
            res['error_msg'] = e.message
            res['error_code'] = e.ecode
            res['error_type'] = e.etype
        except Exception as e:
            res['error_msg'] = e.message
            res['error_code'] = -1
            res['error_type'] = 'SYS ERROR'

        return res


class SinaNotificationHandler(NotificationHandler):

    def __init__(self):
        self.name = 'SinaNotificationHandler'

    def send(self, **kwargs):
        pass


class EmailHandler(NotificationHandler):

    def __init__(self):
        self.name = 'EmailHandler'

    def send(self, **kwargs):
        pass


class SMSHandler(NotificationHandler):

    def __init__(self):
        self.name = 'SMSHandler'

    def send(self, **kwargs):
        pass


def get_sender(name):
    return getattr(sys.modules[__name__], name)()
