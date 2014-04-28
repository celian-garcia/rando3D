/*******************************************************************************
 * Rando.Trek.Hdr.js
 * 
 * Trek class : header file
 * Contains all attributes and prototypes of the Trek class
 * 
 * 
 * /!\ Need to be included in html file in this order
 *      <script src="Rando/Rando.Trek.Src.js"></script>
 *      <script src="Rando/Rando.Trek.Hdr.js"></script>
 * 
 ******************************************************************************/

RANDO = RANDO || {};

(function () {

    RANDO.Trek = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;
        
        this.spheres = new BABYLON.Mesh("Spheres", scene);
        this.cylinders = new BABYLON.Mesh("Cylinders", scene);
        
        /* Initialization */
        this.buildTrek();
    };

    RANDO.Trek.prototype = {
        buildTrek:  buildTrek,
        translate:  translate
    };

})();


