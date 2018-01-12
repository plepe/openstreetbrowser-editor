# openstreetbrowser-editor
An editor for OpenStreetBrowser categories

# INSTALL
Prepare installation (based on a plain Ubuntu 16.04 server installation):

```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install git apache2 libapache2-mod-php composer nodejs
cd /var/www/html
sudo chown USER: . # replace USER by your username
```

Actual installation routine:
```sh
git clone https://github.com/plepe/openstreetbrowser-editor.git
cd openstreetbrowser-editor
git submodule init
git submodule update
composer install
npm install
cp conf.php-dist conf.php
nano conf.php
```

Make a categories directory writeable by the web server (Ubuntu). This uses file system ACLs and makes sure that the web server (user `www-data`) can write and all changes will again be writeable by the web server and you (replace MY-USERNAME by your username):
```sh
setfacl -R -m user:www-data:rwX node_modules/openstreetbrowser-categories-main/
setfacl -R -dm user:www-data:rwX node_modules/openstreetbrowser-categories-main/
setfacl -R -dm user:MY-USERNAME:rwX node_modules/openstreetbrowser-categories-main/
```
