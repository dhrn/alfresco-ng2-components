#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../..

if [ "$CI" = "true" ]; then
    echo "Building extensions for production"
    nx build extensions --prod || exit 1
else
    echo "Building extensions for development"
    nx build extensions || exit 1
fi
