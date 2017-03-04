# -*- coding:utf-8 -*-
# """
# Program:
# Version:
# Description: called in other system to sync game info
# Author: zhenglei - zhenglei@shinezone.com
# Date: 2016-12-23 17:36:15
# Last modified: 2017-02-15 12:56:20
# Python release: 2.7
# """
import requests
import json

RECALLSYS_API = 'http://52.1.180.220:19999/api'
RECALLSYS_ADMIN_TOKEN = '4a85d33e0500329889c4d4a577247ad90f7abe39'


def get_game(**params):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.get(RECALLSYS_API + '/games/',
                       headers=headers, params=params)
    games = res.json()['results']
    return games


def post_game(data):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.post(RECALLSYS_API + '/games/',
                        data=json.dumps(data), headers=headers)
    return res.json()


def get_platform(**params):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.get(RECALLSYS_API + '/platforms/',
                       headers=headers, params=params)
    platforms = res.json()['results']
    return platforms


def post_platform(data):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.post(RECALLSYS_API + '/platforms/',
                        data=json.dumps(data), headers=headers)
    return res.json()


def get_version(**params):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.get(RECALLSYS_API + '/versions/',
                       headers=headers, params=params)
    versions = res.json()['results']
    return versions


def post_version(data):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.post(RECALLSYS_API + '/versions/',
                        data=json.dumps(data), headers=headers)
    return res.json()


def put_version(data):
    headers = {
        'Authorization': 'Token ' + RECALLSYS_ADMIN_TOKEN,
        'Content-Type': 'application/json; charset=utf-8'
    }

    res = requests.put(
        RECALLSYS_API + '/versions/' + str(data['id']) + '/',
        data=json.dumps(data), headers=headers
    )
    return res.json()


def sync_to_recall(gameDimDict):
    t_game = get_game(**{'name': gameDimDict['game_name']})
    game = post_game(
        {'name': gameDimDict['game_name']}) if not t_game else t_game[0]

    t_plat = get_platform(**{'name': gameDimDict['platform']})
    platform = post_platform(
        {'name': gameDimDict['platform']}) if not t_plat else t_plat[0]

    version = get_version(**{'GID': gameDimDict['game_id']})

    data = {
        'GID': gameDimDict['game_id'],
        'gamedb': gameDimDict['gamedb'],
        'versions': gameDimDict['versions'],
        'timezone_diff': gameDimDict['timezone_diff'],
        'is_enable': gameDimDict['is_enable'],
        'orderid': gameDimDict['orderid'],
        'terminal_type': gameDimDict['terminal_type'],
        'game_timezone': gameDimDict['game_timezone'],
        'game': game['id'],
        'platform': platform['id']
    }

    if not version:
        version = post_version(data)
    else:
        data['id'] = version[0]['id']
        version = put_version(data)

if __name__ == '__main__':
    tmp = {
        'game_id': -11,
        'gamedb': 'zhenglei',
        'game_name': 'zhenglei',
        'versions': 'zhenglei',
        'timezone_diff': -11,
        'platform': 'zhenglei',
        'is_enable': -1,
        'orderid': -1,
        'terminal_type': -1,
        'game_timezone': -1
    }

    sync_to_recall(tmp)
