==============
ReindeerFinder
==============

Technical notes
===============

Developer Setup
---------------

To run the tests, you need `Buster.JS`_, installable with ``npm``::
    
    npm install buster

See `ruudud/jsboilerplate`_ for more info.

.. _Buster.JS: http://busterjs.org/
.. _ruudud/jsboilerplate: https://github.com/ruudud/jsboilerplate

Colors
------

The palette in use, is `Ocean Five`_:

  * Blue: #00A0B0
  * Brown: #6A4A3C
  * Red: #CC333F
  * Orange: #EB6841
  * Yellow: #EDC951

.. _Ocean Five: http://www.colourlovers.com/palette/1473/Ocean_Five

Scraping
--------

Simply run::

    python scraper/scrape.py > mark_register.js

When it finishes, the white needs to be made transparent (requires
ImageMagic)::

    for fl in `ls`; do convert `echo $fl` -fuzz 20% -transparent white $fl; done

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


Funksjonalitet
--------------

1. Opplistning av alle merker.
2. Filtrering basert på snitt i posisjoner.
