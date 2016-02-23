'use strict';

var chai = require('chai');
var assert = chai.assert;

describe('Geotrek 3D - TileContainer Object', function() {
    var extent = {
        x: {
            max: 100,
            min: 50
        },
        y: {
            max: 100,
            min: 50
        },
        z: {
            max: 100,
            min: 20
        }
    };

    var altitudes = [
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [100, 73, 85, 98, 80]
    ];
    var number_of_points = 5*7;

    var offsets = {
        x: -50,
        y: 30,
        z: -50
    };

    describe('Attributes', function() {
        it("_extent attribute should be equal to extent parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._extent, extent);
            done();
            tilC.dispose();
        });
        it("_altitudes attribute should be equal to altitudes parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._altitudes, altitudes);
            done();
            tilC.dispose();
        });
        it("_offsets attribute should be equal to offsets parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._offsets, offsets);
            done();
            tilC.dispose();
        });
    });

    describe('Methods', function() {
        describe('Tiles generation - this._generateTiles()', function () {
            it("should store all points (test the number of points).", function(done) {
                var tilC = new RANDO.TileContainer(extent, altitudes, offsets);

                var tiles = tilC._tiles;
                var count = 0;
                for (var it in tiles) {
                    var grid = tiles[it].grid;
                    for (var row in grid) {
                        for (var col in grid[row]) {
                            count++;
                        }
                    }
                }
                assert.equal(count, number_of_points);
                done();
                tilC.dispose();
            });
        });

        describe('Get the extent in tiles coordinates - "this.getExtentInTilesCoordinates()"', function () {
            it("should return x.min = 0, x.max = 10, y.min = 5, y.max = 15", function(done) {
                var result = {
                    'x': {
                        'min': 0,
                        'max': 10
                    },
                    'y': {
                        'min': 5,
                        'max': 15
                    }
                };

                var tiles = {
                    'tile1': {
                        'coordinates': {
                            'x': 5,
                            'y': 15
                        }
                    },
                    'tile2': {
                        'coordinates': {
                            'x': 0,
                            'y': 10
                        }
                    },
                    'tile3': {
                        'coordinates': {
                            'x': 10,
                            'y': 5
                        }
                    },
                    'tile4': {
                        'coordinates': {
                            'x': 8,
                            'y': 8
                        }
                    }
                };
                var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
                tilC._tiles = tiles;
                assert.deepEqual(tilC.getExtentInTilesCoordinates(), result);
                done();
            });
        });
    });
});
