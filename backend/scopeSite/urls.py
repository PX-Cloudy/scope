"""scopeSite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.views.generic.base import RedirectView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers
from game.views import GameViewSet, PlatformViewSet, VersionViewSet,\
    UserView
from machinelearning.views import RecallMLViewSet, ClusterMLViewSet,\
    ClusterMLDocumentViewSet
from mission.views import MissionViewSet, MissionTypeViewSet,\
    MissionExecutionViewSet, PeriodicTaskViewSet, CrontabScheduleViewSet,\
    MissionStatusView, MissionExecutionStatusView
from pushtplt.views import ThemeViewSet, NotifcationTypeViewSet,\
    TemplateViewSet
from result.views import PushResultViewSet, PushResultStatusView,\
    PushResultSummaryView
from rest_framework.authtoken import views


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'platforms', PlatformViewSet)
router.register(r'versions', VersionViewSet)
router.register(r'clusterml', ClusterMLViewSet)
router.register(r'recallml', RecallMLViewSet)
router.register(r'clustermldocument', ClusterMLDocumentViewSet)
router.register(r'missiontype', MissionTypeViewSet)
router.register(r'mission', MissionViewSet)
router.register(r'missionexecution', MissionExecutionViewSet)
router.register(r'theme', ThemeViewSet)
router.register(r'notificationtype', NotifcationTypeViewSet)
router.register(r'template', TemplateViewSet)
router.register(r'pushresult', PushResultViewSet)
router.register(r'periodtask', PeriodicTaskViewSet)
router.register(r'crontabschedule', CrontabScheduleViewSet)


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='strategy')),
    url(r'^strategy/', include('strategy.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^api-token-auth/', views.obtain_auth_token),
    url(r'^api/missionstatus/', MissionStatusView.as_view()),
    url(r'^api/user/', UserView.as_view()),
    url(r'^api/missionexecutionstatus/', MissionExecutionStatusView.as_view()),
    url(r'^api/pushresultstatus/', PushResultStatusView.as_view()),
    url(r'^api/pushresultsummary/', PushResultSummaryView.as_view()),
    url(r'^api-auth/', include('rest_framework.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
