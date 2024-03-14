###################
# BASE            #
###################
FROM ubuntu:20.04 as base

#temporarily install curl
RUN apt-get update && apt-get install -y curl gosu;
RUN ln -snf /usr/share/zoneinfo/$(curl https://ipapi.co/timezone -s) /etc/localtime;

# user
RUN groupadd developer; \
    useradd developer -m -g developer; \
    umask 002 \
    echo umask 002 >> /home/developer/.bashrc

#php 8.3
RUN apt-get update && apt-get install -y \
    lsb-release ca-certificates apt-transport-https software-properties-common -y; \
    add-apt-repository ppa:ondrej/php; \
    apt-get update && apt-get install -y \
    php8.3 libapache2-mod-php8.3 \
    php-redis \
    php8.3-cli \
    php8.3-curl \
    php8.3-common \
    php8.3-mbstring \
    php8.3-opcache \
    php8.3-readline \
    php8.3-xml \
    php8.3-zip \
    php8.3-pgsql \
    php8.3-sqlite3 \
    php8.3-bcmath \
    php8.3-intl \
    php8.3-memcached \
    php8.3-imap \
    php8.3-msgpack \
    php8.3-gd \
    php8.3-zmq; \
    apt-get -y autoremove; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*;

# apache2
RUN apt-get update && apt-get install -y apache2; \
    rm -rf /var/www/html; \
    a2dissite 000-default.conf; \
    rm /etc/apache2/sites-available/*;

ARG URL_PROD
ARG URL_QA
ARG URL_DEV
ARG OWNERS_EMAIL

USER root
COPY ./docker/artifacts/web.conf /etc/apache2/sites-available/$URL_PROD.conf
RUN sed -i "s/&URL_PROD&/$URL_PROD/g;s/&URL_QA&/$URL_QA/g;s/&URL_DEV&/$URL_DEV/g;s/&OWNERS_EMAIL&/$OWNERS_EMAIL/g;" /etc/apache2/sites-available/$URL_PROD.conf; \
    sed -i -E  "s/(export APACHE_RUN_USER=)(.*$)/\1developer/;s/(export APACHE_RUN_GROUP=)(.*$)/\1developer/" /etc/apache2/envvars; \
    sed -i -E  "s/#(ServerRoot .*)$/\1\nServerName $URL_PROD/;s/(ErrorLog ).*$/\1\/var\/log\/apache2\/error.log/;" /etc/apache2/apache2.conf; \
    a2enmod rewrite; \
    a2enmod ssl; \
    a2ensite $URL_PROD.conf;

#supervisor
RUN apt-get update && apt-get install -y supervisor; \
    sed -i -E 's/(\[supervisord\])/\1\nuser=root/;s/(logfile=).*/\1\/var\/log\/supervisor\/supervisord.log/' /etc/supervisor/supervisord.conf; \
    mkdir -p /home/developer/supervisor;

RUN chown developer /var/www/;
USER developer
RUN mkdir       /var/www/mybusinesswebdir; \
    chmod 775   /var/www/mybusinesswebdir;

USER root

WORKDIR /var/www/mybusinesswebdir

CMD ["/usr/bin/supervisord"]

###################
# DEV             #
###################
FROM base as dev

RUN apt-get update && apt-get install -y \
    nano vim unzip iputils-ping silversearcher-ag net-tools netcat npm; \
    npm install -g n; \
    n latest;

# composer
RUN cd /home/developer; \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    php -r "if (hash_file('sha384', 'composer-setup.php') === 'baf1608c33254d00611ac1705c1d9958c817a1a33bce370c0595974b342601bd80b92a3f46067da89e3b06bff421f182') \
            { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"; \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer; \
    php -r "unlink('composer-setup.php');";\
    apt-get -y autoremove; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*;

# xdebug
RUN apt-get update && apt-get install -y php8.3-xdebug

# ARG HOST_IP
# RUN echo "zend_extension=/usr/lib/php/20220829/xdebug.so\n \
# #         xdebug.var_display_max_depth=10\n \
# #         xdebug.var_display_max_children=256\n \
# #         xdebug.var_display_max_data=1024\n \
# #         xdebug.force_display_errors=on\n \
# #         xdebug.remote_timeout=50\n \
# #         xdebug.remote_log=/var/www/barbershop.com/xdebug.log \n \
# #         xdebug.remote_log_level=9\n \
# #         xdebug.remote_connect_back=on\n \
#          xdebug.remote_enable=on\n \
#          xdebug.remote_host=$HOST_IP\n \
#          xdebug.remote_autostart=on \n \
#          xdebug.remote_port=9900" > /etc/php/8.3/mods-available/xdebug.ini;

#REPEATED SECTION FROM HERE
USER root
COPY ./docker/entrypoint.sh /usr/bin/entrypoint.sh
COPY ./docker/artifacts/supervisor/apache2d.conf /etc/supervisor/conf.d/apache2d.conf
RUN chmod 544 /usr/bin/entrypoint.sh;

RUN apt-get update && apt-get install -y v4l-utils

ENV APP_DEBUG true
ENTRYPOINT ["entrypoint.sh"]
#REPEATED SECTION ENDS HERE

###################
# BUILD           #
###################
FROM dev as build

COPY . /var/www/mybusinesswebdir/

RUN chown -R developer /var/www/mybusinesswebdir; \
    chgrp -R developer /var/www/mybusinesswebdir; \
    cd /var/www/mybusinesswebdir;

USER developer

RUN mkdir -p \
    /home/developer/apache2 \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views;

# config:clear because that breaks feature tests
# route:clear because caching causes 500 server error
RUN composer install --no-dev --no-interaction --optimize-autoloader; \
    npm install; \
    npm run prod; \
    composer dump-autoload; \
    php artisan livewire:publish --assets;

########
# PROD #
########
FROM base as prod

USER developer
COPY --from=build /var/www/mybusinesswebdir /var/www/mybusinesswebdir

USER root
RUN chmod 775 /var/www/mybusinesswebdir;
    # cd /var/www/mybusinesswebdir; \
    # find . -type d -exec chmod 755 -- {} +; \
    # # these are restrected only because it otherwise takes forever. But I could enable it for prod but maybe not for QA
    # find . -not -path "*/node_modules/*" -not -path "*/vendor/*" -type f -exec chmod 444 -- {} +; \
    # find storage -type f -exec chmod 664 -- {} +; \
    # find storage -type d -exec chmod 775 -- {} +; \
    # find bootstrap/cache -type f -exec chmod 664 -- {} +; \
    # find bootstrap/cache -type d -exec chmod 775 -- {} +;

#REPEATED SECTION FROM HERE
COPY ./docker/entrypoint.sh /usr/bin/entrypoint.sh
COPY ./docker/artifacts/supervisor/apache2d.conf /etc/supervisor/conf.d/apache2d.conf
RUN chmod 544 /usr/bin/entrypoint.sh;

ENV APP_DEBUG false
ENTRYPOINT ["entrypoint.sh"]
#REPEATED SECTION ENDS HERE

EXPOSE 80