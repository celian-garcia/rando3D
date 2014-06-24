/*******************************************************************************
 * Rando.CameraComputer.js
 *
 * CameraComputer class :
 *  Used to separate calculations from the CameraContainer
 *
 * @author: Célian GARCIA
 ******************************************************************************/

var RANDO = RANDO || {};

(function () {  "use strict"

    /* Constructor */
    RANDO.CameraComputer = function () {
        this._altitudes = null;
        this._totalExtent = null;
    };

    /* Methods */
    RANDO.CameraComputer.prototype.computeInitialPositionToRef = function (extent, altitudes, initialPosition) {
        this._totalExtent = extent;
        this._altitudes = altitudes;
    };
})();
