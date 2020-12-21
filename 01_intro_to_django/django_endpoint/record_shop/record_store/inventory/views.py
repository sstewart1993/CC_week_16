from django.shortcuts import render
from django.http import HttpResponse
from inventory.models import *

def index(request):
    artists = Artist.objects.all()
    return render(request, "inventory/index.html", locals())
