#!/bin/bash

searchString="url(/static/dataiku/fonts/"
replaceString="url(./fonts/"

sed -i '' "s#$searchString#$replaceString#g" dku-less/fonts.less && \
rm -f dku-less/*.scss && \
less2sass dku-less/color-variables.less && \
less2sass dku-less/fonts-variables.less && \
less2sass dku-less/fonts.less && \
less2sass dku-less/fonts-mixins.less && \
mv dku-less/*.scss src/css