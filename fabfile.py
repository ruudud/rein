# coding: utf-8
"""
Release strategy for ReindeerFinder
-----------------------------------

1. Run tests
2. Run local grunt build task
  * Bumps version (defaults to patch)
  * Minify, concat ++ (see grunt.js for details)
3. Transfer `dist/` folder to S3 bucket
  * Set correct mime type for certain files
"""
from __future__ import with_statement

import re

from fabric.api import local, lcd, abort, settings
from fabric.colors import green
from fabric.contrib.console import confirm

LOCAL_BUILD_PATH = 'dist/'
S3BUCKET = 's3://reinmerker.no/'

def deploy(version='patch'):
    if not version in ('patch', 'minor', 'major'):
        abort('version is one of patch (default), minor or major')

    test()
    build_version = _bump_version(version)
    _build()

    _uploadToS3()

    print(green('Release of %s completed successfully.' % build_version))

def test():
    with settings(warn_only=True):
        test_result = local('grunt buster', capture=True)
    if test_result.failed and not confirm('Tests failed. Continue anyway?'):
        abort('You aborted it, didn\'t you?')

def _uploadToS3():
    with lcd(LOCAL_BUILD_PATH):
        cmd = 's3cmd -P --add-header="Content-Encoding: gzip"'
        local('%s --guess-mime-type -r sync . %s' % (cmd, S3BUCKET))
        local('%s -m text/cache-manifest put rein.appcache %srein.appcache' % (cmd, S3BUCKET))

def _bump_version(version):
    output = local('grunt bump:%s' % version, capture=True)
    return re.findall(r'\d+\.\d+.\d+', output)[0]

def _build():
    local('grunt')
