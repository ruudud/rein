# coding: utf-8

from cStringIO import StringIO
import sys

from twill import set_output
from twill.commands import go, fv, submit, show
from BeautifulSoup import BeautifulSoup
import requests

BASE_URL = 'http://merker.reindrift.no/'
AREA = '3'

def prettify(string):
    if len(string) < 4:
        return string.strip().lower()
    return ' '.join([s.capitalize() for s in string.strip().split(' ')])

def _get_districts(html):
    soup = BeautifulSoup(html)

    districsSoup = soup.find('select', {'name':'ctl00$cphInnhold$ddlDistrikt'})
    districsSoup = districsSoup.findAll('option')

    districts = []
    for option in districsSoup[1:]:
        districts.append((option['value'], option.text))
    return districts

def _get_people_links(html):
    soup = BeautifulSoup(html)
    hits = soup.findAll('a', 'listetabellinnhold')

    mark_links = []
    for anchor in hits:
        mark_links.append(anchor.attrMap['href'])

    return set(mark_links)

def _extract_owner_info(info_list):
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
    return owner


def run():
    set_output(StringIO())

    sys.stderr.write('Navigerer til merkeregister ..\n')
    go('%s%s' % (BASE_URL, 'sok.aspx'))

    sys.stderr.write('Velger område %s ..\n' % AREA)
    fv(1, 'ctl00$cphInnhold$ddlOmrade', '+%s' % AREA)

    submit()

    sys.stderr.write('Henter ut distrikt i område ..\n')
    districts = _get_districts(show())

    people = []
    for district in districts:
        sys.stderr.write('Velger distrikt %s ..\n' % district[1])
        fv(1, 'ctl00$cphInnhold$ddlDistrikt', district[0])

        submit(submit_button='ctl00$cphInnhold$btnSok')

        sys.stderr.write('Finner søkeresultat ..\n')
        people_links = _get_people_links(show())
        sys.stderr.write('Merker i distrikt: %d\n' % len(people_links))

        for link in people_links:
            mark_url = '%s%s' % (BASE_URL, link)
            mark_id = mark_url[mark_url.rfind('=') + 1:]
            sys.stderr.write('Henter merkenummer %s\n' % mark_id)

            html = requests.get(mark_url)
            soup = BeautifulSoup(html.content)

            info_list = soup.findAll('input', type='text')

            owner = _extract_owner_info(info_list)
            owner['district'] = int(district[0])

            people.append(owner)
            sys.stderr.write('\t=> Fant merket til %s %s\n' % (
                        owner['firstName'].encode('utf-8'),
                        owner['lastName'].encode('utf-8')))

    sys.stderr.write('Resultat:\n')

    print '['
    for owner in people:
        print "{"
        print "    %s: %s," % ('id', owner['id'])
        print "    %s: %s," % ('district', owner['district'])
        print "    %s: '%s'," % ('firstName', owner['firstName'].encode('utf-8'))
        print "    %s: '%s'," % ('lastName', owner['lastName'].encode('utf-8'))
        print "    %s: '%s'," % ('address', owner['address'].encode('utf-8') or "")
        print "    %s: '%s'," % ('place', owner['place'].encode('utf-8') or "")
        print "    %s: '%s'," % ('c1', owner['c1'] or "")
        print "    %s: '%s'," % ('c2', owner['c2'] or "")
        print "    %s: '%s'," % ('c3', owner['c3'] or "")
        print "    %s: '%s'," % ('c4', owner['c4'] or "")
        print "    %s: '%s'," % ('c5', owner['c5'] or "")
        print "    %s: '%s'" % ('c6', owner['c6'] or "")
        print "},"
    print ']'

if __name__ == '__main__':
    run()
