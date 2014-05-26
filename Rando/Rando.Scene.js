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

(function () {  "use strict" 

    /* Constructor */
    RANDO.Scene = function (canvas, demo, version,  settings) {
        // Attributes declaration 
        this._canvas    = canvas;
        this._demo      = demo;
        this._version   = version;
        this._settings  = settings;
        
        this._engine    = null;
        this._scene     = null;
        this.camContainer    = null;
        this.lights     = [];
        this.dem        = null;
        this.trek       = null;
        this.pois       = [];

        this._dem_data  = {};
        this._trek_data = [];
        this._pois_data = [];
        this._offsets   = {};
    };

    /* List of Methods */
    RANDO.Scene.prototype = {
        init:               init,
        process_v10:        process_v10,
        process:            process,
        _buildCameras:      _buildCameras,
        _buildLights:       _buildLights,
        _buildEnvironment:  _buildEnvironment,
        _buildCardinals:    _buildCardinals,
        _executeWhenReady:  _executeWhenReady,
        _parseDemJson:      _parseDemJson,
        _parseTrekJson:     _parseTrekJson,
        _parsePoiJson:      _parsePoiJson
    };

    
    function init () {
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
        this._buildCameras();
        this._buildLights();
        this._buildEnvironment();
        
        switch (this._version) {
            case "1.0" : 
                console.log("Launch of version 1.0 ! ")
                this.process_v10();
            break;
            case "1.1" : 
                console.log("Launch of version 1.1 ! ")
                this.process();
            break;
            case "1.2" : 
                console.log("Launch of version 1.2 ! ")
                this.process();
        }
    };

    /**
     * RANDO.Scene.process_v10() : launch the building process of the scene 
     *  It displays : 
     *          - the terrain 
     *          - the trek 
     */
    function process_v10 () {
        var that = this;

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
            that._engine.runRenderLoop(function() {
                that._scene.render();
            }); 
            that.dem = new RANDO.Dem(
                that._dem_data,
                that._offsets,
                that._scene
            );
         })

         // Trek building
         .then(function () {
            that.trek = new RANDO.Trek  (
                that._trek_data,
                that._offsets,
                that._scene
            )
            that.trek.init();
         })

         .then(function () {
            that._scene.executeWhenReady(function () {
                that._executeWhenReady ();
            });
         });
    };

    /**
     * RANDO.Scene.process() : launch the building process of the scene 
     *  It displays : 
     *          - Terrain 
     *          - Trek 
     *          - POIs
     */
    function process () {
        var that = this;

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
         .then(function () {
            return $.getJSON(RANDO.SETTINGS.POI_URL);
         })
         .done(function (data) {
            that._parsePoiJson(data);
         })
         .then(function () {
            // Run renderloop
            that._engine.runRenderLoop(function() {
                that._scene.render();
            }); 

            // Tiled DEM mesh building
            that.dem = new RANDO.Dem(
                that._dem_data,
                that._offsets,
                that._scene
            );

            // Trek building
            that.trek = new RANDO.Trek  (
                that._trek_data,
                that._offsets,
                that._scene
            );

            // POIs building
            for (var it in that._pois_data) {
                that.pois.push(new RANDO.Poi(
                    it,
                    that._pois_data[it],
                    that._offsets,
                    that._scene
                ));
            }
            RANDO.Poi.runClickListener(that.pois, that._scene);

            // To execute when scene is ready
            that._scene.executeWhenReady(function () {
                that._executeWhenReady ();
            });
         })
    };


    /**
     * RANDO.Scene._buildCameras() : builds cameras of the scene
     * 
     *  If we are on demo mode, the camera is set as demo_camera
     *  Else it is set as fly_camera
     */
    function _buildCameras() {
        var camContainer    = this.camContainer;
        var canvas          = this._canvas;
        var scene           = this._scene;
        var demo            = this._demo;
        
        camContainer = new RANDO.CameraContainer(canvas, scene);

        // Defines active camera
        if (demo) {
            camContainer.setActiveCamera ("demo_camera");
        }
        else
            camContainer.setActiveCamera ("fly_camera");
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
     *  is ready, in other words, when the scene have built all its elements.
     */
    function _executeWhenReady () {
        console.log("Scene is ready ! " + (Date.now() - RANDO.START_TIME) );

        var scene   = this._scene;
        var demo    = this._demo;
        var version = this._version;
        var dem     = this.dem;
        var trek    = this.trek;
        var that    = this;

        dem.applyTextures();
        trek.drape(dem.ground, onDrapeComplete);

        function onDrapeComplete () {
            // Updates trek vertices
            trek.updateVertices();

            // Activates the animation of camera
            if (!demo && version == "1.2" ) {
                RANDO.Utils.animateCamera(trek, scene);
            }

            // Merges the trek to increase performances
            trek.merge();
        }
    };


    /**
     * RANDO.Scene._parseDemJson() : parse data from the DEM json 
     *      - data : data from DEM json
     */
    function _parseDemJson (data) {
        var dem_data = this._dem_data,
            offsets  = this._offsets;
            
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
        
        for (var it in profile){
            var tmp = {
                'lat' : profile[it][2][1],
                'lng' : profile[it][2][0]
            };

            tmp = RANDO.Utils.toMeters(tmp);
            tmp.z = tmp.y;
            tmp.y = 0;

            trek_data.push(tmp);
        }
    };
    
    
    /**
     * RANDO.Scene._parsePoiJson() : parse data from the POI json 
     *      - data : data from POI json
     */
    function _parsePoiJson (data) {
        var pois_data = this._pois_data;
        
        for (var it in data.features) {
            var feature = data.features[it];
            var coordinates = RANDO.Utils.toMeters({
                'lat' : feature.geometry.coordinates[1],
                'lng' : feature.geometry.coordinates[0]
            });

            pois_data.push ({
                'coordinates' : {
                    'x': coordinates.x,
                    'y': feature.properties.elevation,
                    'z': coordinates.y
                },
                'properties' : feature.properties
            });
        }
    };
})();


