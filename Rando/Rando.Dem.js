RANDO = RANDO || {};

(function () {

    RANDO.Dem = function (data, offsets, scene) {
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        
        this._tiles = {};
        
        this._generateTiles();
        RANDO.Utils.computeTilesUvs(this._tiles);
        
        this.ground = this.buildGround();
        this.sides  = this.buildSides();
        console.log(this._tiles);
    };

    RANDO.Dem.prototype = {
        buildGround:        buildGround,
        buildSides:         buildSides,
        _generateTiles :    _generateTiles
    };

})();

function buildGround () {
    // Tiled DEM building...
    console.log("Tiled DEM building... " + (Date.now() - RANDO.START_TIME) );
    var scene = this._scene;
    var center = this._data.center;
    var offsets = this._offsets;
    var tiles = this._tiles;
    
    
    // Creates the container of tiles
    var dem = new BABYLON.Mesh("Digital Elevation Model", scene);
    
    // Camera 
    RANDO.Utils.placeCameraByDefault(scene.activeCamera, new BABYLON.Vector3(
        center.x + offsets.x, 
        center.y + offsets.y, 
        center.z + offsets.z
    ));
    
    // Creates all tiles 
    for (it in tiles) {
        // Builds a tile
        var meshTile = RANDO.Builds.Tile(tiles[it], offsets, scene);
        meshTile.parent = dem;
    }
    
    // DEM built ! 
    console.log("Tiled DEM built ! " + (Date.now() - RANDO.START_TIME) );
};

function buildSides () {
    
};

function _generateTiles () {
    var extent = this._data.extent;
    var altitudes = this._data.altitudes;
    var offsets = this._offsets;
    var zoom = RANDO.SETTINGS.TILE_ZOOM;
    
    
    // Creates grid from extent datas
    var grid = RANDO.Utils.createGrid(
        extent.southwest, 
        extent.southeast,
        extent.northeast,
        extent.northwest,
        altitudes[0].length,
        altitudes.length
    );

    // Gives altitudes to the grid 
    for (row in altitudes){
        for (col in altitudes[row]){
            grid[row][col].z = grid[row][col].y;
            grid[row][col].y = altitudes[row][col];
        }
    }
    
    var tiles = this._tiles,
        curr_index,  prev_index  = null,
        curr_point,  prev_point  = null,
        curr_tile_n, prev_tile_n = null,
        line_tmp = [],
        new_line = true;
        
    // Subdivide grid in tiles 
    for (row in grid) {
        for (col in grid[row]) {
            curr_point = grid[row][col];

            // Get current tile number corresponding to the current point
            curr_tile_n = RANDO.Utils.meters2num( curr_point.x, curr_point.z, zoom );
            curr_index = "" + zoom + "/" + curr_tile_n.xtile + "/" + curr_tile_n.ytile + "";

            // tiles["z/x/y"] exists or not
            tiles[curr_index] = tiles[curr_index] || {};

            // if the previous index exists and is different from the current index
            if ( prev_index != null && prev_index != curr_index ) {
                if ( tiles[prev_index].grid == null ) {
                    tiles[prev_index].grid = [];
                    tiles[prev_index].coordinates = {
                        z: zoom,
                        x: prev_tile_n.xtile,
                        y: prev_tile_n.ytile 
                    };
                }
                tiles[prev_index].grid.push(line_tmp); // push the line into previous tile

                line_tmp = []; // reset the line
            }

            line_tmp.push($.extend({}, curr_point));

            prev_index = curr_index;
            prev_point = curr_point;
            new_line = false;
            prev_tile_n = curr_tile_n;
        }
        new_line = true;
    }
    
    // Push the last line of the last tile 
    tiles[curr_index].grid.push(line_tmp);
    
    // At this moment, tiles are not joined at all, so we need to join it 
    tiles = RANDO.Utils.joinTiles(tiles);
    
    return tiles;
};










/**
 * TiledDEM() : build a DEM subdivided in multiple DEM corresponding of textured tiles
 *      - data: Object containing all informations to build DEM
 *      - scene (BABYLON.Scene) : current scene
 *      - cam_b (Boolean)       : settings of camera **optionnal**
 * 
 */
RANDO.Builds.TiledDEM = function (data, offsets, scene){
    // Tiled DEM building...
    console.log("Tiled DEM building... " + (Date.now() - RANDO.START_TIME) );

    // Creates the container of tiles
    var dem = new BABYLON.Mesh("Digital Elevation Model", scene);

    // Store data
    var center = data.center;
    var resolution = data.resolution;
    var altitudes = data.altitudes;
    var extent = data.extent;

    // Camera 
    RANDO.Utils.placeCameraByDefault(scene.activeCamera, new BABYLON.Vector3(
        center.x + offsets.x, 
        center.y + offsets.y, 
        center.z + offsets.z
    ));

    // Generates grid of points from the original extent and altitudes
    var grid = RANDO.Utils.generateGrid( extent, altitudes );

    // Subdivides current grid in tiles 
    var tiles = RANDO.Utils.subdivideGrid(grid, RANDO.SETTINGS.TILE_ZOOM);
    console.log("Number of tiles: " + Object.keys(tiles).length);

    RANDO.Utils.computeTilesUvs(tiles);

    

    // Builds sides of DEM
    RANDO.Builds.Sides(tiles, extent, scene);

    
    return dem;
}

/**
 * Tile() : build a tile of the DEM
 *      - data: Object containing all informations to build a Tile
 * 
 */
RANDO.Builds.Tile = function (data, offsets, scene) {
    // Translates data over X and Y axis
    var grid = data.grid;
    for (row in grid) {
        for (col in grid[row]) {
            grid[row][col].x += offsets.x;
            grid[row][col].y += offsets.y;
            grid[row][col].z += offsets.z;
        }
    }
    
    // Creates Tile
    var tile = RANDO.Utils.createGroundFromGrid(
        "Tiled Digital Elevation Model - " + it,
        data.grid,
        scene
    );

    // Recomputes normals for lights and shadows
    RANDO.Utils.computeMeshNormals(tile)
    
    // 
    RANDO.Utils.setMeshUvs(tile, data.uv);
    
    // Enables collisions
    tile.checkCollisions = true;
    
    // Get url of the texture
    var url = RANDO.Utils.replaceUrlCoordinates(
        RANDO.SETTINGS.TILE_TEX_URL,
        data.coordinates.z, 
        data.coordinates.x, 
        data.coordinates.y
    );
    
    // Material & Texture
    var material =  new BABYLON.StandardMaterial("DEM Material - " + it, scene);
    var texture = new BABYLON.Texture(
        url,
        scene,
        true,
        true
    );
    material.diffuseTexture = texture;
    material.backFaceCulling = false;
    //~ material.wireframe = true;
    tile.material = material;

    return tile;
};

/**
 * Sides(): build 4 sides of a DEM 
 *      - tiles: differents tiles of the DEM
 *      - extent of the DEM
 */
RANDO.Builds.Sides = function (tiles, extent, scene) {
    var frame = RANDO.Utils.getFrameFromTiles(tiles);

    // Create the sides container
    var sides = new BABYLON.Mesh("Sides", scene);

    var z_min = extent.altitudes.min - RANDO.SETTINGS.MIN_THICKNESS;

    // Creates differents sides
    var e_side = RANDO.Builds.Side("East Side",  frame.east,  z_min, false, scene);
    var w_side = RANDO.Builds.Side("West Side",  frame.west,  z_min, true,  scene);
    var n_side = RANDO.Builds.Side("North Side", frame.north, z_min, false, scene);
    var s_side = RANDO.Builds.Side("South Side", frame.south, z_min, true,  scene);

    // Set sides container as parent of sides
    e_side.parent = sides;
    w_side.parent = sides;
    n_side.parent = sides;
    s_side.parent = sides;
}

/**
 * Side(): build a side of the DEM
 *      - name: name of the side
 *      - line: array of point corresponding to a border of the DEM 
 *      - reverse: boolean which determines the direction of the side's texture
 *              false if negative 
 *              true if positive
 *              
 */
RANDO.Builds.Side = function (name, line, base, reverse, scene) {
    if (reverse) {
        line.reverse();
    }
    
    // Creates side
    var side = RANDO.Utils.createSideFromLine(name, line, base, scene);

    // Side material
    side.material = new BABYLON.StandardMaterial(name + "Material", scene);
    side.material.diffuseTexture = new BABYLON.Texture(RANDO.SETTINGS.SIDE_TEXTURE, scene);

    // Recomputes normals for lights and shadows
    RANDO.Utils.computeMeshNormals(side);
    
    // Enables collisions
    side.checkCollisions = true;
    
    return side;
};
