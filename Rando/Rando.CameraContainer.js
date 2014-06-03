/*******************************************************************************
 * Rando.CameraContainer.js
 * 
 * CameraContainer class : 
 *  A container which will contains all cameras of the scene
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {  "use strict" 
    
    /* Constructor */
    RANDO.CameraContainer = function (canvas, scene) {
        this._canvas    = canvas;
        this._scene     = scene;
        
        this.cameras    = [];
        this._camLight  = null;
        
        this.init();
    };

    // Static Array defining possibles cameras IDs
    RANDO.CameraIDs = ["demo_camera", "fly_camera"];

    /* List of Methods */
    RANDO.CameraContainer.prototype = {
        init:                   init,
        _buildDemoCamera:       _buildDemoCamera,
        _buildFlyingCamera:     _buildFlyingCamera,
        _buildAttachedLight:    _buildAttachedLight,
        setActiveCamera:        setActiveCamera
    };

    function init () {
        this._buildDemoCamera ();
        this._buildFlyingCamera ();
        this._buildAttachedLight ();
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
        demo_camera.keysUp    = [83]; // Touche Z and up
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
        demo_camera.attachControl(this._canvas);

        this.cameras.push(demo_camera);
    };

    /**
     * RANDO.CameraContainer._buildFlyingCamera() : build of the flying camera
     */
    function _buildFlyingCamera () {
        var fly_camera = new RANDO.MapCamera(
            "Flying Camera", 
            new BABYLON.Vector3(0, 0, 0), 
            this._scene
        );
        fly_camera.id = "fly_camera";
        fly_camera.keysUp     = [90, 38]; // Touche Z and up
        fly_camera.keysDown   = [83, 40]; // Touche S and down
        fly_camera.keysLeft   = [81, 37]; // Touche Q and left
        fly_camera.keysRight  = [68, 39]; // Touche D and right

        fly_camera.checkCollisions = true;
        fly_camera.maxZ = 10000;
        fly_camera.speed = RANDO.SETTINGS.CAM_SPEED_F ;
        fly_camera.attachControl(this._canvas);

        this.cameras.push(fly_camera);
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
     *      - cameraID: ID of the camera we want to set as active
     * 
     * NB : cameraID should be "demo_camera" or "fly_camera" 
     */
    function setActiveCamera (cameraID) {
        var scene = this._scene;
        var idArray = RANDO.CameraIDs;
        var found = false;
        
        for (var it in idArray) {
            if (cameraID == idArray[it]) {
                scene.setActiveCameraByID (cameraID);
                this._camLight.parent = scene.getCameraByID (cameraID);
                $(".controls--" + cameraID).css("display", "block");
                found = true;
            }else {
                $(".controls--" + idArray[it]).css("display", "none");
            }
        }

        if (!found) {
            console.log("Error in setActiveCamera : the camera ID entered is not available");
        }
    };

})();
