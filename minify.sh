#get version without "v"
version=$(echo git describe --tags)
version=$($version | sed 's/v//')

#name the minified file
min="rando3D.""$version"".js"

#Concat all js files in a temporary file
tmp=$(echo "tmp.js")
cat Rando/*.js Rando/Cameras/*.js > $tmp

#Minify the temporary file
yui-compressor -o $min $tmp

#clean directory from useless tmp
rm $tmp