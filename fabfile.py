# coding: utf-8
"""
Release strategy for ReindeerFinder
-----------------------------------

1. Run local grunt build task
  * Bumps version (defaults to patch)
  * Minify, concat ++ (see grunt.js for details)
2. Transfer `dist/` folder to host
3. Symlink release
"""
from __future__ import with_statement

import re

from fabric.api import run, local, env, abort, settings
from fabric.colors import green
from fabric.contrib.console import confirm
from fabric.contrib.project import rsync_project

env.use_ssh_config = True

REMOTE_BASE = '/srv/reindeerfinder'
CURRENT_RELEASE = '%s/app' % REMOTE_BASE
LASTGOOD_RELEASE = '%s/last_good_version' % REMOTE_BASE
REMOTE_BUILDS_PATH = '%s/builds' % REMOTE_BASE
LOCAL_BUILD_PATH = 'dist/'

def deploy(version='patch'):
    if not version in ('patch', 'minor', 'major'):
        abort('version is one of patch (default), minor or major')

    test()
    version = _bump_version(version)
    _build()

    remote_build_path = '%s/%s' % (REMOTE_BUILDS_PATH, version)
    rsync_project(remote_build_path, LOCAL_BUILD_PATH)

    _set_lastgood_build()
    _set_active_build(remote_build_path)
    print(green('Release of %s completed successfully.' % version))

def rollback():
    run('ln -sfn `readlink %s` %s' % (LASTGOOD_RELEASE, CURRENT_RELEASE))

def test():
    with settings(warn_only=True):
        test_result = local('grunt buster', capture=True)
    if test_result.failed and not confirm('Tests failed. Continue anyway?'):
        abort('You aborted it, didn\'t you?')

def _set_active_build(build_path):
    run('ln -sfn %s %s' % (build_path, CURRENT_RELEASE))

def _set_lastgood_build():
    run('ln -sfn `readlink %s` %s' % (CURRENT_RELEASE, LASTGOOD_RELEASE))

def _bump_version(version):
    output = local('grunt bump:%s' % version, capture=True)
    return re.findall(r'\d+\.\d+.\d+', output)[0]

def _build():
    local('grunt')
