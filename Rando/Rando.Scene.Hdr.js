/*******************************************************************************
 * Rando.Scene.Hdr.js
 * 
 * Scene class : header file
 * Contains all attributes and prototypes of the Scene class
 * 
 * 
 * /!\ Need to be included in html file in this order
 *      <script src="Rando/Rando.Scene.Src.js"></script>
 *      <script src="Rando/Rando.Scene.Hdr.js"></script>
 * 
 ******************************************************************************/
RANDO = RANDO || {};

(function () {

    RANDO.Scene = function (canvas, settings) {
        if (typeof(settings) !== 'undefined') {
            RANDO.SETTINGS.parse(settings);
        }
        
        // Check support
        if (!BABYLON.Engine.isSupported()) {
            return null;
        } 
        var that = this;
        
        // Load BABYLON 3D engine
        this._engine = new BABYLON.Engine(canvas, true);
        RANDO.Events.addEvent(window, "resize", function(){
            that._engine.resize();
        });
        
        this._canvas = canvas;
        
        // Creation of the scene 
        this._scene = new BABYLON.Scene(this._engine);
        
        // Enable Collisions
        this._scene.collisionsEnabled = true;

        // Camera
        this.camera = RANDO.Builds.Camera(this._scene);

        // Lights
        this.lights = RANDO.Builds.Lights(this._scene);

        this.dem = null;
        this.trek = null;
        
        // Data used by DEM constructor
        this._dem_data = {};
        
        // Data used by Trek constructor
        this._trek_data = [];
        
        // Data used by both constructors
        this._offsets = {};
        
        this.buildAndRun(true, true);
    };

    RANDO.Scene.prototype = {
        buildAndRun:        buildAndRun,
        _executeWhenReady:  _executeWhenReady,
        _parseDemJson:      _parseDemJson,
        _parseTrekJson:     _parseTrekJson
    };


})();






