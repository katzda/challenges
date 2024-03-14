#!/bin/bash

#group id needs to be the same as host
groupmod -g $GROUP_ID developer
# lets also make UID the same as host
usermod -u $USER_ID developer

# all users must belong to the developer group
usermod -aG developer developer
usermod -aG developer www-data

# dockerfile, esp for prod, might have created all laravel files with default uid gid, so I need to check and update them
CURR_OWN=$(ls -ld ./storage | awk '{print $3}');
if [ "$CURR_OWN" != "developer" ];
then
  echo "changing ownership of all files, pls be patient, this can take a long time";
  chown -R developer .;
fi;

CURR_GRP=$(ls -ld ./storage | awk '{print $4}');
if [ "$CURR_GRP" != "developer" ];
then
  echo "changing group on all files, pls be patient, this can take a long time";
  chgrp -R developer .;
fi;

#ONLY NOW I CAN START WRITING INTO THE LARAVEL DIRECTORY
#create empty directories, because in production laravel might complain that paths don't exist even if redis is used

gosu developer mkdir -p \
  /home/developer/apache2 \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/testing \
  storage/framework/views;

# mkdir -p \
#   /var/log/supervisor \
#   /var/log/apache2;

# # the following worked
# echo "" > /var/log/supervisor/horizon.log
# echo "" > /var/log/supervisor/supervisord.log
# echo "" > /var/log/apache2/error.log
# echo "" > /home/developer/web_error.log
# echo "" > /home/developer/web_transfer.log

# # the following appeared empty
# echo "" > /var/log/supervisor/apache2d.log #this was empty!?
# echo "" > /var/log/apache2/access.log #this was empty!?
# echo "" > /var/log/apache2/other_vhosts_access.log #this was empty!?

# build .env file from secrets
set -a
. /run/secrets/websecrets;
. /run/secrets/redissecrets;
export POSTGRES_USER=$(cat /run/secrets/dbusername);
export POSTGRES_PASSWORD=$(cat /run/secrets/dbpassword);
export MAIL_USERNAME=$(cat /run/secrets/mailusername);
export MAIL_PASSWORD=$(cat /run/secrets/mailpassword);

escape="s/([\\&/\"])/\\\\\1/g";

URL=$(echo "$URL" | sed -E "$escape");
APP_NAME=$(echo "$APP_NAME" | sed -E "$escape");
APP_1_ID=$(echo "$APP_1_ID" | sed -E "$escape");
LOG_SLACK_WEBHOOK_URL=$(echo "$LOG_SLACK_WEBHOOK_URL" | sed -E "$escape");
REDIS_PASSWORD=$(echo "$REDIS_PASSWORD" | sed -E "$escape");
POSTGRES_PASSWORD=$(echo "$POSTGRES_PASSWORD" | sed -E "$escape");
APP_KEY=$(echo "$APP_KEY" | sed -E "$escape");
PUSHER_APP_SECRET=$(echo "$PUSHER_APP_SECRET" | sed -E "$escape");
MAIL_USERNAME=$(echo "$MAIL_USERNAME" | sed -E "$escape");
MAIL_PASSWORD=$(echo "$MAIL_PASSWORD" | sed -E "$escape");
URL_PROD=$(echo "$URL_PROD" | sed -E "$escape");
TESTER_PASSWORD=$(echo "$TESTER_PASSWORD" | sed -E "$escape");
OWNERS_EMAIL=$(echo "$OWNERS_EMAIL" | sed -E "$escape");
GOOGLE_CLIENT_ID=$(echo "$GOOGLE_CLIENT_ID" | sed -E "$escape");
GOOGLE_CLIENT_SECRET=$(echo "$GOOGLE_CLIENT_SECRET" | sed -E "$escape");
set +a

gosu developer cp ./docker/artifacts/.env.example /var/www/mybusinesswebdir/.env
gosu developer sed -i "s/&EMAIL_ADDRESS&/nobody@$URL/g;s/&APP_NAME&/$APP_NAME/g;s/&DB_HOSTNAME&/$DB_HOSTNAME/g;s/&APP_1_ID&/$APP_1_ID/g; \
            s/&DB_PORT&/$DB_PORT/g;s/&PUSHER_APP_PORT&/$PUSHER_APP_PORT/g;s/&REDIS_HOST&/$REDIS_HOST/g;s/&POSTGRES_DB&/$POSTGRES_DB/g; \
            s/&POSTGRES_USER&/$POSTGRES_USER/g;s/&APP_DEBUG&/$APP_DEBUG/g;s/&LOG_SLACK_WEBHOOK_URL&/$LOG_SLACK_WEBHOOK_URL/g; \
            s/&REDIS_PASSWORD&/$REDIS_PASSWORD/g;s/&APP_ENV&/$APP_ENV/g;s/&POSTGRES_PASSWORD&/$POSTGRES_PASSWORD/g;s/&URL&/$URL/g; \
            s/&APP_KEY&/$APP_KEY/g;s/&GOOGLE_CLIENT_ID&/$GOOGLE_CLIENT_ID/g;s/&GOOGLE_CLIENT_SECRET&/$GOOGLE_CLIENT_SECRET/g; \
            s/&PUSHER_APP_SECRET&/$PUSHER_APP_SECRET/g;s/&MAIL_USERNAME&/$MAIL_USERNAME/g; \
            s/&MAIL_PASSWORD&/$MAIL_PASSWORD/g;s/&URL_PROD&/$URL_PROD/g;s/&TESTER_PASSWORD&/$TESTER_PASSWORD/g; \
            s/&OWNERS_EMAIL&/$OWNERS_EMAIL/g;" /var/www/mybusinesswebdir/.env;

# this can't be in dockerfile build because it depends on live DB server
gosu developer php artisan migrate --force;
gosu developer php artisan db:seed --force;

# some of these can't be in dockerfile probably because of .env values being cached too early
gosu developer php artisan config:clear;
gosu developer php artisan view:clear;
gosu developer php artisan route:clear;
gosu developer php artisan event:clear;

gosu developer php artisan config:cache;
gosu developer php artisan view:cache;
gosu developer php artisan route:cache;
gosu developer php artisan event:cache;

/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf;
