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
        /* Attributes declaration */
        this._canvas = canvas;
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

    RANDO.Scene.prototype = {
        init:               init,
        process:            process,
        _buildCamera:       _buildCamera,
        _buildLights:       _buildLights,
        _buildCardinals:    _buildCardinals,
        _executeWhenReady:  _executeWhenReady,
        _parseDemJson:      _parseDemJson,
        _parseTrekJson:     _parseTrekJson
    };

})();

function init() {
    if(this._scene != null)  {
        this._scene.dispose();
        this._scene = null;
        this._engine.dispose();
        this._engine = null;
        this.camera = null;
    }
        
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene  = new BABYLON.Scene(this._engine);
    var that = this;
    RANDO.Events.addEvent(window, "resize", function(){
        that._engine.resize();
    });
    
    if (typeof(settings) !== 'undefined') {
        RANDO.SETTINGS.parse(settings);
    }

    this._scene.collisionsEnabled = true;
    this._buildCamera();
    this._buildLights();
    this.process(true, true);
}
