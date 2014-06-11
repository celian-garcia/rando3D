/*******************************************************************************
 * Rando.CameraContainer.js
 * 
 * CameraContainer class : 
 *  A container which will contains all cameras of the scene
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

var RANDO = RANDO || {};

(function () {  "use strict" 
    
    /* Constructor */
    RANDO.CameraContainer = function (canvas, scene, switchEnabled) {
        this._canvas    = canvas;
        this._scene     = scene;
        
        this.cameras    = {};
        this._camLight  = null;
        this._animationPath = null;
        this._controlsAttached = false;
        this._switchEnabled = switchEnabled | false;

        this.init();
    };

    // Static Array defining possibles cameras IDs
    RANDO.CameraIDs = ["demo_camera", "free_camera", "map_camera", "helico_camera", "path_camera"];

    /* List of Methods */
    RANDO.CameraContainer.prototype = {
        init:                   init,
        _buildDemoCamera:       _buildDemoCamera,
        _buildFreeCamera:       _buildFreeCamera,
        _buildHelicoCamera:     _buildHelicoCamera,
        _buildMapCamera:        _buildMapCamera,
        _buildPathCamera:       _buildPathCamera,
        _buildAttachedLight:    _buildAttachedLight,
        _cameraSwitcher:        _cameraSwitcher,
        _resetByDefault:        _resetByDefault,
        setActiveCamera:        setActiveCamera,
        setAnimationPath:       setAnimationPath
    };

    function init () {
        this._buildDemoCamera ();
        this._buildFreeCamera ();
        this._buildHelicoCamera ();
        this._buildMapCamera ();
        this._buildPathCamera ();
        this._buildAttachedLight ();
        this._cameraSwitcher();
    };

    /**
     * RANDO.CameraContainer._buildDemoCamera() : build of the demo camera
     */
    function _buildDemoCamera () {
        var demo_camera = new BABYLON.ArcRotateCamera(
            "Demo Camera", 1, 0.5, 10,
            new BABYLON.Vector3(0, 1800, 0),
            this._scene
        );
        demo_camera.id = "demo_camera";
        demo_camera.setPosition(new BABYLON.Vector3(-3000, 5000, 3000));
        demo_camera.keysUp    = [83, 40]; // Touche Z and up
        demo_camera.keysDown  = [90, 38]; // Touche S and down
        demo_camera.keysLeft  = [68, 39]; // Touche Q and left
        demo_camera.keysRight = [81, 37]; // Touche D and right
        demo_camera.wheelPrecision      = 0.2;
        demo_camera.upperBetaLimit      = Math.PI/3;
        demo_camera.lowerRadiusLimit    = 1000;
        demo_camera.upperRadiusLimit    = 5000;
        demo_camera.checkCollisions     = true;
        demo_camera.maxZ    = 10000;
        demo_camera.speed   = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.demo_camera = demo_camera;
    };

    /**
     * RANDO.CameraContainer._buildFreeCamera() : build of the Free camera
     */
    function _buildFreeCamera () {
        var free_camera = new BABYLON.FreeCamera(
            "Flying Camera", 
            new BABYLON.Vector3(3000, 5000, -3000),
            this._scene
        );

        free_camera.id = "free_camera";
        free_camera.keysUp     = [90, 38]; // Touche Z and up
        free_camera.keysDown   = [83, 40]; // Touche S and down
        free_camera.keysLeft   = [81, 37]; // Touche Q and left
        free_camera.keysRight  = [68, 39]; // Touche D and right

        free_camera.checkCollisions = true;
        free_camera.maxZ = 10000;
        free_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.free_camera = free_camera;
    };

    /**
     * RANDO.CameraContainer._buildHelicoCamera() : build of the Helico camera
     */
    function _buildHelicoCamera () {
        var helico_camera = new RANDO.HelicoCamera(
            "Helico Camera",1, 0.5, 10,
            new BABYLON.Vector3(0, 1800, 0),
            this._scene
        );
        helico_camera.id = "helico_camera";
        helico_camera.setPosition(new BABYLON.Vector3(-3000, 5000, 3000));
        helico_camera.keysUp     = [90, 38]; // Touche Z and up
        helico_camera.keysDown   = [83, 40]; // Touche S and down
        helico_camera.keysLeft   = [81, 37]; // Touche Q and left
        helico_camera.keysRight  = [68, 39]; // Touche D and right

        helico_camera.wheelPrecision = 0.1;
        helico_camera.checkCollisions = true;
        helico_camera.maxZ = 10000;
        helico_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.helico_camera = helico_camera;
    };

    /**
     * RANDO.CameraContainer._buildMapCamera() : build of the Map camera
     */
    function _buildMapCamera () {
        var map_camera = new RANDO.MapCamera(
            "Map Camera", 
            new BABYLON.Vector3(-3000, 5000, 3000),
            this._scene
        );
        map_camera.id = "map_camera";
        map_camera.keysUp     = [90, 38]; // Touche Z and up
        map_camera.keysDown   = [83, 40]; // Touche S and down
        map_camera.keysLeft   = [81, 37]; // Touche Q and left
        map_camera.keysRight  = [68, 39]; // Touche D and right

        map_camera.checkCollisions = true;
        map_camera.maxZ = 10000;
        map_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.map_camera = map_camera;
    };

    /**
     * RANDO.CameraContainer._buildPathCamera() : build of the Path camera
     */
    function _buildPathCamera () {
        var path_camera = new RANDO.PathCamera(
            "Path Camera", 
            new BABYLON.Vector3(-3000, 5000, 3000),
            this._scene
        );
        path_camera.id = "path_camera";

        path_camera.checkCollisions = true;
        path_camera.maxZ = 10000;
        path_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.path_camera = path_camera;
    };

    /**
     * RANDO.CameraContainer._buildAttachedLight() : build the attached light of camera
     */
    function _buildAttachedLight () {
        var scene = this._scene;
        this._camLight = new BABYLON.HemisphericLight("Camera Light", new BABYLON.Vector3(0,1000,0), scene)
        this._camLight.intensity = 0.8;
        this._camLight.specular = new BABYLON.Color4(0, 0, 0, 0);
    };

    /**
     * RANDO.CameraContainer.setActiveCamera() : set the active camera of the scene
     *      - newID: ID of the camera we want to set as active
     * 
     * NB : newID should be in the static array RANDO.cameraIDs
     */
    function setActiveCamera (newID) {
        if (RANDO.CameraIDs.indexOf(newID) == -1) {
            console.log(newID);
            console.error("RANDO.CameraContainer.setActiveCamera () : ID in parameter is not available");
            return;
        }

        var scene = this._scene;
        var oldID = scene.activeCamera.id;

        // Controls
        if (this._controlsAttached) {
            this.cameras[oldID].detachControl();
        }
        this.cameras[newID].attachControl(this._canvas);

        // Set camera
        scene.setActiveCameraByID (newID);
        this._resetByDefault();
        this._camLight.parent = this.cameras[newID];

        // Interface changings
        $(".controls--" + newID).css("display", "block");
        $("#" + newID).css("background-color", "red");
        $(".controls--" + oldID).css("display", "none");
        $("#" + oldID).css("background-color", "black");
    };

    function setAnimationPath (vertices) {
        this._animationPath = vertices;

        var path_camera = this.cameras.path_camera;
        path_camera.setPath(vertices);
    };

    function _cameraSwitcher () {
        var idArray = RANDO.CameraIDs;
        var that = this;
        
        if (!this._switchEnabled) {
            return ;
        }else {
             $(".camera_switcher").css("display", "block");
        }

        for (var it in idArray) {
            $("#" + idArray[it]).on("click", function () {
                that.setActiveCamera (this.id);
            });
        }
    };

    function _resetByDefault () {
        var activeCam = this._scene.activeCamera;

        if (activeCam.id == "helico_camera" || activeCam.id == "demo_camera") {
            activeCam.setPosition(new BABYLON.Vector3(-3000, 5000, 3000));
        } else if (activeCam.id == "map_camera" || activeCam.id == "path_camera" ||
                    activeCam.id == "free_camera" ) {
                        
            activeCam.position = new BABYLON.Vector3(-3000, 5000, 3000);
            if (activeCam.id == "path_camera") {
                if (activeCam._path.length) {
                    activeCam.loadPathOnTimeline();
                }
            }
        }
    };

})();
