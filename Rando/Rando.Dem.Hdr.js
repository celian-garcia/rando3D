/*******************************************************************************
 * Rando.Dem.Hdr.js
 * 
 * Dem class : header file
 * Contains all attributes and prototypes of the Dem class
 * 
 * 
 * /!\ Need to be included in html file in this order
 *      <script src="Rando/Rando.Dem.Src.js"></script>
 *      <script src="Rando/Rando.Dem.Hdr.js"></script>
 * 
 ******************************************************************************/

RANDO = RANDO || {};

(function () {

    RANDO.Dem = function (data, offsets, scene) {
        /* Attributes declaration */
        this._data = data;
        this._offsets = offsets;
        this._scene = scene;

        this._tiles = new RANDO.TileContainer(this._data, this._offsets)._tiles;
        
        this.ground = new BABYLON.Mesh("Digital Elevation Model", scene);
        this.sides  = new BABYLON.Mesh("Sides", scene);

        /* Initialization */
        this._initCamera();
        this.buildGround();
        this.buildSides();
    };

    RANDO.Dem.prototype = {
        buildGround:        buildGround,
        buildSides:         buildSides,
        _buildTile:         _buildTile,
        _buildSide:         _buildSide,
        _initCamera:        _initCamera
    };

})();



