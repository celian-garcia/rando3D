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
        this._position = _.clone(position);
        this._label = label;
        this._scene = scene;
        if ( typeof(picto) === "undefined") {
            this._picto = null;
        } else {
            this._picto = picto;
        }
        
        this.init();
    };
    
    /* List of Methods */
    RANDO.Poi.prototype = {
        init:           init,
        _importObject:  _importObject
    };
    
    function init () {
        this._importObject (RANDO.SETTINGS.POI_FORM1);
    };
    
    function _importObject (settings) {
        var newMeshes;
        var position = this._position;

        BABYLON.SceneLoader.ImportMesh(
            settings.objectName, 
            settings.folder, 
            settings.fileName, 
            this._scene, 
            function (newMeshes) {
                for (var it in newMeshes) {
                    newMeshes[it].position.x += position.x;
                    newMeshes[it].position.y += position.y + RANDO.SETTINGS.POI_OFFSET;
                    newMeshes[it].position.z += position.z;

                    newMeshes[it].scaling.x *= RANDO.SETTINGS.POI_SCALE;
                    newMeshes[it].scaling.y *= RANDO.SETTINGS.POI_SCALE;
                    newMeshes[it].scaling.z *= RANDO.SETTINGS.POI_SCALE;
                    
                    newMeshes[1].rotation = new BABYLON.Vector3(
                        Math.PI/2,
                        0,
                        0
                    );
                }
                
                var plane = newMeshes[1];
                var sphere = newMeshes[0];
                var max_height = plane._boundingInfo.boundingBox.maximumWorld.y;
                var min_height = plane._boundingInfo.boundingBox.minimumWorld.y;
                var sphere_offset = (max_height - min_height) /2;
                sphere.position.y -= sphere_offset*RANDO.SETTINGS.POI_SCALE;
                
            }
        ); 
    };
})();
