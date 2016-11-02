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
CURRENT_DIR = os.getcwd()

def run(*args):
    set_output(StringIO())

    sys.stderr.write('Requesting register ..\n')
    go('%s%s' % (BASE_URL, 'sok.aspx'))

    sys.stderr.write('Fetching areas ..\n')
    areas = [
        (7, '&#216;st-Finnmark'),
        #(6, 'Vest-Finnmark'),
        #(5, 'Troms'),
        #(4, 'Nordland'),
        #(3, 'Nord-Tr&#248;ndelag'),
        #(2, 'S&#248;r-Tr&#248;ndelag/Hedmark'),
    ]

    print 'REIN.register = ['
    for area in areas:
        people = []
        sys.stderr.write('Choosing area %s ..\n' % area[1].encode('utf-8'))
        fv(1, 'ctl00$cphInnhold$ddlOmrade', '+%s' % area[0])
        submit()

        sys.stderr.write('Fetching districts in area ..\n')
        districts = _get_districts(show())

        for district in districts:
            if district[0] == '81':
                sys.stderr.write('WARNING: Skipping district 81.\n')
                continue
            sys.stderr.write('Choosing district %s ..\n' % district[0])
            fv(1, 'ctl00$cphInnhold$ddlDistrikt', '+%s' % district[0])

            submit(submit_button='ctl00$cphInnhold$btnSok')

            sys.stderr.write('Finding result ..\n')
            people_links = _get_people_links(show())
            sys.stderr.write('Marks in district: %d\n' % len(people_links))

            for link in people_links:
                mark_url = '%s%s' % (BASE_URL, link)
                mark_id = mark_url[mark_url.rfind('=') + 1:]
                sys.stderr.write('Fetching mark number %s\n' % mark_id)

                response = requests.get(mark_url)

                if not response:
                    sys.stderr.write('ERROR: Mark %s returned %d\n' % (
                        mark_id, response.status_code))
                    continue

                soup = BeautifulSoup(response.content)

                info_list = soup.findAll('input', type='text')

                owner = _extract_owner_info(info_list)
                owner['area'] = int(area[0])
                owner['district'] = int(district[0])

                cut_id = int(_get_cut_id(link))
                owner['cutId'] = cut_id

                sys.stderr.write('Fetching image ..\n')
                _save_cut_img(soup, cut_id)

                people.append(owner)
                sys.stderr.write('\t=> Found the mark of %s %s\n' % (
                            owner['firstName'].encode('utf-8'),
                            owner['lastName'].encode('utf-8')))

        sys.stderr.write('Printing result ..\n')
        _output(people, area[0])
    print '];'

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
    sys.stderr.write('Downloading image %s\n' % cut_id)
    if u'æ' in uri:
        sys.stderr.write('WARNING: Letter Æ in cut, not supported, change to Y\n')
        uri = uri.replace(u'æ', 'y')

    uri = uri.replace(' ', '%20')
    cut = requests.get(BASE_URL + uri)

    if not cut:
        sys.stderr.write('ERROR: Could not GET image %s\n' % uri)
        return

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

        if about.startswith('ctl00$cphInnhold$txtSnitt'):
            key = 'c%s' % about[-1]
            owner[key] = _prettify_cut(info.get('value', ''))
            continue
        elif about == 'ctl00$cphInnhold$txtRegdato':
            key = 'regDate'
        elif about == 'ctl00$cphInnhold$txtFornavn':
            key = 'firstName'
        elif about == 'ctl00$cphInnhold$txtEtternavn':
            key = 'lastName'
        else:
            continue

        owner[key] = _prettify(info.get('value', ''))
    return owner


def _output(people, area_id):
    for i, owner in enumerate(people):
        print ' ', "{"
        print ' ', "  %s: %s," % ('cutId', owner['cutId'])
        print ' ', "  %s: %s," % ('area', owner['area'])
        print ' ', "  %s: %s," % ('district', owner['district'])
        print ' ', "  %s: '%s'," % ('firstName', owner['firstName'].encode('utf-8'))
        print ' ', "  %s: '%s'," % ('lastName', owner['lastName'].encode('utf-8'))
        print ' ', "  %s: '%s'," % ('c1', owner['c1'].encode('utf-8') or "")
        print ' ', "  %s: '%s'," % ('c2', owner['c2'].encode('utf-8') or "")
        print ' ', "  %s: '%s'," % ('c3', owner['c3'].encode('utf-8') or "")
        print ' ', "  %s: '%s'," % ('c4', owner['c4'].encode('utf-8') or "")
        print ' ', "  %s: '%s'," % ('c5', owner['c5'].encode('utf-8') or "")
        print ' ', "  %s: '%s'" % ('c6', owner['c6'].encode('utf-8') or "")
        if i == (len(people) - 1):
            print ' ', "}"
        else:
            print ' ', "},"

if __name__ == '__main__':
    run(sys.argv[1:])
