# Reindeer finder
Locate owner of reindeer in Norway based on marks cut into ears.

[![built with choo v4](https://img.shields.io/badge/built%20with%20choo-v4-ffc3e4.svg?style=flat-square)](https://github.com/yoshuawuyts/choo)
[![license](https://img.shields.io/github/license/ruudud/rein.svg)](https://github.com/ruudud/rein/raw/master/LICENCE)

## Development
To install dependencies, run [yarn][] without arguments: `$ yarn`

A nice watcher that autoreloads is available through: `$ yarn run watch`

[yarn]: https://yarnpkg.com/

### TODO
 - [ ] Tracking
 - [ ] 404 page (with tracking)
 - [ ] Collect model logic now in views
 - [ ] CSS variables, possible using http://cssnext.io/ PostCSS

## Licence
AGPL3, see `LICENCE` file.


<!---
## Deploy
To be able to release, the S3 bucket name, access and secret key needs to be
defined in a file called ``aws-credentials.json`` using the following format::

    {
      "bucket"   : "reinmerker.no",
      "accessKey": "XXXXXXXXXXXXXXXXXXXX",
      "secretKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }

When the credentials is in place, ``grunt release`` will upload a new release.

## Scrape mark register
Simply run::

    python scraper/scrape.py > mark_register.js

When it finishes, the white needs to be made transparent (requires
ImageMagic)::

    for fl in *.png; do convert "$fl" -fuzz 20% -transparent white "$fl"; done

Then, to convert to SVG (requires potrace)::

    for fl in *.png; do convert "$fl" -bordercolor None -border 1x1 -negate pgm:- | potrace -k 0.8 --tight --color="#303030" --svg > "${fl}.svg"; done

Lastly, to extract only the ear parts of the SVGs::

    for fl in *.svg; do scraper/extract_cuts.py $fl >> cuts.js; done
-->
