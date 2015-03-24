[![Build Status](https://travis-ci.org/kostar111/rando3D.svg?branch=master)](https://travis-ci.org/kostar111/rando3D)


Démos
======

####Version 1 : Digital Elevation Model and Trek representations
https://kostar111.github.io/rando3D/demo/v1/

####Version 1.1 : DEM, Trek and Point of Interest
https://kostar111.github.io/rando3D/demo/v1.1/

####Version 1.2 : Camera Switcher added 
https://kostar111.github.io/rando3D/demo/v1.2/



INSTALL
======

### System ###

sudo add-apt-repository ppa:chris-lea/node.js   
sudo apt-get update   
sudo apt-get install nodejs   
sudo apt-get autoremove   
sudo ln -s /home/user/Download/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs  

### Repository ###

npm install


Run tests 
======

### Browser ###

file:///home/user/Geotrek_3D/rando3D/test/index.html

### Command-line ###

./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/index.html 




