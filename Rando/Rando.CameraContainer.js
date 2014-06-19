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
    RANDO.CameraContainer = function (canvas, scene, params) {
        this._canvas    = canvas;
        this._scene     = scene;
        this._switchEnabled     = params.switchEnabled || false;
        this._demCenter         = _.clone(params.demCenter) || BABYLON.Vector3.Zero();
        this._demExtent         = _.clone(params.demExtent) || BABYLON.Vector3.Zero();
        this._offsets           = params.offsets || BABYLON.Vector3.Zero();

        this.cameras    = {};

        this._animationPath = null;
        this._controlsAttached  = false;
        this._positionBeforeSwitch = null;
        this._targetBeforeSwitch = null;

        this.initialPosition    = BABYLON.Vector3.Zero();
        this.initialTarget      = BABYLON.Vector3.Zero();
        this.lowerXLimit        = null;
        this.lowerZLimit        = null;
        this.upperXLimit        = null;
        this.upperZLimit        = null;
        this.lowerRadiusLimit   = null;
        this.upperRadiusLimit   = null;

        this.init();
    };

    // Static Array defining possibles cameras IDs
    RANDO.CameraIDs = ["demo_camera", "free_camera", "map_camera", "helico_camera", "hiker_camera"];

    /* Methods */
    RANDO.CameraContainer.prototype.init = function () {
        this._computeInitialParameters ();
        this._buildDemoCamera ();
        this._buildFreeCamera ();
        this._buildHelicoCamera ();
        this._buildMapCamera ();
        this._buildHikerCamera ();
        this._cameraSwitcher ();
    };

    /**
     * RANDO.CameraContainer._buildDemoCamera() : build of the demo camera
     */
    RANDO.CameraContainer.prototype._buildDemoCamera = function () {
        var demo_camera = new RANDO.ArcRotateCamera(
            "Demo Camera", 0, 0, 0,
            this.initialTarget,
            this._scene
        );
        demo_camera.id = "demo_camera";
        demo_camera.keysUp    = [83, 40]; // Touche Z and up
        demo_camera.keysDown  = [90, 38]; // Touche S and down
        demo_camera.keysLeft  = [68, 39]; // Touche Q and left
        demo_camera.keysRight = [81, 37]; // Touche D and right
        demo_camera.wheelPrecision      = 0.2;
        demo_camera.lowerRadiusLimit    = this.lowerRadiusLimit;
        demo_camera.upperRadiusLimit    = this.upperRadiusLimit;
        demo_camera.upperBetaLimit = Math.PI/2;
        demo_camera.maxZ    = 10000;

        this.cameras.demo_camera = demo_camera;
    };

    /**
     * RANDO.CameraContainer._buildFreeCamera() : build of the Free camera
     */
    RANDO.CameraContainer.prototype._buildFreeCamera = function () {
        var free_camera = new BABYLON.FreeCamera(
            "Flying Camera", 
            BABYLON.Vector3.Zero(),
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
     * RANDO.CameraContainer._buildMapCamera() : build of the Helico camera
     */
    RANDO.CameraContainer.prototype._buildMapCamera = function () {
        var map_camera = new RANDO.MapCamera(
            "Map Camera",0, 0, 0,
            this.initialTarget,
            this._scene
        );
        map_camera.id = "map_camera";
        map_camera.keysUp     = [90, 38]; // Touche Z and up
        map_camera.keysDown   = [83, 40]; // Touche S and down
        map_camera.keysLeft   = [81, 37]; // Touche Q and left
        map_camera.keysRight  = [68, 39]; // Touche D and right

        map_camera.wheelPrecision = 0.2;
        map_camera.checkCollisions = true;
        map_camera.maxZ = 10000;
        map_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;
        
        map_camera.lowerXLimit = this.lowerXLimit;
        map_camera.lowerZLimit = this.lowerZLimit;
        map_camera.upperXLimit = this.upperXLimit;
        map_camera.upperZLimit = this.upperZLimit;
        map_camera.upperRadiusLimit    = this.upperRadiusLimit;
        map_camera.upperBetaLimit = Math.PI/2;
        map_camera.lowerRadiusLimit = 0.1;

        this.cameras.map_camera = map_camera;
    };

    /**
     * RANDO.CameraContainer._buildHelicoCamera() : build of the Map camera
     */
    RANDO.CameraContainer.prototype._buildHelicoCamera = function () {
        var helico_camera = new RANDO.HelicoCamera(
            "Map Camera", 
            BABYLON.Vector3.Zero(),
            this._scene
        );
        helico_camera.id = "helico_camera";
        helico_camera.keysUp     = [90, 38]; // Touche Z and up
        helico_camera.keysDown   = [83, 40]; // Touche S and down
        helico_camera.keysLeft   = [81, 37]; // Touche Q and left
        helico_camera.keysRight  = [68, 39]; // Touche D and right

        helico_camera.checkCollisions = true;
        helico_camera.maxZ = 10000;
        helico_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;

        this.cameras.helico_camera = helico_camera;
    };

    /**
     * RANDO.CameraContainer._buildHikerCamera() : build of the Hiker camera
     */
    RANDO.CameraContainer.prototype._buildHikerCamera = function () {
        var hiker_camera = new RANDO.HikerCamera(
            "Hiker Camera", 
            BABYLON.Vector3.Zero(),
            this._scene
        );
        hiker_camera.id = "hiker_camera";

        hiker_camera.checkCollisions = true;
        hiker_camera.maxZ = 10000;

        hiker_camera.returnSpeed = RANDO.SETTINGS.HCAM_RETURN_SPEED;
        hiker_camera.followSpeed = RANDO.SETTINGS.HCAM_FOLLOW_SPEED;
        

        this.cameras.hiker_camera = hiker_camera;
    };

    /**
     * RANDO.CameraContainer.setActiveCamera() : set the active camera of the scene
     *      - newID: ID of the camera we want to set as active
     * 
     * NB : newID should be in the static array RANDO.cameraIDs
     */
    RANDO.CameraContainer.prototype.setActiveCamera = function (newID) {
        if (RANDO.CameraIDs.indexOf(newID) == -1) {
            console.error("RANDO.CameraContainer.setActiveCamera () : " + newID + 
                            " is not an available camera's ID");
            return;
        }

        var oldID = this._scene.activeCamera.id;

        // Record informations of the old camera
        this._recordInfoBeforeSwitch(oldID);

        // Attach & detach controls of cameras
        if (this._controlsAttached) {
            this.cameras[oldID].detachControl();
        }
        this.cameras[newID].attachControl(this._canvas);
        this._controlsAttached = true;

        // Update camera
        this._scene.setActiveCameraByID (newID);
        this._resetByDefault();

        // Interface changings
        $(".controls--" + oldID).css("display", "none");
        $("#" + oldID)[0].className = "camera" ;
        $(".controls--" + newID).css("display", "block");
        $("#" + newID)[0].className = "camera camera--selected" ;
    };

    RANDO.CameraContainer.prototype._recordInfoBeforeSwitch = function (oldID) {
        if (oldID == "map_camera" || oldID == "demo_camera") {
            
            this._positionBeforeSwitch  = this._scene.activeCamera.position.clone();
            this._targetBeforeSwitch    = this._scene.activeCamera.target.clone();
            this._rotationBeforeSwitch  = null;
        } else if (oldID == "helico_camera" || oldID == "free_camera" ||
                    oldID == "hiker_camera") {
                        
            this._positionBeforeSwitch  = this._scene.activeCamera.position.clone();
            this._rotationBeforeSwitch  = this._scene.activeCamera.rotation.clone();
            this._targetBeforeSwitch    = null;
        }
    };
    
    RANDO.CameraContainer.prototype.setAnimationPath = function (vertices) {
        this._animationPath = vertices;

        var hiker_camera = this.cameras.hiker_camera;
        hiker_camera.setPath(vertices);
    };

    RANDO.CameraContainer.prototype._cameraSwitcher = function () {
        var idArray = RANDO.CameraIDs;
        var that = this;

        if (!this._switchEnabled) {
            return;
        }
        else {
             $(".camera_switcher").css("display", "block");
        }

        for (var it in idArray) {
            $("#" + idArray[it]).on("click", function () {
                that.setActiveCamera (this.id);
            });
        }
    };

    RANDO.CameraContainer.prototype._resetByDefault = function () {
        var activeCam = this._scene.activeCamera;

        // Arcrotate type
        if (activeCam.id == "map_camera" || activeCam.id == "demo_camera") {
            activeCam.setPosition(this.initialPosition.clone());
            activeCam.target = this.initialTarget.clone();
        }

        // Free type 
        else if (activeCam.id == "helico_camera" || activeCam.id == "free_camera" ) {
            activeCam.position = this.initialPosition.clone();
            activeCam.setTarget(this.initialTarget.clone());
        }

        // Hiker type
        else if (activeCam.id == "hiker_camera" ) {
            if (this._positionBeforeSwitch) {
                activeCam.position = this._positionBeforeSwitch;
            } 
            if (this._rotationBeforeSwitch) {
                activeCam.rotation = this._rotationBeforeSwitch;
            }
            if (this._targetBeforeSwitch) {
                activeCam.setTarget(this._targetBeforeSwitch);
            }
        }

        activeCam._reset ();
    };

    RANDO.CameraContainer.prototype._computeInitialParameters = function () {
        this._demCenter.x += this._offsets.x;
        this._demCenter.z += this._offsets.z;

        this.initialPosition.x = this._demCenter.x + 3000;
        this.initialPosition.y = this._demCenter.y + 1000;
        this.initialPosition.z = this._demCenter.z + 3000;

        this.initialTarget.x = this._demCenter.x;
        this.initialTarget.y = this._demExtent.y.min;
        this.initialTarget.z = this._demCenter.z;

        this.lowerXLimit = this._demExtent.x.min + this._offsets.x;
        this.upperXLimit = this._demExtent.x.max + this._offsets.x;
        this.lowerZLimit = this._demExtent.z.min + this._offsets.z;
        this.upperZLimit = this._demExtent.z.max + this._offsets.z;
        
        this.lowerRadiusLimit = RANDO.SETTINGS.MIN_THICKNESS + this._demCenter.y;
        this.upperRadiusLimit = 8000;
    };

})();
