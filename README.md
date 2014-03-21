INSTALL
======

# System

sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get autoremove
sudo ln -s /home/celian/Download/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

# Repository

npm install mocha chai mocha-phantomjs


# Run tests

Browser

file:///home/celian/Geotrek_3D/kata_fizzbuzz/test/index.html

Command-line

./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/index.html 




