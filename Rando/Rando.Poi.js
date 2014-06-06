/*******************************************************************************
 * Rando.Poi.js
 * 
 * Poi class : 
 *  Permites the build of a Point of Interest in 3D
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

var RANDO = RANDO || {};

(function () {  "use strict" 
    
    /* Constructor */
    RANDO.Poi = function (id, data, offsets, scene) {
        this._id            = id
        this._position      = this.place(data.coordinates, offsets);
        this._name          = data.properties.name;
        this._type          = data.properties.type;
        this._elevation     = data.coordinates.y;
        this._description   = data.properties.description || RANDO.SETTINGS.NO_DESCRIPTION_MESSAGE;
        this._scene         = scene;
        
        this.panel          = null;
        this.sphere         = null;
        this._attachedLight = null;
        this.init();
    };

    /* List of Methods */
    RANDO.Poi.prototype = {
        init:                           init,
        _buildPanel:                    _buildPanel,
        _buildSphere:                   _buildSphere,
        _registerBeforeRender:          _registerBeforeRender,
        place:                          place,
        drape:                          drape,
        onMouseDownHandler:             onMouseDownHandler,
        onMouseOverHandler:             onMouseOverHandler
    };

    function init () {
        this._buildPanel ();
        this._buildSphere ();

        var that = this;
        this._scene.registerBeforeRender( function () {
            that._registerBeforeRender();
        });
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
        var elevation   = this._elevation;

        // Size of panel (in pixel and in meters)
        var pan_size = {
            px: {
                width : 512,
                height : 512
            },
            m: {
                width : RANDO.SETTINGS.PICTO_SIZE,
                height : RANDO.SETTINGS.PICTO_SIZE + 30
            }
        };

        // Building
        var panel = BABYLON.Mesh.CreateGround(
            "POI - Panel", 
            pan_size.m.width, 
            pan_size.m.height, 
            2, scene
        );
        panel.id = id;
        panel.rotate (BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.LOCAL); 
        panel.position.x = position.x;
        panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        panel.position.z = position.z;
        panel.material = new BABYLON.StandardMaterial("POI - Panel - Material", scene);
        panel.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.panel = panel;

        // Texture
        var texture = new BABYLON.DynamicTexture("POI - Panel - Texture", pan_size.px.width, scene, true);
        texture.hasAlpha = true;
        
        var img = new Image();
        img.onload = function () {
            var textureContext = texture.getContext();

            // Computes the size of the pictogram (in pixels)
            var picto_size = {
                width : pan_size.px.width,
                height : pan_size.px.height * RANDO.SETTINGS.PICTO_SIZE / pan_size.m.height
            };

            // Draws pictogram on the texture
            textureContext.fillStyle = "white";
            RANDO.Utils.roundRect(textureContext, 0, 0, picto_size.width, picto_size.height, 45);
            textureContext.drawImage(img, 0, 0, picto_size.width, picto_size.height);

            // Set the text
            var text = elevation + "m";
            var fontSize = (pan_size.px.height - picto_size.height) * RANDO.SETTINGS.POI_LABEL_SCALE ;
            // (It is important to set the font size of texture context before measuring text width)
            textureContext.font = "bolder " + fontSize + "pt Arial";
            var text_size = {
                width : textureContext.measureText(text).width,
                height : fontSize
            };

            // Draw the text under the pictogram
            textureContext.fillStyle = "#fff";
            textureContext.textAlign = "center";
            textureContext.fillText(text, pan_size.px.width/2, pan_size.px.height);

            // Update
            textureContext.restore();
            texture.update();
            panel.material.diffuseTexture   = texture;
            panel.material.emissiveTexture  = texture;
        };
        img.src = src;
    };

    /**
     * RANDO.Poi._buildSphere() : build a Sphere which will be on the real position 
     *  of the POI on the DEM.
     */
    function _buildSphere() {
        var scene       = this._scene;
        var position    = this._position;

        var sphere = BABYLON.Mesh.CreateSphere(
            "POI - Sphere", 10, RANDO.SETTINGS.POI_SIZE, scene
        );
        sphere.position = new BABYLON.Vector3(
            position.x,
            position.y,
            position.z
        );
        sphere.material = new BABYLON.StandardMaterial(
            "POI - Sphere - Material", scene
        );
        sphere.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        sphere.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        this.sphere = sphere;
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
     * RANDO.Poi.drape() : drape the POI over the DEM
     *      - ground : ground of the DEM 
     */
    function drape(ground) {
        RANDO.Utils.drapePoint(this.panel.position, ground, RANDO.SETTINGS.POI_OFFSET);
        RANDO.Utils.drapePoint(this.sphere.position, ground);
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
        var clickedID;

        // MouseDown Event : check if the mouse is over a Picto when Mouse left click is down
        RANDO.Events.addEvent(window, "mousedown", function (evt) {
            var pickResult = scene.pick (evt.clientX, evt.clientY);
            var pickedMesh = pickResult.pickedMesh;

            $('.poi--hover').css('display', 'none');
            $('.poi--clicked').css('display', 'none');
            clickedID = -1;

            // if the click hits a pictogram, we display informations of POI
            if (pickResult.hit && pickedMesh.name == "POI - Panel") {
                pois[pickedMesh.id].onMouseDownHandler(evt);
                clickedID = pickedMesh.id;
            }
        });

        // MouseMove Event : always check if mouse is over a Picto
        RANDO.Events.addEvent(window, "mousemove", function (evt) {
            var pickResult = scene.pick (evt.clientX, evt.clientY);
            var pickedMesh = pickResult.pickedMesh;

            $('.poi--hover').css('display', 'none');
            $('#canvas_renderer')[0].style.cursor = 'default';

            // if mouse is over a pictogram, we display informations of POI
            if (pickResult.hit && pickedMesh.name == "POI - Panel"
                && clickedID != pickedMesh.id) {
                pois[pickedMesh.id].onMouseOverHandler(evt);
            }
        });
        
        $(".close_btn").on('click', function () {
            $(".poi_side").css('display', 'none');
            $('.interface').css('width', '100%');
        });
        $(".close_btn").mouseover( function () {
           this.style.cursor = 'pointer';
        });
        $(".close_btn").mouseout( function () {
            this.style.cursor = 'default';
        });
        
    };

    /**
     * RANDO.Poi.onMouseDownHandler() : callback to run if the mouse is down over a picto
     *      - evt: event informations
     */
    function onMouseDownHandler (evt) {
        $('.poi--clicked').text(this._name + ' (' + this._elevation + 'm )');
        $('.poi--clicked').css('left', evt.clientX - 20 + 'px');
        $('.poi--clicked').css('top',  evt.clientY - 40 + 'px');
        $('.poi--clicked').css('display', 'block');

        $('.poi_side h2').html(this._name );
        $('.poi_side .description').html(this._description);
        $('.poi_side').css('display', 'block');

        $('.interface').css('width', '80%');
    };

    /**
     * RANDO.Poi.onMouseOverHandler() : callback to run if the mouse is over a picto
     *      - evt: event informations
     */
    function onMouseOverHandler (evt) {
        $('.poi--hover').text(this._name + ' (' + this._elevation + 'm )');
        $('.poi--hover').css('left', evt.clientX - 20 + 'px');
        $('.poi--hover').css('top',  evt.clientY - 40 + 'px');
        $('.poi--hover').css('display', 'block');

        $('#canvas_renderer')[0].style.cursor = 'pointer';
    };

})();
