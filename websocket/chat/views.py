# from django.contrib.auth.decorators import login_required
# from django.utils.safestring import mark_safe
# import json
from django.shortcuts import render

# @login_required
def lobby(request):
    return render(request, 'chat/lobby.html')

