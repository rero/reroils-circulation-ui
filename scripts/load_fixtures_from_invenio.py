#!/usr/bin/env python

from urllib import request
import json
import pprint
import ssl



ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def get_items():
    response = request.urlopen('https://localhost:5000/api/documents/?size=1000&q=_exists_:itemslist._circulation.holdings', context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    to_return = []
    for hit in data.get('hits', {}).get('hits', []):
        doc = hit.get('metadata')
        items = doc.get('itemslist')
        title = doc.get('title')
        authors = doc.get('authors')
        for item in items:
            if title:
                item['title'] = title
            if authors:
                item['authors'] = authors
            item['id'] = item['pid']
            to_return.append(item)
    return to_return


def get_patrons():
    response = request.urlopen('https://localhost:5000/api/patrons/?size=1000&q=_exists_:barcode', context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    to_return = []
    for hit in data.get('hits', {}).get('hits', []):
        patron = hit.get('metadata')
        patron['id'] = patron['pid']
        to_return.append(patron)
    return to_return


def get_logged_user():
    response = request.urlopen('https://localhost:5000/api/patrons/?size=1000&q=roles:staff', context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    to_return = []
    hit = data.get('hits', {}).get('hits', [])[0]
    patron = hit.get('metadata')
    patron['id'] = patron['pid']
    to_return.append(patron)
    return to_return


data = {}
data['logged_user'] = get_logged_user()
data['patrons'] = get_patrons()
data['items'] = get_items()
print(json.dumps(data, indent=2))
