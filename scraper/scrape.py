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

def run(*args):
    set_output(StringIO())

    sys.stderr.write('Navigerer til merkeregister ..\n')
    go('%s%s' % (BASE_URL, 'sok.aspx'))

    sys.stderr.write('Henter ut reinbeiteområder ..\n')
    areas = [
        #(7, '&#216;st-Finnmark'),
        #(6, 'Vest-Finnmark'),
        #(5, 'Troms'),
        #(4, 'Nordland'),
        #(3, 'Nord-Tr&#248;ndelag'),
        (2, 'S&#248;r-Tr&#248;ndelag/Hedmark'),
    ]

    people = []
    for area in areas:
        sys.stderr.write('Velger område %s ..\n' % area[1].encode('utf-8'))
        fv(1, 'ctl00$cphInnhold$ddlOmrade', '+%s' % area[0])
        submit()

        sys.stderr.write('Henter ut distrikt i område ..\n')
        districts = _get_districts(show())

        for district in districts:
            sys.stderr.write('Velger distrikt %s ..\n' % district[0])
            fv(1, 'ctl00$cphInnhold$ddlDistrikt', '+%s' % district[0])

            submit(submit_button='ctl00$cphInnhold$btnSok')

            sys.stderr.write('Finner søkeresultat ..\n')
            people_links = _get_people_links(show())
            sys.stderr.write('Merker i distrikt: %d\n' % len(people_links))

            for link in people_links:
                mark_url = '%s%s' % (BASE_URL, link)
                mark_id = mark_url[mark_url.rfind('=') + 1:]
                sys.stderr.write('Henter merkenummer %s\n' % mark_id)

                response = requests.get(mark_url)

                if not response:
                    sys.stderr.write('FEIL: Merkenummer %s returnerte %d\n' % (
                        mark_id, response.status_code))
                    continue

                soup = BeautifulSoup(response.content)

                info_list = soup.findAll('input', type='text')

                owner = _extract_owner_info(info_list)
                owner['area'] = int(area[0])
                owner['district'] = int(district[0])

                cut_id = int(_get_cut_id(link))
                owner['cutId'] = cut_id

                sys.stderr.write('Lagrer bilde ..\n')
                _save_cut_img(soup, cut_id)

                people.append(owner)
                sys.stderr.write('\t=> Fant merket til %s %s\n' % (
                            owner['firstName'].encode('utf-8'),
                            owner['lastName'].encode('utf-8')))

        sys.stderr.write('Skriver ut resultat ..\n')
        _output(people, area[0])

def _prettify_cut(string):
    return string.strip().lower()

def _prettify(string):
    if len(string) < 1:
        return string

    if string[0] == '*':
        string = string[1:]
    if string[-1] == '*':
        string = string[:-1]
    return ' '.join([s.capitalize() for s in string.strip().split(' ')])

def _get_districts(html):
    soup = BeautifulSoup(html)

    districtsSoup = soup.find('select', {'name':'ctl00$cphInnhold$ddlDistrikt'})
    districtsSoup = districtsSoup.findAll('option')

    districts = []
    for option in districtsSoup[1:]:
        districts.append((option['value'], option.text))
    return districts

def _get_cut_id(uri):
    match = re.search('merkenr=(\d+)', uri)
    return match.group(1)

def _download_cut(uri, cut_id):
    if u'æ' in uri:
        sys.stderr.write('Æ i snitt, ikke støttet\n')
        return

    cut = requests.get(BASE_URL + uri)

    if cut:
        fp = open('%s/%s.png' % (CURRENT_DIR, cut_id), 'w')
        fp.write(cut.content)
        fp.close()

def _save_cut_img(soup, cut_id):
    img = soup.find(id='ctl00_cphInnhold_imgMerke')

    _download_cut(img.attrMap['src'], cut_id)

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
        elif about.startswith('ctl00$cphInnhold$txtSnitt'):
            key = 'c%s' % about[-1]
            owner[key] = _prettify_cut(info.get('value', ''))
            continue
        elif about == 'ctl00$cphInnhold$txtRegdato':
            key = 'regDate'
        elif about == 'ctl00$cphInnhold$txtFornavn':
            key = 'firstName'
        elif about == 'ctl00$cphInnhold$txtEtternavn':
            key = 'lastName'
        elif about == 'ctl00$cphInnhold$txtAdresse':
            key = 'address'
        elif about == 'ctl00$cphInnhold$txtPoststed':
            key = 'place'
        else:
            continue

        owner[key] = _prettify(info.get('value', ''))
    return owner


def _output(people, area_id):
    print '(function (People) {'
    print ' '*3, 'People.register = ['
    for i, owner in enumerate(people):
        print ' '*7, "{"
        print ' '*7, "    %s: %s," % ('id', owner['id'])
        print ' '*7, "    %s: %s," % ('cutId', owner['cutId'])
        print ' '*7, "    %s: %s," % ('area', owner['area'])
        print ' '*7, "    %s: %s," % ('district', owner['district'])
        print ' '*7, "    %s: '%s'," % ('firstName', owner['firstName'].encode('utf-8'))
        print ' '*7, "    %s: '%s'," % ('lastName', owner['lastName'].encode('utf-8'))
        print ' '*7, "    %s: '%s'," % ('address', owner['address'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('place', owner['place'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c1', owner['c1'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c2', owner['c2'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c3', owner['c3'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c4', owner['c4'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'," % ('c5', owner['c5'].encode('utf-8') or "")
        print ' '*7, "    %s: '%s'" % ('c6', owner['c6'].encode('utf-8') or "")
        if i == (len(people) - 1):
            print ' '*7, "}"
        else:
            print ' '*7, "},"
    print ' '*3, '];'
    print "}(REIN.module('people')));"

if __name__ == '__main__':
    run(sys.argv[1:])
