# coding: utf-8

from cStringIO import StringIO
import os
import re
import sys

from twill import set_output
from twill.commands import go, fv, submit, show
from BeautifulSoup import BeautifulSoup
import requests

BASE_URL = 'https://merker.reindrift.no/'
AREA = '3'
CURRENT_DIR = os.getcwd()

def _prettify(string):
    if len(string) < 4:
        return string.strip().lower()
    if string[0] == '*':
        string = string[1:]
    if string[-1] == '*':
        string = string[:-1]
    return ' '.join([s.capitalize() for s in string.strip().split(' ')])

def _get_districts(html):
    soup = BeautifulSoup(html)

    districsSoup = soup.find('select', {'name':'ctl00$cphInnhold$ddlDistrikt'})
    districsSoup = districsSoup.findAll('option')

    districts = []
    for option in districsSoup[1:]:
        districts.append((option['value'], option.text))
    return districts

def _get_cut_id(uri):
    match = re.search('merkenr=(\d+)', uri)
    return match.group(1)

def _download_cut(uri):
    cut_id = _get_cut_id(uri)
    cut = requests.get(BASE_URL + uri)

    fp = open('%s/%s.png' % (CURRENT_DIR, cut_id), 'w')
    fp.write(cut.content)
    fp.close()

def _save_cut_img(html):
    soup = BeautifulSoup(html)
    hits = soup.findAll('img', 'listetabellinnhold')

    for img in hits:
        _download_cut(img.attrMap['src'])

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

        owner[key] = _prettify(info.get('value', ''))
    return owner


def run(*args):
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

        sys.stderr.write('Lagrer bilder ..\n')
        _save_cut_img(show())

        for link in people_links:
            mark_url = '%s%s' % (BASE_URL, link)
            mark_id = mark_url[mark_url.rfind('=') + 1:]
            sys.stderr.write('Henter merkenummer %s\n' % mark_id)

            html = requests.get(mark_url)
            soup = BeautifulSoup(html.content)

            info_list = soup.findAll('input', type='text')

            owner = _extract_owner_info(info_list)
            owner['district'] = int(district[0])
            owner['cutId'] = int(_get_cut_id(link))

            people.append(owner)
            sys.stderr.write('\t=> Fant merket til %s %s\n' % (
                        owner['firstName'].encode('utf-8'),
                        owner['lastName'].encode('utf-8')))

    sys.stderr.write('Skriver ut resultat ..\n')

    print '(function (People) {'
    print ' '*3, 'People.register = ['
    for i, owner in enumerate(people):
        print ' '*7, "{"
        print ' '*7, "    %s: %s," % ('id', owner['id'])
        print ' '*7, "    %s: %s," % ('cutId', owner['cutId'])
        print ' '*7, "    %s: %s," % ('district', owner['district'])
        print ' '*7, "    %s: '%s'," % ('firstName', owner['firstName'].encode('utf-8'))
        print ' '*7, "    %s: '%s'," % ('lastName', owner['lastName'].encode('utf-8'))
        print ' '*7, "    %s: '%s'," % ('address', owner['address'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('place', owner['place'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c1', owner['c1'] or "")
        print ' '*7, "    %s: '%s'," % ('c2', owner['c2'] or "")
        print ' '*7, "    %s: '%s'," % ('c3', owner['c3'] or "")
        print ' '*7, "    %s: '%s'," % ('c4', owner['c4'] or "")
        print ' '*7, "    %s: '%s'," % ('c5', owner['c5'] or "")
        print ' '*7, "    %s: '%s'" % ('c6', owner['c6'] or "")
        if i == (len(people) - 1):
            print ' '*7, "}"
        else:
            print ' '*7, "},"
    print ' '*3, '];'
    print "}(REINMERKE.module('people')));"

if __name__ == '__main__':
    run(sys.argv[1:])
