#!/bin/bash

# NOTE: This requires GNU getopt.  On Mac OS X and FreeBSD, you have to install this separately.
# Specify short options after -o, and long options after --long. Put a colon after options that take a value.
TEMP=`getopt -o t:b:e:hr --long theme:,browser:,environment:,dl,disable_lint,help,reset \
             -n 'local_build' -- "$@"`
if [ $? != 0 ] ; then echo "Terminating..." >&2 ; exit 1 ; fi

# Note the quotes around `$TEMP': they are essential!
eval set -- "$TEMP"

RESET=false
LINT=true
HELP=false
while true; do
  case "$1" in
    -t | --theme ) EXTENSION_BRAND="$2"; shift 2 ;;
    -b | --browser ) BROSWER="$2"; shift 2 ;;
    -e | --environment ) ENVIRONMENT="$2"; shift 2 ;;
    -r | --reset ) RESET=true; shift ;;
    --dl | --disable_lint ) LINT=false; shift ;;
    -h | --help ) HELP=true; shift ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

if $HELP ; then
    echo
    echo "Build Option:"
    echo "  -t | --theme            => Build theme            (e.g. search-select)"
    echo "  -b | --browser          => Build for browser      (e.g chrome)"
    echo "  -e | --environment      => Build for environment  (e.g production)"
    echo "  --dl | --disable_lint   => Disable linting        (ts and scss)"
    echo
    echo "Other Options:"
    echo "  -r | --reset  => Reset repo to head and exit"
    echo "  -h | --help   => Print this help message and exit"
    echo
    echo "Example:"
    echo "./local_build.sh -t search-select -b chrome -e dev --dl"
    echo
    exit
fi

if $RESET ; then
    git fetch origin
    git reset --hard origin/$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
    exit
fi

if [ -z "$EXTENSION_BRAND" ]; then
    echo
    echo "> Defaulting your theme to search-select"
    echo "  You can specify a theme with -t | --theme flags eg. ./local_build -t search-select"
    echo
    EXTENSION_BRAND="search-select"
else
    echo
    echo "> Theme set to $EXTENSION_BRAND"
    echo
fi

if [ -z "$BROWSER" ]; then
    echo "> Defaulting your browser to chrome"
    echo "  You can specify a browser with -b | --browser flags eg. ./local_build -b chrome"
    echo
    BROWSER="chrome"
else
    echo "> Browser set to $BROWSER"
    echo
fi

if [ -z "$ENVIRONMENT" ]; then
    echo "> Defaulting your ENVIRONMENT to production"
    echo "  You can specify an environement with -e | --env flags eg. ./local_build -t search-select -e production"
    echo
    ENVIRONMENT="production"
else
    echo "> Environment set to $ENVIRONMENT"
    echo
fi

if [ ! -f "branding/${EXTENSION_BRAND}/js/theme-${ENVIRONMENT}.ts" ]; then
    echo "!!! Missing branding/${EXTENSION_BRAND}/js/theme-${ENVIRONMENT}.ts !!!"
    echo "Exiting....."
    exit;
fi

if [ ! -f "branding/${EXTENSION_BRAND}/manifest/${BROWSER}/manifest-overrides-${ENVIRONMENT}.json" ]; then
    echo "!!! Missing branding/${EXTENSION_BRAND}/manifest/${BROWSER}/manifest-overrides-${ENVIRONMENT}.json !!!"
    echo "Exiting....."
    exit;
fi

npm install --silent

if $LINT ; then
    npm run lint-all
fi

npm run tsc

yes | cp -rf branding/$EXTENSION_BRAND/images/* src/images
yes | cp branding/$EXTENSION_BRAND/js/theme-$ENVIRONMENT.js src/scripts/theme.js
yes | cp -rf branding/$EXTENSION_BRAND/css/* src/css

cat src/manifest.json branding/$EXTENSION_BRAND/manifest/${BROWSER}/manifest-overrides-$ENVIRONMENT.json | $(npm bin)/json --deep-merge > src/manifest.json
cat src/scripts/search/searchUtil.config.json branding/$EXTENSION_BRAND/searchUtil.config.overrides.json | $(npm bin)/json --deep-merge > src/scripts/search/searchUtil.config.json

echo "Local Build Done"
