// Rando.Json.js 
// All transformations and getters for the json DEM file

var RANDO = RANDO || {};
RANDO.Json = {};

/**
 *  decode() : decode a DEM applying a transformation  
 *      - dem : DEM to decode
 *      - transform: transformations to apply
 */
RANDO.Json.decode = function(dem, transform){
    if (transform['scale']!= 1)
        dem = RANDO.Json.scale(dem, transform['scale']);
        
    if (transform['translate'][0]!= 0)
        dem = RANDO.Json.translate_x(dem, transform['translate'][0]);
        
    if (transform['translate'][1]!= 0)
        dem = RANDO.Json.translate_y(dem, transform['translate'][1]);
    
    if (transform['translate'][2]!= 0)
        dem = RANDO.Json.translate_z(dem, transform['translate'][2]);
    
    return dem; 
};
    
/**
 *  scale() : Scale the DEM with a coefficient 
 * 
 *      - dem : DEM to scale
 *      - coeff : scale coefficient
 */
RANDO.Json.scale = function(dem, coeff){
    for (var i=0; i<3;i++){
        dem['center'][i] = dem['center'][i] / coeff;
    }
    for (var i=0; i<dem['z_altitudes'].length;i++){
        dem['z_altitudes'][i] = dem['z_altitudes'][i] / coeff;
    }

    dem['width'] = dem['width'] / coeff;
    dem['height'] = dem['height'] / coeff;
    dem['x0'] = dem['x0'] / coeff;
    dem['y0'] = dem['y0'] / coeff;
    dem['step'] = dem['step'] / coeff;

    return dem;
};

/**
 *  translate_x() : Translate the DEM along the x axis
 *      - dem : DEM to translate
 *      - val : translation's value
 */
RANDO.Json.translate_x = function(dem, val){
    dem['center'][0] -= val;
    dem['x0'] -= val;
    return dem;
}

/**
 *  translate_y() : Translate the DEM along the y axis
 *      - dem : DEM to translate
 *      - val : translation's value
 */
RANDO.Json.translate_y = function(dem, val){
    dem['center'][1] -= val;
    dem['y0'] -= val;
    return dem;
}

/**
 *  translate_z() : Translate the DEM along the z axis
 *      - dem : DEM to translate
 *      - val : translation's value
 */
RANDO.Json.translate_z = function(dem, val){
    dem['center'][2] -= val;
    for (var i=0; i<dem['z_altitudes'].length;i++){
        dem['z_altitudes'][i] -= val;
    }
    return dem;
}

/**
 *  get_vertices() : get DEM vertices
 *      - dem : DEM of the terrain
 * 
 *  return an array composed by vertices coordinates in this format :
 *          vertices = [ x1, z1, y1, x2, z2, y2, ... xn, zn, yn ] 
 *  (n : number of vertices)
 */
RANDO.Json.get_vertices = function(dem){
        
    var vertices = [];
    var stepw = dem.width/dem.w_sub,
        steph = dem.height/dem.h_sub;
    var width = dem.width;
    var height = dem.height;

    
    // Computes x values
    var x_values = [];
    for (var i=0; i<width; i+=stepw){
        x_values.push(i); 
    } 

    // Computes y values
    var y_values = [];
    for (var i=0; i<height; i+=steph){
        y_values.push(i); 
    } 

    console.assert(x_values.length == dem.w_sub);
    console.assert(y_values.length == dem.h_sub);
    console.assert(x_values.length * y_values.length == dem.z_altitudes.length,
                   (x_values.length * y_values.length) + ' != ' + dem.z_altitudes.length);

    // Fills array of vertices
    var k=0;
    for (var j=0; j<y_values.length ;j++){
        for (var i=0; i<x_values.length ;i++){
            vertices.push(x_values[i] * 80000);
            vertices.push(dem.z_altitudes[k]);
            vertices.push(y_values[j] * 100000);
            k++;
        }
    }
    console.assert(dem.z_altitudes.length*3 == vertices.length);
    console.log(vertices.slice(0, 100));
    return vertices ;
}

/**
 *  get_resolution() : get DEM resolution
 *      - dem : DEM of the terrain
 * 
 *  return a dictionnary containing 
 *          - width  subdivisions
 *          - height subdivisions
 */
RANDO.Json.get_resolution = function(dem){
    return { 
        "w_sub": dem.w_sub -1,
        "h_sub": dem.h_sub -1
    };
}

/**
 *  get_center() : get DEM center
 *      - dem : DEM of the terrain
 * 
 *  return an array containing the coordinates of the center in this format :
 *      center = [ x, z, y ]
 */
RANDO.Json.get_center = function(dem){
    var center = [];
    center.push(dem.center[0]);
    center.push(dem.center[2]);
    center.push(dem.center[1]);
    
    return center ;
}

//Converts given lat/lon in WGS84 Datum to XY in Spherical Mercator EPSG:900913
RANDO.Json.latLonToMeters = function (lat, lon){
    var distance = null;
    if(typeof(lon)==='undefined') distance = lat;
    if (distance){
        var m_dist = 0;
        
        
        return m_dist;
    }
    else{
        var originShift = 2 * math.pi * 6378137 / 2.0;
        var M = {
            'x' : 0,
            'y' : 0 
        }
        
        var x = lon * originShift / 180.0;
        M.x = x;
        
        var y = Math.log( Math.tan((90 + lat) * Math.PI / 360.0 )) / (Math.PI / 180.0);
        y = y * originShift / 180.0;
        M.y = y;
        
        return M;
    }
    
}


RANDO.Json.toMeters = function (val){
    // SELECT ST_Length(ST_Transform('SRID=4326; LINESTRING(0 44.26, 1 44.26)'::geometry, 2154))
    var coeff = 100000.0;//79839;
    if (typeof(val)==='number') 
        return val * coeff;
    if (typeof(val)==='object' || typeof(val)==='array'){
        for (i in val){
            val[i] = val[i]*coeff;
        }
        return val;
    }
    
        
}





















