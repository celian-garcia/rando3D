RANDO = RANDO || {};

(function () {

    RANDO.Dem = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        
        this._tiles = {};
        this.ground = new BABYLON.Mesh("Digital Elevation Model", scene);
        this.sides = [];
        
        
        /* Initialization */
        this._generateTiles();
        this._initCamera();
        this.buildGround();
        this.buildSides();
    };

    RANDO.Dem.prototype = {
        buildGround:        buildGround,
        buildSides:         buildSides,
        _buildTile:         _buildTile,
        _generateTiles :    _generateTiles,
        _initCamera:        _initCamera
    };

})();



function buildGround () {
    // Tiled DEM building...
    console.log("Ground building... " + (Date.now() - RANDO.START_TIME) );
    var scene = this._scene;
    var center = this._data.center;
    var offsets = this._offsets;
    var tiles = this._tiles;
    
    // Creates all tiles 
    for (it in tiles) {
        var meshTile = this._buildTile(tiles[it]);
        meshTile.parent = this.ground;
    }
    
    // DEM built ! 
    console.log("Ground built ! " + (Date.now() - RANDO.START_TIME) );
};

function buildSides () {
    
};

function _buildTile (data) {
    var scene = this._scene;
    
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
        scene
    );
    material.diffuseTexture = texture;
    material.backFaceCulling = false;
    tile.material = material;

    return tile;
};


function _generateTiles () {
    var extent = this._data.extent;
    var altitudes = this._data.altitudes;
    var offsets = this._offsets;
    var zoom = RANDO.SETTINGS.TILE_ZOOM;
    var tiles = this._tiles;
    
    var grid = RANDO.Utils.createElevationGrid(
        extent.southwest, 
        extent.southeast,
        extent.northeast,
        extent.northwest,
        altitudes
    );

    // Subdivide the elevation grid in tiles 
    RANDO.Utils.subdivideGrid(tiles, grid, zoom);
    
    // At this moment, tiles are not joined at all, so we need to join it 
    RANDO.Utils.joinTiles(tiles);
    
    // Compute tiles uv for future texture mapping 
    RANDO.Utils.computeTilesUvs(tiles);
    
    // Translate the tiles positions of the offsets
    for (var it in tiles) {
        var grid = tiles[it].grid;
        for (row in grid) {
            for (col in grid[row]) {
                grid[row][col].x += offsets.x;
                grid[row][col].y += offsets.y;
                grid[row][col].z += offsets.z;
            }
        }
    }
};


function _initCamera () {
    var scene   = this._scene;
    var center  = this._data.center;
    var offsets = this._offsets
    
    scene.activeCamera.rotation = new BABYLON.Vector3(0.6, 1, 0);
    scene.activeCamera.position = new BABYLON.Vector3(
        center.x + offsets.x - 2000, 
        center.y + offsets.y + 2500, 
        center.z + offsets.z - 1500
    );
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
