#!/usr/bin/python2

import sys
from lxml import etree

fname = sys.argv[1]
regNo = fname.split('.')[0]

SVG = '{http://www.w3.org/2000/svg}'

xml = etree.parse(fname)

paths = xml.findall('//%spath' % SVG)

left = paths[0].values()[0]
right = paths[1].values()[0]

print '%s: [' % regNo
print '    "%s",' % left
print '    "%s"' % right
print '],'
