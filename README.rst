==============
ReindeerFinder
==============

Technical notes
===============

Developer Setup
---------------
To install dependencies, use `npm`_::

    npm install --dev

This should also install the tools `grunt.js`_. Run ``grunt watch`` in a
separate window to make grunt automatically compile templates, run tests and
`jshint`_ when files change.

.. _npm: https://npmjs.org/
.. _grunt.js: http://gruntjs.com/
.. _jshint: http://jshint.com/


Versioning
----------
We follow the specification from http://semver.org/ -- and as soon as we have
an API this makes more sense.


Releasing
---------
By the aid of `Fabric`_ the webapp gets released. The process is defined in
``fabfile.py``. Use `pip`_ to install it::

  pip install fabric

Example (reads your SSH config)::

  fab -H my.host.com deploy

.. _Fabric: http://fabfile.org/
.. _pip: http://www.pip-installer.org/


Scraping
--------
Simply run::

    python scraper/scrape.py > mark_register.js

When it finishes, the white needs to be made transparent (requires
ImageMagic)::

    for fl in `ls`; do convert `echo $fl` -fuzz 20% -transparent white $fl; done

Then, to convert to SVG (requires potrace)::

    for fl in `ls`; do convert $fl -bordercolor None -border 1x1 -negate pgm:- | potrace -k 0.8 --tight --color="#303030" --svg > $fl.svg; done

Lastly, fish out the ear parts with the `scraper/extract_cuts.py` script::

    for fl in `ls *.svg`; do ./extract_cuts.py $fl >> cuts.js; done


Application Description (in Norwegian)
======================================

Definisjoner
------------

Snitt
    Et snitt har en bokstavkode som refererer til formen på snittet.

    En typisk form et snitt kan innta, er en halvsirkel eller et hakk.
    Oversikt over forskjellige kombinasjoner finnes i `Snittkombinasjoner`_.

Posisjon
    Om begge ører tas med i samme tegning, følger posisjonen klokka.
    Posisjon 1 er øverst (framme) på høyre øre, 2 på høyre spiss og så videre.
    Den tradisjonelle sørsamiske måten å lese opp snittene på, er dog at man
    begynner på høyre øre på spiss, deretter bunn og til slutt topp.

Merke
    Et merke består av snittkombinasjoer plassert på bestemte posisjoner på
    både høyre og venstre øre.

Merkenummer (registreringsnummer)
    Et merke har et unikt merkenummer.

    Via merkenummeret kan man også finne fram til registreringsdato, distrikt
    og navn og adresse på eier, gjennom `Merkedetaljer`_. Merkenummer er *ikke*
    det samme som registreringsnummer.


.. _Merkedetaljer: https://merker.reindrift.no/Merkedetaljer.aspx?merkenr=<nr>
.. _Snittkombinasjoner: https://merker.reindrift.no/filer/Snittkombinasjoner.pdf
