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
        this._buildSphere ();

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

        var panel = RANDO.Utils.createPanel ("POI - Panel", 100, text, scene, "rgba(1,1,1,0)", "#FFFFFF");
        panel.position.x = position.x;
        panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        panel.position.z = position.z;
        panel.material.specularColor = new BABYLON.Color4(0,0,0,0);
        panel.isVisible = false;
        this.panel = panel;
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

        if (BABYLON.Vector3.Distance(scene.activeCamera.position, position) > 2800) {
            sphere.isVisible = true;
            panel.isVisible  = false;
        } else {
            sphere.isVisible = false;
            panel.isVisible  = true;

            lookAtCamera (scene.activeCamera);
        }

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
