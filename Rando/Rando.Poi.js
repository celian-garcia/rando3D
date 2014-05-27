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
    RANDO.Poi = function (id, data, offsets, scene) {
        this._id            = id
        this._position      = this.place(data.coordinates, offsets);
        this._name          = data.properties.name;
        this._type          = data.properties.type;
        this._description   = data.properties.description;
        this._scene         = scene;
        
        this.panel  = null;
        this.init();
    };

    /* List of Methods */
    RANDO.Poi.prototype = {
        init:                           init,
        _buildPanel:                    _buildPanel,
        _registerBeforeRender:          _registerBeforeRender,
        place:                          place,
        onMouseDownHandler:             onMouseDownHandler,
        onMouseOverHandler:             onMouseOverHandler,
        drape:                          drape
    };

    function init () {
        this._buildPanel ();

        var that = this;
        this._scene.registerBeforeRender( function () {
            that._registerBeforeRender();
        });
    };

    /**
     * RANDO.Poi.place() : place a POI
     *      - position: position of POI
     *      - offsets: offsets 
     */
    function place (position, offsets) {
        if (typeof(offsets) === "undefined") {
            var offsets = {
                x: 0,
                z: 0
            };
        }
        var newPosition = _.clone(position);
        newPosition.x += offsets.x;
        newPosition.z += offsets.z;
        return newPosition;
    };

    /**
     * RANDO.Poi._buildPanel() : build a Panel with a picto which defines the type of POI
     */
    function _buildPanel () {
        var scene       = this._scene;
        var position    = this._position;
        var text        = this._name;
        var src         = RANDO.SETTINGS.PICTO_PREFIX + this._type.pictogram;
        var id          = this._id;

        // Picto Panel
        var panel = BABYLON.Mesh.CreateGround("POI - Panel", 200, 200, 2, scene);
        panel.id = id;
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

    /**
     * RANDO.Poi._registerBeforeRender() : function to call before each scene render
     */
    function _registerBeforeRender () {
        var scene       = this._scene;
        var position    = this._position;
        var sphere      = this.sphere;
        var panel       = this.panel;

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

    /**
     * RANDO.Poi.runMouseListener() : Static function which run all mouse 
     *  listeners linked to POIs, we give it a POI's array and it adds 
     *  mouse events over all its elements.
     * 
     *      - canvas : canvas where the scene is
     *      - pois : array of POIs
     *      - scene : scene 
     */
    RANDO.Poi.runMouseListener = function (canvas, pois, scene) {
        var clicked = false;

        // MouseDown Event : check if the mouse is over a Picto when Mouse left click is down
        RANDO.Events.addEvent(window, "mousedown", function (evt) {
            var pickResult = scene.pick (evt.clientX, evt.clientY);
            var pickedMesh = pickResult.pickedMesh;

            removePictoFrame();

            // if the click hits a pictogram, we display informations of POI
            if (pickResult.hit && pickedMesh.name == "POI - Panel") {
                pois[pickedMesh.id].onMouseDownHandler(evt);
                clicked = true;
            } else {
                clicked = false;
            }
        });

        // MouseMove Event : always check if mouse is over a Picto
        RANDO.Events.addEvent(window, "mousemove", function (evt) {
            if (!clicked) {
                var pickResult = scene.pick (evt.clientX, evt.clientY);
                var pickedMesh = pickResult.pickedMesh;

                removePictoFrame();

                // if mouse is over a pictogram, we display informations of POI
                if (pickResult.hit && pickedMesh.name == "POI - Panel") {
                    pois[pickedMesh.id].onMouseOverHandler(evt);
                }
            }
        });

        // A function which remove the picto frame if it exists
        function removePictoFrame () {
            var elem = $('#picto_frame');
            if (elem) {
                elem.remove();
            }
        };
    };

    /**
     * RANDO.Poi.onMouseDownHandler() : callback to run if the mouse is down over a picto
     *      - evt: event informations
     */
    function onMouseDownHandler (evt) {
        $('body').append('<div id = "picto_frame"> ' + this._name + '</div>');

        $('#picto_frame').css('left', evt.clientX - 20 + 'px');
        $('#picto_frame').css('top',  evt.clientY - 40 + 'px');
    };

    /**
     * RANDO.Poi.onMouseOverHandler() : callback to run if the mouse is over a picto
     *      - evt: event informations
     */
    function onMouseOverHandler (evt) {
        $('body').append('<div id = "picto_frame"> ' + this._name + '</div>');

        $('#picto_frame').css('left', evt.clientX - 20 + 'px');
        $('#picto_frame').css('top',  evt.clientY - 40 + 'px');
    };

    /**
     * RANDO.Poi.drape() : drape the POI over the DEM
     *      - ground : ground of the DEM 
     */
    function drape(ground) {
        RANDO.Utils.drapePoint(this.panel.position, ground, RANDO.SETTINGS.POI_OFFSET);
    };
})();
