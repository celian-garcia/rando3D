/*******************************************************************************
 * Rando.Trek.js
 * 
 * Trek class : 
 *  Permites the build of a Trek in 3D
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {  "use strict" 

    /* Constructor */
    RANDO.Trek = function (data, offsets, scene) {
        this._vertices = this._offsets(data, offsets);
        this._scene = scene;
        
        this.spheres     = null;
        this.cylinders   = null;
        this.material    = null;
        this.mergedTreks = [];
        
        this.init();
    };

    /* List of Methods */
    RANDO.Trek.prototype = {
        init:           init,
        _offsets:       _offsets,
        buildTrek:      buildTrek,
        updateVertices: updateVertices,
        drape:          drape,
        merge:          merge
    };
    
    
    function init () {
        this.material = new BABYLON.StandardMaterial("Trek Material", this._scene)
        this.material.diffuseColor = RANDO.SETTINGS.TREK_COLOR;

        this.buildTrek ();
    };

    /**
     * RANDO.Trek._offsets() : translate the Trek data of the offsets attribute 
     * 
     * return the array of vertices
     */
    function _offsets (data, offsets) {
        var vertices = _.clone(data);
        for (var it in vertices){
            vertices[it].x += offsets.x;
            vertices[it].y += offsets.y;
            vertices[it].z += offsets.z;
        }
        return vertices;
    };

    /**
     * RANDO.Trek.buildTrek() : builds the trek with spheres and cylinders
     */
    function buildTrek () {
        // Trek building ...
        console.log("Trek building... " + (Date.now() - RANDO.START_TIME) );
        var vertices    = this._vertices;
        var scene       = this._scene;
        var material    = this.material;
        var spheres     = new BABYLON.Mesh("TREK - Spheres", scene);
        var cylinders   = new BABYLON.Mesh("TREK - Cylinders", scene);
        var n_sph = 0, n_cyl = 0;
        
        function createSphere(vertex) {
            n_sph++;
            var sphere = BABYLON.Mesh.CreateSphere(
                "Sphere " + n_sph, 
                RANDO.SETTINGS.TREK_TESSEL, 
                RANDO.SETTINGS.TREK_WIDTH, 
                scene
            );
            sphere.isVisible = false;
            sphere.position  = vertex;
            sphere.material  = material;
            sphere.parent    = spheres;
        };

        function createCylinder(vertexA, vertexB) {
            n_cyl++;
            var cyl_height = BABYLON.Vector3.Distance(vertexA, vertexB);
            var cylinder = BABYLON.Mesh.CreateCylinder(
                "Cylinder " + n_cyl,
                cyl_height,
                RANDO.SETTINGS.TREK_WIDTH,
                RANDO.SETTINGS.TREK_WIDTH,
                RANDO.SETTINGS.TREK_TESSEL,
                scene
            );
            cylinder.isVisible  = false;
            cylinder.material   = material;
            cylinder.parent     = cylinders;

            // Height is not a variable from BABYLON mesh, 
            //  it is my own variable I put on the cylinder to use it later
            cylinder.height = cyl_height;
        };

        var prev, curr = null;
        for (var it in vertices){
            prev = curr;
            var curr = new BABYLON.Vector3(
                vertices[it].x,
                vertices[it].y,
                vertices[it].z
            );

            createSphere(curr);
            if (prev) {
                createCylinder(prev, curr);
            }
        }

        // Trek built !
        console.log("Trek built ! " + (Date.now() - RANDO.START_TIME) );
        
        this.spheres = spheres;
        this.cylinders = cylinders;
    };

    /**
     * RANDO.Trek.drape() : drape the trek over the ground 
     *      - ground : Mesh in which we drape spheres
     *      - onComplete : callback called at the end of the function 
     */
    function drape (ground, onComplete) {
        var spheres     = this.spheres.getChildren();
        var cylinders   = this.cylinders.getChildren();
        var trek_length = spheres.length;
        var index       = 0;
        var chunk       = 100; // By chunks of 100 points
        var that        = this;
        
        console.log("Trek adjustments ... " + (Date.now() - RANDO.START_TIME) );
        drapeChunk();
        
        // Step 1 : drape the spheres over the ground
        function drapeChunk () {
            var cnt = chunk;
            while (cnt-- && index < trek_length) {
                RANDO.Utils.drapePoint(spheres[index].position, ground, RANDO.SETTINGS.TREK_OFFSET);
                ++index;
            }
            if (index < trek_length){
                setTimeout(drapeChunk, 1);
            }else {
                // At the end of draping we place cylinders
                setTimeout(placeCylinders, 1); 
            }
        };

        // Step 2 : Place all cylinders between each pairs of spheres 
        function placeCylinders () {
            for (var i = 0; i < trek_length-1; i++) {
                RANDO.Utils.placeCylinder(
                    cylinders[i], 
                    spheres[i].position, 
                    spheres[i+1].position
                );
            }
            
            onComplete();
            console.log("Trek adjusted ! " + (Date.now() - RANDO.START_TIME) );
        };
    };

    /**
     * RANDO.Trek.merge() : merge all elements (spheres and cylinders) of the Trek
     */
    function merge () {
        var scene       = this._scene;
        var spheres     = this.spheres.getChildren();
        var cylinders   = this.cylinders.getChildren();
        
        var meshes = spheres.concat(cylinders);
        var mergedTrek = new BABYLON.Mesh("Merged Trek", scene);
        RANDO.Utils.mergeMeshes(mergedTrek, meshes);
        
        this.mergedTreks.push(mergedTrek);
    };

    /**
     * RANDO.Trek.updateVertices() : update this._vertices attributes
     */
    function updateVertices () {
        var vertices    = this._vertices;
        var spheres     = this.spheres.getChildren();
        console.assert(vertices.length == spheres.length);
        for (var it in spheres) {
            vertices[it].x = spheres[it].position.x;
            vertices[it].y = spheres[it].position.y;
            vertices[it].z = spheres[it].position.z;
        }
    };
})();




