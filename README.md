# openstreetbrowser-editor
An editor for OpenStreetBrowser categories

# INSTALL
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
setfacl -R -m user:www-data:rwX openstreetbrowser-categories-main/
setfacl -R -dm user:www-data:rwX openstreetbrowser-categories-main/
setfacl -R -dm user:MY-USERNAME:rwX openstreetbrowser-categories-main/
```
