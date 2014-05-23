/*******************************************************************************
 * Rando.Poi.js
 * 
 * Poi class : 
 *  Permites the build of a Point of Interest in 3D
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {  "use strict" 
    
    /* Constructor */
    RANDO.Poi = function (data, offsets, scene) {
        this._position      = this._offset(data.coordinates, offsets);
        this._name          = data.properties.name;
        this._type          = data.properties.type;
        this._description   = data.properties.description;
        this._scene         = scene;
        
        this.panel  = null;
        this.sphere = null;
        this.init();
    };

    /* List of Methods */
    RANDO.Poi.prototype = {
        init:                           init,
        _offset:                        _offset,
        _buildPanel:                    _buildPanel,
        _buildSphere:                   _buildSphere,
        _registerBeforeRender:          _registerBeforeRender
    };

    function init () {
        this._buildPanel ();
        //~ this._buildSphere ();

        var that = this;
        this._scene.registerBeforeRender( function () {
            that._registerBeforeRender();
        });
    };

    function _offset (position, offsets) {
        var newPosition = _.clone(position);
        newPosition.x += offsets.x;
        newPosition.z += offsets.z;
        return newPosition;
    };

    function _buildPanel () {
        var scene       = this._scene;
        var position    = this._position;
        var text        = this._name;
        var src         = RANDO.SETTINGS.PICTO_SUFFIX + this._type.pictogram;
        
        // Text Panel
        //~ var panel = RANDO.Utils.createTextPanel (
            //~ "POI - Panel", RANDO.SETTINGS.POI_SIZE, 
            //~ text, scene, "rgba(1,1,1,0)", "#FFFFFF"
        //~ );
        //~ panel.position.x = position.x;
        //~ panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        //~ panel.position.z = position.z;
        //~ panel.material.specularColor = new BABYLON.Color4(0,0,0,0);
        //~ panel.isVisible = false;
        //~ this.panel = panel;
        
        
        // Picto Panel
        var panel = BABYLON.Mesh.CreateGround("POI - Panel", 200, 200, 2, scene);
        panel.rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.LOCAL); 
        panel.position.x = position.x;
        panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        panel.position.z = position.z;
        panel.material = new BABYLON.StandardMaterial("POI - Panel - Material", scene);
        panel.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        
        
        var texture = new BABYLON.DynamicTexture("POI - Panel - Texture", 64, scene, true);
        texture.hasAlpha = true;
        
        panel.material.backFaceCulling = false;
        panel.isVisible = true;
        this.panel = panel;
        
        
        var img = new Image();
        img.onload = function () {
            var textureContext = texture.getContext();
            textureContext.drawImage(img, 0, 0);
            textureContext.restore();
            texture.update();
            panel.material.diffuseTexture = texture;
        };
        img.src = src;
    };

    function _buildSphere () {
        var scene       = this._scene;
        var position    = this._position;

        var sphere = BABYLON.Mesh.CreateSphere ("POI - Sphere", 10, 100, scene);
        sphere.material = new BABYLON.StandardMaterial("POI - Sphere.material", scene);
        sphere.material.diffuseColor = RANDO.SETTINGS.TREK_COLOR;
        sphere.position.x = position.x;
        sphere.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        sphere.position.z = position.z;
        sphere.isVisible = false;
        this.sphere = sphere;
    };

    function _registerBeforeRender () {
        var scene       = this._scene;
        var position    = this._position;
        var sphere      = this.sphere;
        var panel       = this.panel;


        //~ var distance = BABYLON.Vector3.Distance(scene.activeCamera.position, position);
        //~ if (distance > 2800) {
            //~ sphere.isVisible = true;
            //~ panel.isVisible  = false;
        //~ } else {
            //~ sphere.isVisible = false;
            //~ panel.isVisible  = true;
            //~ lookAtCamera (scene.activeCamera);
        //~ }
        //~ 
        lookAtCamera (scene.activeCamera);
        function lookAtCamera (camera) {
            if (camera.id == "Fly camera") {
                var camTarget   = scene.activeCamera.getTarget();
                var camPosition = scene.activeCamera.position;
                var panelTarget = new BABYLON.Vector3 (
                    2 * camPosition.x - camTarget.x,
                    2 * camPosition.y - camTarget.y,
                    2 * camPosition.z - camTarget.z
                );
                panel.lookAt(panelTarget, 0, -Math.PI/2, 0);
            } else {
                panel.lookAt(camera.position, 0, -Math.PI/2, 0);
            }
        };
    };
})();
