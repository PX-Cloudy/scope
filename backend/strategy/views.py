from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from scopeSite.celery import debug_task
from strategy.tasks import sub


# Create your views here.
def index(request):
    return render_to_response('index.html')
