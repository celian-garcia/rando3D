/*******************************************************************************
 * Rando.Poi.js
 * 
 * Poi class : 
 *  Permites the build of a Point of Interest in 3D
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {
    /* Constructor */
    RANDO.Poi = function (position, label, scene, picto) {
        this._position = position;
        this._label = label;
        this._scene = scene;
        if ( typeof(picto) === "undefined") {
            this._picto = null;
        } else {
            this._picto = picto;
        }
    };
    
    function importObject () {
        var newMeshes, particleSystem;
        BABYLON.SceneLoader.ImportMesh("poi", "blender/", "poi.babylon", this._scene, function (newMeshes, particleSystem) {
            console.log(newMeshes);
        }); 
    }
})();
