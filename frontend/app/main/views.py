from django.shortcuts import render

routes = {
    '': 'main.html',
    'game': 'game.html',
    'login': 'login.html',
    'tournament': 'tournament.html'
}


def get_requested_file(url: str, routes: dict) -> str:
    query_param_index = url.find('?')
    url_dir = url[: query_param_index if query_param_index > 0 else len(url)]
    sub_url = url_dir.split("/")[0]
    for route_dir in routes.keys():
        if route_dir == sub_url:
            return routes.get(route_dir)
    return "error-404.html"


def home(request, url):
    page = get_requested_file(url, routes)
    return render(request, "index.html", {'page_requested': f"static/pages/{page}"})
