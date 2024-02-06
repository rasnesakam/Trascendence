from django.shortcuts import render

def home(request):
    return render(request, "index.html", {'page_requested': "pages/main.html"})
