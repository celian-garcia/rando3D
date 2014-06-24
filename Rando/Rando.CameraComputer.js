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
    RANDO.CameraComputer = function (center, extent, altitudes, offsets) {
        this._center        = {
            'x' : center.x + offsets.x,
            'y' : center.y,
            'z' : center.z + offsets.z
        };
        this._totalExtent   = {
            'x' : {
                'min' : extent.x.min + offsets.x,
                'max' : extent.x.max + offsets.x
            },
            'y' : {
                'min' : extent.y.min,
                'max' : extent.y.max
            },
            'z' : {
                'min' : extent.z.min + offsets.z,
                'max' : extent.z.max + offsets.z
            }
        };
        this._altitudes     = altitudes;
        this._squares         = [];
        console.log(this._totalExtent);
        console.log(this._altitudes);
    };

    /* Methods */
    RANDO.CameraComputer.prototype.computeInitialPositionToRef = function (initialPosition) {
        initialPosition.x = this._center.x + 3000;
        initialPosition.y = this._center.y + 1000;
        initialPosition.z = this._center.z + 3000;
        this._generateSquares ();
    };

    RANDO.CameraComputer.prototype.computeInitialTargetToRef = function (initialTarget) {
        initialTarget.x = this._center.x;
        initialTarget.y = this._totalExtent.y.min;
        initialTarget.z = this._center.z;
    };

    RANDO.CameraComputer.prototype.computeLimitsToRef = function (limits) {
        limits.lowerX = this._totalExtent.x.min;
        limits.upperX = this._totalExtent.x.max;
        limits.lowerZ = this._totalExtent.z.min;
        limits.upperZ = this._totalExtent.z.max;

        limits.lowerRadius = RANDO.SETTINGS.MIN_THICKNESS + this._center.y;
        limits.upperRadius = 8000;
    };

    RANDO.CameraComputer.SQUARES_NUMBER = 5;
    RANDO.CameraComputer.prototype._generateSquares = function () {
        this._fillExtents();
        this._fillIndices();
        console.log(this._squares);
        //~ console.log(this._altitudes);
    };

    RANDO.CameraComputer.prototype._fillExtents = function () {
        var A = {
            'x' : this._totalExtent.x.min,
            'y' : this._totalExtent.y.min
        };
        var B = {
            'x' : this._totalExtent.x.max,
            'y' : this._totalExtent.y.min
        };
        var C = {
            'x' : this._totalExtent.x.max,
            'y' : this._totalExtent.y.max
        };
        var D = {
            'x' : this._totalExtent.x.min,
            'y' : this._totalExtent.y.max
        };

        var grid = RANDO.Utils.createFlatGrid(
            A, B, C, D,
            RANDO.CameraComputer.SQUARES_NUMBER,
            RANDO.CameraComputer.SQUARES_NUMBER
        );

        for (var row = 0 ; row < grid.length-1 ; row++) {
            for (var col = 0 ; col < grid[row].length-1 ; col++) {
                this._squares.push ({
                    'extent' : {
                        'x' : {
                            'min' : grid[row][col].x,
                            'max' : grid[row+1][col+1].x
                        },
                        'z' : {
                            'min' : grid[row][col].y,
                            'max' : grid[row+1][col+1].y
                        }
                    }
                });
            }
        }
    };

    RANDO.CameraComputer.prototype._fillIndices = function () {
        var nb_alt_x = this._altitudes[0].length;
        var nb_alt_y = this._altitudes.length;

        var grid = RANDO.Utils.createElevationGrid(
            this._totalExtent.x.min,
            this._totalExtent.x.max,
            this._totalExtent.y.min,
            this._totalExtent.y.max,
            this._altitudes
        );
        for (var row = 0; row < grid.length; row++) {
            for (var col = 0; col < grid[row].length; col++) {
                this._addToSquares(grid[row][col]);
            };
        };

        for (var it in this._squares) {
            var square = this._squares[it];
            square.index = square.index / square.nb_alt;
            //~ square.index -= this._totalExtent.y.min;
            //~ square.index = square.index * 10 / (this._totalExtent.y.max  - this._totalExtent.y.min);
        }
    };


    RANDO.CameraComputer.prototype._addToSquares = function (position) {

        for (var it in this._squares) {
            var square = this._squares[it];
            if (RANDO.Utils.isInExtent(position, square.extent)) {
                if (square.index) {
                    square.index += position.y;
                    square.nb_alt++;
                } else {
                    square.index = position.y;
                    square.nb_alt = 1;
                }
                break;
            }
        }
    };
})();
