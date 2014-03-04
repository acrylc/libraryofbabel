import collections
import urllib2                                                              
import json
import csv
import math
import random

titles = []

baseUrl = 'http://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&action=query&';


url = baseUrl + 'titles=Jorge_Luis_Borges&pllimit=500'
req = urllib2.Request(url, None)
resp = urllib2.urlopen(req).read()
data = json.loads(resp)

titles.append['Jorges Luis Borges']

for key in data['query']['pages']:
	pages = data['query']['pages'][key]

plinks = []
for i in pages['links']:
	plinks.append(i)

l = len(plinks)
lines = random.sample(range(l), 6)

newtitles = []
for i in lines:
	titles.append( plinks[i]['title'] )
	newtitles.append(plinks[i]['title'])

for title in titles:
	