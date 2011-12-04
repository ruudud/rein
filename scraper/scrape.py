# coding: utf-8

from cStringIO import StringIO

from twill import set_output
from twill.commands import go, fv, submit, show
from BeautifulSoup import BeautifulSoup
import requests

BASE_URL = 'http://merker.reindrift.no/'
DISTRICT = '74'
AREA = '3'

def prettify(string):
    if len(string) < 4:
        return string.strip().lower()
    return ' '.join([s.capitalize() for s in string.strip().split(' ')])

set_output(StringIO())

print 'Navigerer til merkeregister ..'
go('%s%s' % (BASE_URL, 'sok.aspx'))

print 'Velger område %s ..' % AREA
fv(1, 'ctl00$cphInnhold$ddlOmrade', '+%s' % AREA)

submit()

print 'Velger distrikt %s ..' % DISTRICT
fv(1, 'ctl00$cphInnhold$ddlDistrikt', DISTRICT)

submit(submit_button='ctl00$cphInnhold$btnSok')

print 'Finner søkeresultat ..'
soup = BeautifulSoup(show())

hits = soup.findAll('a', 'listetabellinnhold')

mark_links = []

for anchor in hits:
    mark_links.append(anchor.attrMap['href'])

unique_links = set(mark_links)

print 'Merker i distrikt: %d\n' % len(unique_links)

people = []
for link in unique_links:
    mark_url = '%s%s' % (BASE_URL, link)
    mark_id = mark_url[mark_url.rfind('=') + 1:]
    print 'Henter merkenummer %s' % mark_id

    html = requests.get(mark_url)
    soup = BeautifulSoup(html.content)

    info_list = soup.findAll('input', type='text')

    owner = {}
    for info in info_list:
        about = info.get('name')

        if about == 'ctl00$cphInnhold$txtRegnr':
            key = 'id'
            owner[key] = int(info.get('value'))
            continue
        elif about == 'ctl00$cphInnhold$txtFornavn':
            key = 'firstName'
        elif about == 'ctl00$cphInnhold$txtEtternavn':
            key = 'lastName'
        elif about == 'ctl00$cphInnhold$txtAdresse':
            key = 'address'
        elif about == 'ctl00$cphInnhold$txtPoststed':
            key = 'place'
        elif about.startswith('ctl00$cphInnhold$txtSnitt'):
            key = 'c%s' % about[-1]
        else:
            continue

        owner[key] = prettify(info.get('value', ''))

    people.append(owner)
    print '\t=> Fant merket til %s %s' % (owner['firstName'],
                                          owner['lastName'])

print 'Resultat:\n'

print '['
for owner in people:
    print "{"
    print "    %s: %s," % ('id', owner['id'])
    print "    %s: '%s'," % ('firstName', owner['firstName'])
    print "    %s: '%s'," % ('lastName', owner['lastName'])
    print "    %s: '%s'," % ('address', owner['address'] or "")
    print "    %s: '%s'," % ('place', owner['place'] or "")
    print "    %s: '%s'," % ('c1', owner['c1'] or "")
    print "    %s: '%s'," % ('c2', owner['c2'] or "")
    print "    %s: '%s'," % ('c3', owner['c3'] or "")
    print "    %s: '%s'," % ('c4', owner['c4'] or "")
    print "    %s: '%s'," % ('c5', owner['c5'] or "")
    print "    %s: '%s'" % ('c6', owner['c6'] or "")
    print "},"
print ']'
