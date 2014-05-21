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
    RANDO.Poi = function (data, offsets, scene) {
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        
        this._panel = null;
        this.init();
    };
    
    /* List of Methods */
    RANDO.Poi.prototype = {
        init:                           init,
        _buildPanelFromBlenderObject:   _buildPanelFromBlenderObject,
        _buildPanelFromNothing:         _buildPanelFromNothing
    };
    
    function init () {
        this._buildPanelFromNothing ();
        //~ this._buildPanelFromBlenderObject (RANDO.SETTINGS.POI_FORM1);
    };
    
    function _buildPanelFromNothing () {
        var position = this._data.coordinates;
        position.x += this._offsets.x;
        position.z += this._offsets.z;
        var text = this._data.properties.name;
        var scene = this._scene;

        var height = 100;
        var panel = RANDO.Utils.createPanel (height, text, scene, "rgba(1,1,1,0)", "#FFFFFF");
        panel.position.x = position.x;
        panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
        panel.position.z = position.z;
        panel.material.specularColor = new BABYLON.Color4(0,0,0, 0);
        this._panel = panel;
        var panel_size = RANDO.Utils.getSize (panel);
        
        //~ var plane = panel.clone("plane");
        //~ console.log(plane);
        //~ plane.material = new BABYLON.StandardMaterial("planeMat", scene);
        //~ plane.material.ambientColor = new BABYLON.Color3(.8,.8,.8);
        //~ plane.material.diffuseColor = new BABYLON.Color3(.64,.64,.64);
        //~ plane.material.specularColor = new BABYLON.Color3(.5,.5,.5);
        //~ plane.material.specularPower = 50;
        //~ plane.material.alpha = 0.3741;
        //~ plane.material.backFaceCulling = false;
        
        console.log(scene.activeCamera);
        scene.registerBeforeRender( function () {
            panel.lookAt(scene.activeCamera.position, 0, -Math.PI/2, 0);//Math.PI/2);
            //~ plane.lookAt(scene.activeCamera.position, 0, Math.PI/2);
        });
    };
    function _buildPanelFromBlenderObject (settings) {
        var position = this._data.coordinates;
        position.x += this._offsets.x;
        position.z += this._offsets.z;
        
        var text = this._data.properties.name;
        var scene = this._scene;
        var that = this;
        
        BABYLON.SceneLoader.ImportMesh(
            settings.objectName, 
            settings.folder, 
            settings.fileName, 
            scene, 
            function (newMeshes) {
                for (var it in newMeshes) {
                    newMeshes[it].position.x = position.x;
                    newMeshes[it].position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
                    newMeshes[it].position.z = position.z;

                    newMeshes[it].scaling.x *= RANDO.SETTINGS.POI_SCALE;
                    newMeshes[it].scaling.y *= RANDO.SETTINGS.POI_SCALE;
                    newMeshes[it].scaling.z *= RANDO.SETTINGS.POI_SCALE;
                    
                    newMeshes[it].rotation.x = Math.PI/2;
                    newMeshes[it].rotation.y = 0;
                    newMeshes[it].rotation.z = 0;
                }

                var sphere = newMeshes[0];
                var plane  = newMeshes[1];
                var plane_size = RANDO.Utils.getSize (plane);

                var minmax = BABYLON.Mesh.MinMax([plane]);

                sphere.position.y -= plane_size.height * RANDO.SETTINGS.POI_SCALE/ 2;
                
                
                var panel = RANDO.Utils.createPanel (plane_size.height, text, scene, "rgba(1,1,1,0)", "#FFFFFF");
                panel.position.x = position.x;
                panel.position.y = position.y + RANDO.SETTINGS.POI_OFFSET;
                panel.position.z = position.z;
                var panel_size = RANDO.Utils.getSize (panel);
                that._panel = panel;

                // Set the scale of the plane in order to obtain the same width than panel
                var final_width = panel_size.width ;
                plane.scaling.x *= final_width/plane_size.width;
            }
        ); 
    };
    
})();
