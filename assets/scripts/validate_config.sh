#!/bin/bash
set -e

printf "Validating Caddyfile configs\n"

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null && pwd )"
CADDY_BIN=$HOME/dev/go/src/github.com/greenpau/caddy-security/bin/caddy

echo ${BASEDIR}

for f in `find ${BASEDIR} -type f -name 'Caddyfile'`; do
    printf "Validating $f\n";
    $CADDY_BIN fmt -overwrite $f;
    $CADDY_BIN validate -config $f;
done
