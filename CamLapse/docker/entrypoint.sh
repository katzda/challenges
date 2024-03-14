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

set -a
gosu developer cp /run/secrets/env /var/www/mybusinesswebdir/.env;

# some of these can't be in dockerfile probably because of .env values being cached too early
gosu developer php artisan config:clear;
gosu developer php artisan view:clear;
gosu developer php artisan route:clear;
gosu developer php artisan event:clear;

/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf;
