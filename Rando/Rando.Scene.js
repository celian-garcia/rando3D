/*******************************************************************************
 * Rando.Scene.js
 * 
 * Scene class : 
 *  Permites the creation and manipulation of a scene 3D containing (or not) :
 *      - a Digital Elevation Model
 *      - a Trek which is draped over the DEM if it exists
 *      - a Camera floating and animated
 *      - a set of lights
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {

    /* Constructor */
    RANDO.Scene = function (canvas, demo,  settings) {
        // Attributes declaration 
        this._canvas = canvas;
        this._settings = settings;
        this._demo   = demo;
        
        this._engine = null;
        this._scene  = null;
        this.camera  = null;
        this.lights  = [];
        this.dem     = null;
        this.trek    = null;
        

        this._dem_data  = {};
        this._trek_data = [];
        this._offsets   = {};
    };

    /* List of Methods */
    RANDO.Scene.prototype = {
        init:               init,
        process:            process,
        _buildCamera:       _buildCamera,
        _buildLights:       _buildLights,
        _buildEnvironment:  _buildEnvironment,
        _buildCardinals:    _buildCardinals,
        _executeWhenReady:  _executeWhenReady,
        _parseDemJson:      _parseDemJson,
        _parseTrekJson:     _parseTrekJson
    };

    
    function init() {
        
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene  = new BABYLON.Scene(this._engine);
        var that = this;
        RANDO.Events.addEvent(window, "resize", function(){
            that._engine.resize();
        });
        
        if (typeof(this._settings) !== 'undefined') {
            RANDO.SETTINGS.parse(this._settings);
        }

        this._scene.collisionsEnabled = true;
        this._buildCamera();
        this._buildLights();
        this._buildEnvironment();
        this.process(true, true);
    }

    /**
     * RANDO.Scene.process() : launch the building process of the scene 
     *      - b_dem : boolean which defines if we build the DEM or not (true by def)
     *      - b_trek : boolean which defines if we build the Trek or not (true by def)
     */
    function process (b_dem, b_trek) {
        var that = this;
        if (typeof(b_dem) === 'undefined')  b_dem  = true;
        if (typeof(b_trek) === 'undefined') b_trek = true;

        $.getJSON(RANDO.SETTINGS.DEM_URL)
         .done(function (data) {
            that._parseDemJson(data);
         })
         .then(function () {
            return $.getJSON(RANDO.SETTINGS.PROFILE_URL);
         })
         .done(function (data) {
            that._parseTrekJson(data);
         })
         
         // Tiled DEM mesh building
         .then(function () {
            if (b_dem) {
                that.dem = new RANDO.Dem(
                    that._dem_data,
                    that._offsets,
                    that._scene
                );
            }
         })
         
         // Trek building
         .then(function () {
            if (b_trek) {
                that.trek = new RANDO.Trek  (
                    that._trek_data,
                    that._offsets,
                    that._scene
                ).init();
                if (!that._demo) {
                    RANDO.Utils.animateCamera(that._trek_data, that._scene);
                }
            }
         })
         .then(function () {
            that._scene.executeWhenReady(function () {
                that._executeWhenReady ();
            });
         });
    };


    /**
     * RANDO.Scene._buildCamera() : builds the camera of the scene
     */
    function _buildCamera() {
        var camera = this.camera;
        var scene  = this._scene;

        if (this._demo) {
            camera = new BABYLON.ArcRotateCamera("ArcRotate Camera", 1, 0.5, 10, new BABYLON.Vector3(0, 1800, 0), scene);
            camera.setPosition(new BABYLON.Vector3(-3000, 5000, 3000));
            camera.keysUp = [83, 40];// Touche Z and up
            camera.keysDown = [90, 38]; // Touche S and down
            camera.keysLeft = [68, 39]; // Touche Q and left
            camera.keysRight = [81, 37]; // Touche D and right
            camera.wheelPrecision = 0.2;
            camera.upperBetaLimit = Math.PI/3;
            camera.lowerRadiusLimit = 1000;
            camera.upperRadiusLimit = 5000;

            $("#controls_ar_cam").css("display", "block");
        }else {
            camera = new BABYLON.FreeCamera("Fly Camera", new BABYLON.Vector3(0, 0, 0), scene);
            camera.keysUp = [90, 38]; // Touche Z and up
            camera.keysDown = [83, 40]; // Touche S and down
            camera.keysLeft = [81, 37]; // Touche Q and left
            camera.keysRight = [68, 39]; // Touche D and right
            
            $("#controls_f_cam").css("display", "block");
        }

        camera.checkCollisions = true;
        camera.maxZ = 10000;
        camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;
        camera.attachControl(this._canvas);

        var l_cam = new BABYLON.HemisphericLight("LightCamera", new BABYLON.Vector3(0,1000,0), scene)
        l_cam.intensity = 0.8;
        l_cam.specular = new BABYLON.Color4(0, 0, 0, 0);
        l_cam.parent = camera;
    };


    /**
     * RANDO.Scene._buildLights() : builds the differents lights of the scene 
     */
    function _buildLights() {
        var lights = this.lights;
        var scene = this._scene;
        
        // Sun
        var sun = new BABYLON.HemisphericLight("Sun", new BABYLON.Vector3(500, 2000, 0), scene);
        sun.specular = new BABYLON.Color4(0, 0, 0, 0);
        lights.push(sun);
    };

    function _buildEnvironment() {
        // Fog
        //~ this._scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        //~ this._scene.fogDensity = 0.00002;
        //~ this._scene.fogColor = new BABYLON.Color3(1, 1, 1);
        
        // SkyBox
        //~ var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
        //~ var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        //~ skyboxMaterial.backFaceCulling = false;
        //~ skybox.material = skyboxMaterial;
        //~ 
        //~ skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        //~ skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        //~ 
        //~ skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
        //~ skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        
        // Color
        this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    };
    
    
    /**
     * RANDO.Scene._buildCardinals() : builds the four cardinals points
     */
    function _buildCardinals() {
        
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

    };


    /**
     * RANDO.Scene._executeWhenReady() : function which is executed when the scene 
     * is ready, in other words, when the scene have built all its elements.
     */
    function _executeWhenReady () {
        console.log("Scene is ready ! " + (Date.now() - RANDO.START_TIME) );
        var scene = this._scene;
        var engine = this._engine;
        engine.runRenderLoop(function() {
            scene.render();
        }); 
        
        var ground = this.dem.ground;
        var tiles = this.dem._tiles;
        var tilesKeys = Object.keys(tiles);
        var trek_length = scene.getMeshByName("Spheres").getChildren().length;
        var finalTextures = [];
        
        console.log("Trek adjustments ..." + (Date.now() - RANDO.START_TIME) );
        
        var index = 0;
        var chunk = 100; // By chunks of 100 points
        prepareFinalTextures();
        drape();

        // Drape vertices (spheres) over the DEM
        function drape(){
            var cnt = chunk;
            while (cnt-- && index < trek_length) {
                RANDO.Utils.drapePoint(scene.getMeshByName("Sphere " + (index+1)).position, ground);
                ++index;
            }
            if (index < trek_length){
                setTimeout(drape, 1);
            }else {
                index = 0;
                // At the end of draping we place cylinders
                setTimeout(place, 1); 
            }
        };

        // Place all cylinders between each pairs of spheres 
        function place() {
            for (var i = 0; i < trek_length-1; i++) {
                RANDO.Utils.placeCylinder(
                    scene.getMeshByName("Cylinder " + (i+1)), 
                    scene.getMeshByName("Sphere "   + (i+1)).position, 
                    scene.getMeshByName("Sphere "   + (i+2)).position
                );
            }
            console.log("Trek adjusted ! " + (Date.now() - RANDO.START_TIME) );
            
            console.log("Textures application ..." + (Date.now() - RANDO.START_TIME) );
            texture ();
        };

        function prepareFinalTextures() {
            for (it in tiles) {
                var tileData = tiles[it];
                
                // Get url of the texture
                var url = RANDO.Utils.replaceUrlCoordinates(
                    RANDO.SETTINGS.TILE_TEX_URL,
                    tileData.coordinates.z, 
                    tileData.coordinates.x, 
                    tileData.coordinates.y
                );
                finalTextures.push(engine.createTexture(url, true, true, scene));
            }
        };
        
        // Load tile's textures over the DEM
        function texture () {
            if (index < tilesKeys.length) {
                var property = tilesKeys[index];
                var tile = tiles[property];
                
                var child = scene.getMeshByName("Tile - " + property);
                child.material.diffuseTexture._texture = finalTextures[index];
                if (child.material.isReady) {
                    child.material.wireframe = false;
                }
                index++;
                setTimeout( texture, 1 );
            } else {
                console.log("Textures applied !" + (Date.now() - RANDO.START_TIME) );
            }
        };
    };


    /**
     * RANDO.Scene._parseDemJson() : parse data from the DEM json 
     *      - data : data from DEM json
     */
    function _parseDemJson (data) {
        var dem_data = this._dem_data,
            offsets = this._offsets;
            
        var m_center = RANDO.Utils.toMeters(data.center);
        var m_extent = RANDO.Utils.extent2meters (data.extent);

        // Record DEM data
        dem_data.o_extent = _.clone(m_extent);
        dem_data.extent = m_extent;
        dem_data.altitudes = data.altitudes; // altitudes already in meters
        dem_data.resolution = data.resolution; // do not need conversion
        dem_data.o_center = {
            x: m_center.x,
            y: data.center.z,// altitude of center already in meters
            z: m_center.y
        }
        dem_data.center = {
            x: m_center.x,
            y: data.center.z,// altitude of center already in meters
            z: m_center.y
        };

        // Control if altitudes data coincide with resolution data
        console.assert(dem_data.altitudes.length == dem_data.resolution.y);
        console.assert(dem_data.altitudes[0].length == dem_data.resolution.x);
        
        // Records offsets
        offsets.x = -dem_data.center.x;
        offsets.y = dem_data.extent.altitudes.min;
        offsets.z = -dem_data.center.z;
    };


    /**
     * RANDO.Scene._parseTrekJson() : parse data from the Trek profile json 
     *      - data : data from Trek profile json
     */
    function _parseTrekJson (data) {
        var profile = data.profile;
        var trek_data = this._trek_data;
        
        for (it in profile){
            var tmp = {
                'lat' : profile[it][2][1],
                'lng' : profile[it][2][0]
            };

            tmp = RANDO.Utils.toMeters(tmp);
            tmp.z = tmp.y;
            tmp.y = 0;

            trek_data.push(_.clone(tmp));
        }
    };

})();


