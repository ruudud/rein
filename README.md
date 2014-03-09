ReindeerFinder
==============

ReactJS (with browserify) spike.


Developer Setup
---------------
To install dependencies, use [npm](https://npmjs.org/):

    npm install --dev

We use [Gulp](http://gulpjs.com/) to run transforms etc. Execute `gulp` in
this directory.

This will start a local static web server serving files from the `app/`
directory, and run scripts through [browserify](http://browserify.org/) when
files change. The server will also automagically update the browser when these
tasks are completed.


Versioning
----------
We follow the specification from http://semver.org/ -- and as soon as we have
an API this makes more sense.


Definitions (in Norwegian)
--------------------------

### Snitt
Et snitt har en bokstavkode som refererer til formen på snittet.

En typisk form et snitt kan innta, er en halvsirkel eller et hakk.
Oversikt over forskjellige kombinasjoner finnes i [Snittkombinasjoner][].

### Posisjon
Om begge ører tas med i samme tegning, følger posisjonen klokka.
Posisjon 1 er øverst (framme) på høyre øre, 2 på høyre spiss og så videre.
Den tradisjonelle sørsamiske måten å lese opp snittene på, er dog at man
begynner på høyre øre på spiss, deretter bunn og til slutt topp.

### Merke
Et merke består av snittkombinasjoer plassert på bestemte posisjoner på
både høyre og venstre øre.

### Merkenummer (registreringsnummer)
Et merke har et unikt merkenummer.

Via merkenummeret kan man også finne fram til registreringsdato, distrikt
og navn og adresse på eier, gjennom [Merkedetaljer][]. Merkenummer er
*ikke* det samme som registreringsnummer.

[Merkedetaljer]: https://merker.reindrift.no/Merkedetaljer.aspx?merkenr=<nr>
[Snittkombinasjoner]: https://merker.reindrift.no/filer/Snittkombinasjoner.pdf
