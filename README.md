# Reindeer finder
Locate owner of reindeer in Norway based on marks cut into ears.

## Setup
To install dependencies, run [yarn][] without arguments: `$ yarn`

A nice watcher that autoreloads is available through: `$ yarn run watch`

[yarn]: https://yarnpkg.com/


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
