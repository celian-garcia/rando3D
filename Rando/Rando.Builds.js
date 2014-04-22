// Rando.Builds.js 
// Builders of zone and route

var RANDO = RANDO || {};
RANDO.Builds = {};

/**
 * DEM() : build a heightMap corresponding of zone around a trek 
 *      - data : Object containing all informations to build DEM
 *      - scene (BABYLON.Scene) : current scene
 *      - cam_b (Boolean)       : settings of camera **optionnal**
 * 
 */
RANDO.Builds.DEM = function(data, scene, cam_b){
    if(typeof(cam_b)==='undefined') cam_b = true;
    
    // DEM building...
    console.log("DEM building... " + (Date.now() - RANDO.START_TIME) );
    
    var center = data.center;
    var resolution = data.resolution;
    var altitudes = data.altitudes;
    
    // Camera 
    if (cam_b){
        scene.activeCamera.rotation = new BABYLON.Vector3(0.6, 1, 0);
        scene.activeCamera.position = new BABYLON.Vector3(
            center.x-2000, 
            center.y+500, 
            center.z-1500
        );
    }
    
    // Material
    var material =  new BABYLON.StandardMaterial("GroundMaterial", scene);
    material.backFaceCulling = false;
    material.wireframe = true;
    
    // Create DEM
    var dem = RANDO.Utils.createGroundFromExtent(
        "Digital Elevation Model",
        data.extent.southwest,
        data.extent.southeast,
        data.extent.northeast,
        data.extent.northwest,
        resolution.x-1,
        resolution.y-1, 
        scene
    );
    dem.material = material;
    
    // Put elevations in the DEM
    var vertices = dem.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var i = 1;
    for (row in altitudes){
        for (col in altitudes[row]){
            vertices[i] = altitudes[row][col];
            i+=3;
        }
    }
    dem.setVerticesData(vertices, BABYLON.VertexBuffer.PositionKind);
    
    // DEM built ! 
    console.log("DEM built ! " + (Date.now() - RANDO.START_TIME) );
}

/**
 * TiledDEM() : build a DEM subdivided in multiple DEM corresponding of textured tiles
 *      - data : Object containing all informations to build DEM
 *      - scene (BABYLON.Scene) : current scene
 *      - cam_b (Boolean)       : settings of camera **optionnal**
 * 
 */
RANDO.Builds.TiledDEM = function(data, scene, cam_b){
    if(typeof(cam_b)==='undefined') cam_b = true;
    
    // Tiled DEM building...
    console.log("Tiled DEM building... " + (Date.now() - RANDO.START_TIME) );
    
    var center = data.center;
    var resolution = data.resolution;
    var altitudes = data.altitudes;
    var extent = data.extent;
    
    // Camera 
    if (cam_b){
        scene.activeCamera.rotation = new BABYLON.Vector3(0.6, 1, 0);
        scene.activeCamera.position = new BABYLON.Vector3(
            center.x-2000, 
            center.y+2500, 
            center.z-1500
        );
    }
    
    // Generates grid from extent datas
    var grid = RANDO.Utils.createGrid(
        data.orig_extent.southwest,
        data.orig_extent.southeast,
        data.orig_extent.northeast,
        data.orig_extent.northwest,
        resolution.x,
        resolution.y
    );
    
    // Gives altitudes to the grid 
    for (row in altitudes){
        for (col in altitudes[row]){
            grid[row][col].z = altitudes[row][col];
        }
    }
    
    // Subdivides current grid in tiles 
    var tiles = RANDO.Utils.subdivideGrid(grid, 16);
    
    console.log("Number of tiles: " + Object.keys(tiles).length);
    var dem = new BABYLON.Mesh("Digital Elevation Model", scene);
    
    // Creates all grounds 
    for (it in tiles) {
        var current = tiles[it].values;

        // Translates data over X and Y axis
        for (row in current) {
            for (col in current[row]) {
                current[row][col].x -= data.o_center.x,
                current[row][col].y -= data.o_center.z
            }
        }
        
        // Creates Tile
        var meshTile = RANDO.Utils.createGroundFromGrid(
            "Tiled Digital Elevation Model - " + it,
            current,
            scene
        );
            
        // Recomputes normals for lights and shadows
        var vertices = BABYLON.VertexData.ExtractFromMesh (meshTile);
        BABYLON.VertexData.ComputeNormals(vertices.positions, vertices.indices, vertices.normals);
        vertices.applyToMesh(meshTile);
        
        // Enables collisions
        meshTile.checkCollisions = true;
        
        // Material
        var material =  new BABYLON.StandardMaterial("DEM Material - " + it, scene);
        var texture = new BABYLON.Texture(
            RANDO.SETTINGS.TEX_TILED_URL + "" + it + ".png",
            scene,
            true,
            true
        );
        //~ texture.wAng = Math.PI;
        console.log(texture);
        material.diffuseTexture = texture;
        material.backFaceCulling = false;
        //~ material.wireframe = true;
        meshTile.material = material;

        meshTile.parent = dem;
    }

    // Builds sides of DEM
    RANDO.Builds.Sides(tiles, data.extent);
    
    // DEM built ! 
    console.log("Tiled DEM built ! " + (Date.now() - RANDO.START_TIME) );
    return dem;
}

/**
 * Sides(): build 4 sides of a DEM 
 *      - tiles: differents tiles of the DEM
 *      - extent of the DEM
 */
RANDO.Builds.Sides = function (tiles, extent) {
    var xmax = -Infinity;
    var xmin =  Infinity;
    var ymax = -Infinity;
    var ymin =  Infinity;
    
    // Get min and max coordinates of tiles
    for (it in tiles) {
        if ( tiles[it].coordinates.x > xmax ) {
            xmax = tiles[it].coordinates.x;
        }
        if ( tiles[it].coordinates.x < xmin ) {
            xmin = tiles[it].coordinates.x;
        }
        if ( tiles[it].coordinates.y > ymax ) {
            ymax = tiles[it].coordinates.y;
        }
        if ( tiles[it].coordinates.y < ymax ) {
            ymin = tiles[it].coordinates.y;
        }
    }
    
    var east_line = [];
    var west_line = [];
    var north_line = [];
    var south_line = [];
    for (it in tiles) {
        var tile =  tiles[it];
        
        if ( tile.coordinates.x == xmax ) {
            var last_col = tile.values[0].length -1;
            for (row in tile.values) {
                east_line.push(tile.values[row][last_col]);
            }
        }
        if ( tile.coordinates.x == xmin ) {
            var first_col = 0;
            for (row in tile.values) {
                west_line.push(tile.values[row][first_col]);
            }
        }
        
        if ( tile.coordinates.y == ymax ) {
            console.log(tile);
            var first_row = 0;
            for (col in tile.values[first_row]){
                north_line.push(tile.values[first_row][col]);
            }
        }
        if ( tile.coordinates.y == ymin ) {
            var last_row = tile.values.length-1;
            for (col in tile.values[last_row]){
                south_line.push(tile.values[last_row][col]);
            }
        }
    }
    
    var east_extent = {
        "A": extent.southeast,
        "B": extent.northeast,
        "C": extent.northeast,
        "D": extent.southeast
    };
    
    var west_extent = {
        "A": extent.southwest,
        "B": extent.northwest,
        "C": extent.northwest,
        "D": extent.southwest
    };
    
    var north_extent = {
        "A": extent.northwest,
        "B": extent.northwest,
        "C": extent.northeast,
        "D": extent.northeast
    };
    
    var south_extent = {
        "A": extent.southwest,
        "B": extent.southwest,
        "C": extent.southeast,
        "D": extent.southeast
    };
    
    side("East Side", east_line, east_extent, false);
    side("West Side", west_line, west_extent, true);
    side("North Side", north_line, north_extent, false);
    side("South Side", south_line, south_extent, true);
    
    function side(name, line, extent, reverse) {
        var side = RANDO.Utils.createGroundFromExtent(
            name,
            extent.A,
            extent.B,
            extent.C,
            extent.D,
            line.length-1,
            1,
            scene
        );
        
        if (reverse) {
            line.reverse();
        }
        
        var vertices = side.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var i = 0;
        for (it in line) {
            vertices[i++] = line[it].x;
            vertices[i++] = line[it].z;
            vertices[i++] = line[it].y; 
        }
        
        for (it in line) {
            vertices[i++] = line[it].x;
            vertices[i++] += 1000;
            vertices[i++] = line[it].y; 
        }
        side.setVerticesData(vertices, BABYLON.VertexBuffer.PositionKind);
        
        // Side material
        side.material = new BABYLON.StandardMaterial(name + "Material", scene);
        side.material.diffuseTexture = new BABYLON.Texture(RANDO.SETTINGS.SIDE_TEXTURE, scene);
        
        // Enables collisions
        side.checkCollisions = true;
    };

}

/**
* Trek() : build a trek from an array of point
*       - scene (BABYLON.Scene) : current scene
*       - vertices : array of vertices
*       - pan_b (bool): using of panel meshes to display informations **optionnal**
*/
RANDO.Builds.Trek = function(scene, vertices, pan_b ){
    if(typeof(pan_b)==='undefined') pan_b = true;
    
    RANDO.Utils.animateCamera(vertices, scene);
    
    // Trek building ...
    console.log("Trek building... " + (Date.now() - RANDO.START_TIME) );
    
    // Trek material
    var trek_material = new BABYLON.StandardMaterial("Trek Material", scene);
    trek_material.diffuseColor = RANDO.SETTINGS.TREK_COLOR;
    
    var n_sph = 0, 
        spheres = new BABYLON.Mesh("Spheres", scene);
    function createSphere(vertex) {
        n_sph++;
        var sphere = BABYLON.Mesh.CreateSphere(
            "Sphere " + n_sph, 
            5, 
            RANDO.SETTINGS.TREK_WIDTH, 
            scene
        );
        sphere.position = vertex;
        sphere.material = trek_material;
        sphere.parent = spheres;
    }
    
    var n_cyl = 0,
        cylinders = new BABYLON.Mesh("Cylinders", scene);
    function createCylinder(vertexA, vertexB) {
        n_cyl++;
        var cyl_height = BABYLON.Vector3.Distance(vertexA, vertexB);
        // Create Cylinder
        var cylinder = BABYLON.Mesh.CreateCylinder(
            "Cylinder " + n_cyl,
            cyl_height,
            RANDO.SETTINGS.TREK_WIDTH,
            RANDO.SETTINGS.TREK_WIDTH,
            10,
            scene
        );
        cylinder.material = trek_material;
        
        // Height is not a variable from BABYLON mesh, 
        //  it is my own variable I put on the cylinder to use it later
        cylinder.height = cyl_height;
        cylinder.parent = cylinders;
    }
    
    var dem = scene.getMeshByName("Digital Elevation Model");

    var prev, curr = null;
    for (var it in vertices){
        prev = curr;
        var curr = new BABYLON.Vector3(
            vertices[it].x,
            vertices[it].y,
            vertices[it].z
        );
        
        createSphere(curr);
        if (prev) {
            createCylinder(prev, curr);
        }
    } 

    // Trek built !
    console.log("Trek built ! " + (Date.now() - RANDO.START_TIME) );
}

/**
 * cardinals() : build the NW, NE, SE and SW extrems points of the DEM with spheres
 * 
 *      - extent : contain the four corners of the DEM
 *      - scene  : current scene  
 * 
 * NB : each point have its own color
 *          NW --> White 
 *          NE --> Red
 *          SE --> Blue
 *          SW --> Green
 * 
 */
RANDO.Builds.Cardinals = function(extent, scene){

    var tmp;
    var sph_diam = 20;
    var matA = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var A = BABYLON.Mesh.CreateSphere("SphereA", 5, sph_diam, scene);
    tmp = extent.northwest;
    A.position.x = tmp.x;
    A.position.y = 1500;
    A.position.z = tmp.y;
    matA.diffuseColor = new BABYLON.Color3(255,255,255);
    A.material = matA;
    
    var matB = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var B = BABYLON.Mesh.CreateSphere("SphereB", 5, sph_diam, scene);
    tmp = extent.northeast;
    B.position.x = tmp.x;
    B.position.y = 1500;
    B.position.z = tmp.y;
    matB.diffuseColor = new BABYLON.Color3(255,0,0);
    B.material = matB;
    
    var matC = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var C = BABYLON.Mesh.CreateSphere("SphereC", 5, sph_diam, scene);
    tmp = extent.southeast;
    C.position.x = tmp.x;
    C.position.y = 1500;
    C.position.z = tmp.y;
    matC.diffuseColor = new BABYLON.Color3(0,0,255);
    C.material = matC;
    
    var matD = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var D = BABYLON.Mesh.CreateSphere("SphereD", 5, sph_diam, scene);
    tmp = extent.southwest;
    D.position.x = tmp.x;
    D.position.y = 1500;
    D.position.z = tmp.y;
    matD.diffuseColor = new BABYLON.Color3(0,255,0);
    D.material = matD;


}

/**
 *  Camera() : initialize main parameters of camera    
 *      - scene : the current scene
 * 
 *  return the camera
 * */
RANDO.Builds.Camera = function(scene){
    var camera  = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 0), scene);
    camera.checkCollisions = true;
    camera.maxZ = 10000;
    camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;
    camera.keysUp = [90, 38]; // Touche Z
    camera.keysDown = [83, 40]; // Touche S
    camera.keysLeft = [81, 37]; // Touche Q
    camera.keysRight = [68, 39]; // Touche D
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1); // Hitbox
    var l_cam = new BABYLON.HemisphericLight("LightCamera", new BABYLON.Vector3(0,1000,0), scene)
    l_cam.intensity = 0.8;
    l_cam.specular = new BABYLON.Color4(0, 0, 0, 0);
    l_cam.parent = camera;
    return camera;
}

/**
 *  Lights() : initialize main parameters of lights    
 *      - scene : the current scene
 * 
 *  return an array containing all lights
 * */
RANDO.Builds.Lights = function(scene){
    var lights = [];
    
    // Sun
    var sun = new BABYLON.HemisphericLight("Sun", new BABYLON.Vector3(500, 2000, 0), scene);
    sun.specular = new BABYLON.Color4(0, 0, 0, 0);
    lights.push(sun);
    return lights;
}
