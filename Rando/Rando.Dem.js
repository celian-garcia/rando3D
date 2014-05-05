/*******************************************************************************
 * Rando.Dem.js
 * 
 * Dem class : 
 *  Permites the creation of a Digital Elevation Model in 3D  
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {

    /* Constructor */
    RANDO.Dem = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        this._tiles = null;
        
        this.ground = new BABYLON.Mesh("Digital Elevation Model", scene);
        this.sides  = new BABYLON.Mesh("Sides", scene);

        /* Initialization */
        this.init();
    };

    /* List of Methods */
    RANDO.Dem.prototype = {
        init:               init,
        buildGround:        buildGround,
        buildSides:         buildSides,
        _buildTile:         _buildTile,
        _buildSide:         _buildSide,
        _initCamera:        _initCamera
    };

    function init() {
        this._tiles = new RANDO.TileContainer(
            this._data.extent, 
            this._data.altitudes,
            this._offsets
        ).init();
        this._initCamera();
        this.buildGround();
        this.buildSides();
        // At the end, run the render loop 
        var scene = this._scene;
        //~ scene.getEngine().runRenderLoop(function() {
            //~ scene.render();
        //~ });
    };


    /**
     * RANDO.Dem.buildGround() : build the ground of the DEM 
     */
    function buildGround () {
        // Ground building...
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
        
        this._scene.render();
        // Ground built ! 
        console.log("Ground built ! " + (Date.now() - RANDO.START_TIME) );
    };


    /**
     * RANDO.Dem.buildSides() : build four sides of the DEM
     */
    function buildSides () {
        // Sides building...
        console.log("Sides building... " + (Date.now() - RANDO.START_TIME) );
        var tiles  = this._tiles;
        var extent = this._data.extent;
        var scene  = this._scene;
        var sides  = this._sides;
        
        var frame = RANDO.Utils.getFrameFromTiles(tiles);
        var alt_min = extent.altitudes.min - RANDO.SETTINGS.MIN_THICKNESS;

        // Creates differents sides
        var e_side = this._buildSide("East Side",  frame.east,  alt_min, false);
        var w_side = this._buildSide("West Side",  frame.west,  alt_min, true );
        var n_side = this._buildSide("North Side", frame.north, alt_min, false);
        var s_side = this._buildSide("South Side", frame.south, alt_min, true );

        // Set sides container as parent of sides
        e_side.parent = sides;
        w_side.parent = sides;
        n_side.parent = sides;
        s_side.parent = sides;
        
        // Sides built ! 
        console.log("Sides built ! " + (Date.now() - RANDO.START_TIME) );
    };


    /**
     * RANDO.Dem._buildTile() : build a tile of the DEM
     *      - data : data of a tile 
     *  
     *  return the tile mesh
     */
    function _buildTile (data) {
        var scene = this._scene;
        
        // Creates Tile
        var tile = RANDO.Utils.createGroundFromGrid(
            "Tile - " + it,
            data.grid,
            scene
        );

        // Recomputes normals for lights and shadows
        RANDO.Utils.computeMeshNormals(tile)

        // 
        RANDO.Utils.setMeshUvs(tile, data.uv);

        // Enables collisions
        tile.checkCollisions = true;

        // Material 
        var material = new BABYLON.StandardMaterial("DEM Material - " + it, scene);
        material.wireframe = true;
        material.backFaceCulling = false;
        tile.material = material;

        return tile;
    };


    /**
     * RANDO.Dem._buildSide() : build a side of the DEM
     *      - name: name of the side 
     *      - line: Array of point 
     *      - alt_min: altitude minimale of the DEM
     *      - reverse: boolean ->if true reverse the line
     * 
     *  return the side mesh 
     */
    function _buildSide (name, line, alt_min, reverse) {
        var scene = this._scene;

        if (reverse) {
            line.reverse();
        }

        // Creates side
        var side = RANDO.Utils.createSideFromLine(name, line, alt_min, scene);

        // Side material
        side.material = new BABYLON.StandardMaterial(name + "Material", scene);
        side.material.diffuseTexture = new BABYLON.Texture(RANDO.SETTINGS.SIDE_TEXTURE, scene);

        // Recomputes normals for lights and shadows
        RANDO.Utils.computeMeshNormals(side);

        // Enables collisions
        side.checkCollisions = true;

        return side;
    };


    /**
     * RANDO.Dem._initCamera() : set the by default values of camera 
     */
    function _initCamera () {
        var scene   = this._scene;
        var center  = this._data.center;
        var offsets = this._offsets
        
        scene.activeCamera.rotation = new BABYLON.Vector3(1, 1.2, 0);
        scene.activeCamera.position = new BABYLON.Vector3(
            center.x + offsets.x - 2500, 
            center.y + offsets.y + 2500, 
            center.z + offsets.z - 1000
        );
    };

})();
