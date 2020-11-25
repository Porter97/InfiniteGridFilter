from flask import render_template, request, current_app
from . import main
import requests


@main.route('/')
def index():
    return render_template("templates/index.html")


@main.route('/images')
def get_images():

    page = request.args.get('page', 1, type=int)

    query = {
        "client_id": current_app.config['UNSPLASH_CLIENT_ID'],
        "page": page,
        "per_page": current_app.config['RESULTS_PER_PAGE'],
    }

    u_query = request.args.get('query')
    if u_query != 'null':
        query['query'] = u_query
        r = requests.get('https://api.unsplash.com/search/photos', params=query)
        res = r.json()
        return {'body': [x['urls']['regular'] for x in res['results']]}
    else:
        r = requests.get('https://api.unsplash.com/photos', params=query)
        return {'body': [x['urls']['regular'] for x in r.json()]}, 200