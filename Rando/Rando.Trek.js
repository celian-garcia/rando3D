/*******************************************************************************
 * Rando.Trek.js
 * 
 * Trek class : 
 *  Permites the build of a Trek in 3D
 * 
 * @author: Célian GARCIA
 ******************************************************************************/

RANDO = RANDO || {};

(function () {

    /* Constructor */
    RANDO.Trek = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        
        this.spheres = new BABYLON.Mesh("Spheres", this._scene);
        this.cylinders = new BABYLON.Mesh("Cylinders", this._scene);
        this.mergedTrek = null;
    };

    /* List of Methods */
    RANDO.Trek.prototype = {
        init:       init,
        buildTrek:  buildTrek,
        translate:  translate,
        drape:      drape,
        merge:      merge
    };
    
    
    function init () {
        this.translate();
        this.buildTrek();
    };

    /**
     * RANDO.Trek.buildTrek() : builds the trek with spheres and cylinders
     */
    function buildTrek () {
        // Trek building ...
        console.log("Trek building... " + (Date.now() - RANDO.START_TIME) );
        var vertices = this._data;
        var offsets = this._offsets;
        var scene = this._scene;
        var spheres = this.spheres;
        var cylinders = this.cylinders;

        // Trek material
        var trek_material = new BABYLON.StandardMaterial("Trek Material", scene);
        trek_material.diffuseColor = RANDO.SETTINGS.TREK_COLOR;

        var n_sph = 0;
        function createSphere(vertex) {
            n_sph++;
            var sphere = BABYLON.Mesh.CreateSphere(
                "Sphere " + n_sph, 
                5, 
                RANDO.SETTINGS.TREK_WIDTH, 
                scene
            );
            sphere.isVisible = false;
            sphere.position = vertex;
            sphere.material = trek_material;
            sphere.parent = spheres;
        }

        var n_cyl = 0;
        function createCylinder(vertexA, vertexB) {
            n_cyl++;
            var cyl_height = BABYLON.Vector3.Distance(vertexA, vertexB);
            var cylinder = BABYLON.Mesh.CreateCylinder(
                "Cylinder " + n_cyl,
                cyl_height,
                RANDO.SETTINGS.TREK_WIDTH,
                RANDO.SETTINGS.TREK_WIDTH,
                10,
                scene
            );
            cylinder.isVisible = false;
            cylinder.material = trek_material;
            cylinder.parent = cylinders;

            // Height is not a variable from BABYLON mesh, 
            //  it is my own variable I put on the cylinder to use it later
            cylinder.height = cyl_height;
        }

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
    };


    /**
     * RANDO.Trek.translate() : translate the Trek data of the offsets attribute or of 
     * the offsets given in parameters
     */
    function translate (dx, dy, dz) {
        
        var vertices = this._data;
        var offsets = {};
        
        if (typeof(dx) === "undefined"){
            offsets.x = this._offsets.x;
        }else {
            offsets.x = dx;
        }
        
        if (typeof(dy) === "undefined"){
            offsets.y = this._offsets.y;
        }else {
            offsets.y = dy;
        }
        
        if (typeof(dz) === "undefined"){
            offsets.z = this._offsets.z;
        }else {
            offsets.z = dz;
        }
        
        for (it in vertices){
            vertices[it].x += offsets.x;
            vertices[it].y += offsets.y;
            vertices[it].z += offsets.z;
        }
    };
    
    /**
     * RANDO.Trek.drape() : drape the trek over the ground 
     *      - ground : Mesh in which we drape spheres
     */
    function drape (ground) {
        var spheres = this.spheres.getChildren();
        var cylinders = this.cylinders.getChildren();
        var trek_length = spheres.length;
        var index = 0;
        var chunk = 100; // By chunks of 100 points
        var that = this;
        
        console.log("Trek adjustments ..." + (Date.now() - RANDO.START_TIME) );
        drapeChunk();
        
        // Step 1 : drape the spheres over the ground
        function drapeChunk () {
            var cnt = chunk;
            while (cnt-- && index < trek_length) {
                RANDO.Utils.drapePoint(spheres[index].position, ground);
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
            that.merge();
            console.log("Trek adjusted ! " + (Date.now() - RANDO.START_TIME) );
        };
    };
    
    /**
     * RANDO.Trek.merge() : merge all elements (spheres and cylinders) of the Trek
     */
    function merge () {
        var spheres = this.spheres.getChildren();
        var cylinders = this.cylinders.getChildren();
        var trek = this.mergedTrek;
        trek = RANDO.Utils.mergeMeshes("Trek merged", spheres.concat(cylinders), this._scene);
        trek.material = spheres[0].material;
        trek.isVisible = true;
    };
})();




