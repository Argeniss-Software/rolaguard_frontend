#!/bin/sh

set -e

if [ ! -z ${REACT_APP_API_HOST} ]; then
 echo updating React settings from env vars
cat <<EOT > /usr/share/nginx/html/config.js
 window.RUNTIME_API_HOST='${REACT_APP_API_HOST}';
 window.RUNTIME_WS_HOST='${REACT_APP_WS_HOST}';
 window.RECAPTCHA_SITEKEY='${RECAPTCHA_SITEKEY}';
EOT
else
 echo no env vars defined, React config file won\'t be updated: /usr/share/nginx/html/config.js !!
fi
 echo done!

nginx -g "daemon off;"