/*******************************************************************************
 * Rando.Dem.js
 * 
 * Dem class : 
 *  Permites the creation of a Digital Elevation Model in 3D  
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

var RANDO = RANDO || {};

(function () {  "use strict" 

    /* Constructor */
    RANDO.Dem = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        this._tiles = null;
        this._textures = [];
        
        this.ground = new BABYLON.Mesh("Digital Elevation Model", scene);
        this.sides  = new BABYLON.Mesh("Sides", scene);
        this.scaleViewer = null;

        /* Initialization */
        this.init();
    };

    /* List of Methods */
    RANDO.Dem.prototype = {
        init:               init,
        buildGround:        buildGround,
        buildSides:         buildSides,
        applyTextures:      applyTextures,
        buildScaleViewer:   buildScaleViewer,
        _buildTile:         _buildTile,
        _buildSide:         _buildSide,
        _initCamera:        _initCamera,
        _prepareTexture:    _prepareTexture
    };

    function init() {
        this._tiles = new RANDO.TileContainer(
            this._data.extent, 
            this._data.altitudes,
            this._offsets
        )._tiles;
        this._initCamera();
        this.buildGround();
        this.buildSides();
    };


    /**
     * RANDO.Dem.buildGround() : build the ground of the DEM 
     */
    function buildGround () {
        // Ground building...
        console.log("Ground building... " + (Date.now() - RANDO.START_TIME) );
        var scene   = this._scene;
        var center  = this._data.center;
        var offsets = this._offsets;
        var tiles   = this._tiles;

        // Creates all tiles 
        for (var it in tiles) {
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
        var scene   = this._scene;
        var engine  = scene.getEngine();
        var that    = this;
        
        // Creates Tile
        var tile = RANDO.Utils.createGroundFromGrid(
            "Tile",
            data.grid,
            scene
        );

        // Recomputes normals for lights and shadows
        RANDO.Utils.computeMeshNormals(tile)

        // Set Uvs data of the tile 
        RANDO.Utils.setMeshUvs(tile, data.uv);

        // Enables collisions
        tile.checkCollisions = true;
        
        // Material 
        var material = new BABYLON.StandardMaterial("DEM - Material", scene);
        var fakeTexture = new BABYLON.Texture(
            RANDO.SETTINGS.FAKE_TEX_URL,
            scene
        );
        material.diffuseTexture = fakeTexture;
        material.wireframe = true;
        material.backFaceCulling = false;
        tile.material = material;
        return tile;
    };
    
    
    /**
     * RANDO.Dem._prepareTexture() : Prepare a tile of textures for the DEM and add
     *  it to the textures Array.
     *      - coordinates : coordinates of a tile
     *  
     */
    function _prepareTexture (coordinates) {
        var scene = this._scene;
        var engine = scene.getEngine();
        var url = RANDO.Utils.replaceUrlCoordinates(
            RANDO.SETTINGS.TILE_TEX_URL,
            coordinates.z, 
            coordinates.x, 
            coordinates.y
        );
        this._textures.push(new BABYLON.Texture(url, scene));
    };
    
    /**
     * RANDO.Dem.applyTextures() : Load tile's textures over the DEM
     */ 
    function applyTextures () {
        console.log("Textures application ... " + (Date.now() - RANDO.START_TIME) );
        var tiles = this._tiles;

        // Prepare all textures 
        for (var it in tiles) {
            this._prepareTexture(tiles[it].coordinates);
        }


        var scene = this._scene;
        var meshes = this.ground.getChildren ();
        var finalTextures = this._textures;
        var checked = [];
        var count = finalTextures.length;
        for (var it in finalTextures){
            checked.push(false);
        }

        loop();
        function loop (){
            var it = 0;
            var chunk = 50;
            apply();
            function apply () {
                var cnt = chunk;
                while (cnt-- && it < finalTextures.length) {
                    if (!checked[it] && finalTextures[it]._texture.isReady) {
                        checked[it] = true;

                        // Set the texture when it's loaded
                        var material = meshes[it].material;
                        material.diffuseTexture = finalTextures[it];
                        material.wireframe = false;
                        count--;
                    }
                    it++;
                }
                if (it < finalTextures.length) {
                    setTimeout (apply, 1);
                } else if (count > 0) {
                    setTimeout (loop, 1);
                } else {
                    console.log("Textures applied ! " + (Date.now() - RANDO.START_TIME) );
                }
            };
        }
    };

    function buildScaleViewer () {
        var corner = this._data.extent.southwest;
        var scene = this._scene;

        var width  = RANDO.SETTINGS.SCALE_VIEWER_SIZE.width;
        var height  = RANDO.SETTINGS.SCALE_VIEWER_SIZE.height;
        var A = {
            'x': corner.x + this._offsets.x,
            'y': corner.z + this._offsets.z
        };
        var B = {
            'x': A.x + width,
            'y': A.y
        };
        var C = {
            'x': A.x + width,
            'y': A.y + height
        };
        var D = {
            'x': A.x,
            'y': A.y + height
        };

        var scaleViewer = RANDO.Utils.createGroundFromExtent(
            "DEM - ScaleViewer", A, B, C, D,
            RANDO.SETTINGS.SCALE_VIEWER_RESOLUTION.x,
            RANDO.SETTINGS.SCALE_VIEWER_RESOLUTION.y,
            scene
        );
        scaleViewer.material = new BABYLON.StandardMaterial("material", scene);
        scaleViewer.material.alpha = 0.5;
        scaleViewer.material.diffuseColor = BABYLON.Color3.FromInts(96, 41, 108);
        scaleViewer.material.backFaceCulling = false;
        drapeScaleViewer (this.ground);
        
        this.scaleViewer = scaleViewer;
        
        function drapeScaleViewer (ground) {
            var vertices = scaleViewer.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var new_vertices = [];
            var result
            for (var i = 0; i < vertices.length; i+=3) {
                var position = new BABYLON.Vector3(
                    vertices[i],
                    vertices[i+1],
                    vertices[i+2]
                );
                RANDO.Utils.drapePoint(position, ground, RANDO.SETTINGS.SCALE_VIEWER_OFFSET);
                new_vertices.push(position.x);
                new_vertices.push(position.y);
                new_vertices.push(position.z);
            }
            scaleViewer.setVerticesData(new_vertices, BABYLON.VertexBuffer.PositionKind);
        };
    };

    /**
     * RANDO.Dem._buildSide() : build a side of the DEM
     *      - name: name of the side 
     *      - line: Array of point corresponding to a border of the DEM
     *      - alt_min: altitude minimale of the DEM
     *      - reverse: Boolean, if true reverse the line
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
        side.material.diffuseTexture = new BABYLON.Texture(RANDO.SETTINGS.SIDE_TEX_URL, scene);

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
