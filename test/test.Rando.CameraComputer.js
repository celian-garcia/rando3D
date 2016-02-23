'use strict';

require('../src/app.js');
var RANDO = RANDO || {};
var BABYLON = require('babylonjs');

var canvas = document.createElement("canvas");
var engine = new BABYLON.Engine(canvas, true);
var scene  = new BABYLON.Scene(engine);
RANDO.START_TIME = Date.now();

var chai = require('chai');
var assert = chai.assert;

describe('Geotrek 3D - CameraComputer Object', function() {
    var center = {
        'x' : 2,
        'y' : 0,
        'z' : 2
    };
    var extent = {
        'x' : {
            'min' : -152,
            'max' : 148
        },
        'y' : {
            'min' : 0,
            'max' : 600
        },
        'z' : {
            'min' : -182,
            'max' : 178
        }
    };
    var altitudes = [];
    for (var row = 0; row < 10; row ++) {
        var line = [];
        for (var col = 0; col < 12; col ++) {
            line.push(Math.floor((Math.random() * 600)));
        }
        altitudes.push(line);
    }

    var offsets = {
        'x' : 2,
        'y' : 0,
        'z' : 2
    };

    // var initialPosition = BABYLON.Vector3.Zero();

    describe('Attributes', function () {
        var computer = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene);
        it("_totalExtent attribute should be equal to the offseted extent value on parameter.", function(done) {
            var newExtent = _.clone(extent);
            newExtent.x.min += offsets.x;
            newExtent.x.max += offsets.x;
            newExtent.z.min += offsets.z;
            newExtent.z.max += offsets.z;
            assert.deepEqual(computer._totalExtent, newExtent);
            done();
        });
        it("_altitudes attribute should be equal to the altitudes value on parameter.", function(done) {
            assert.deepEqual(computer._altitudes, altitudes);
            done();
        });
    });
    describe('Methods', function () {
        describe('Squares generation - this._generateSquares()', function () {
            describe('-- General', function () {
                var computer = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene);
                computer._generateSquares();
                it("the first square's extent should have the same xmin and zmin than this._totalExtent.", function(done) {
                    assert.equal(computer._squares[0].extent.x.min, computer._totalExtent.x.min);
                    assert.equal(computer._squares[0].extent.z.min, computer._totalExtent.z.min);
                    done();
                });
                it("the last square's extent should have the same xmax and zmax than this._totalExtent.", function(done) {
                    var length = computer._squares.length-1;
                    assert.equal(computer._squares[length].extent.x.max, computer._totalExtent.x.max);
                    assert.equal(computer._squares[length].extent.z.max, computer._totalExtent.z.max);
                    done();
                });
                it("indices values should be between 0 and 10 (excepted for intern squares).", function(done) {
                    for (var it in computer._squares) {
                        if (computer._squares[it].type != "BLACK") {
                            assert.operator(computer._squares[it].index, '>=', 0);
                            assert.operator(computer._squares[it].index, '<=', 10);
                        }
                    }
                    done();
                });
            });
            describe('-- With number by side = 5', function () {
                var computer5 = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene, 5);
                computer5._generateSquares();
                it("should create 25 squares.", function(done) {
                    assert.equal(computer5._squares.length, 25);
                    done();
                });
                it('corner squares should be of "CORNER" type.', function(done) {
                    assert.equal(computer5._squares[0].type,  "CORNER");
                    assert.equal(computer5._squares[4].type,  "CORNER");
                    assert.equal(computer5._squares[20].type, "CORNER");
                    assert.equal(computer5._squares[24].type, "CORNER");
                    done();
                });
                it('extern border squares should be of "EXTBORDER" type.', function(done) {
                    assert.equal(computer5._squares[1].type,  "EXTBORDER");
                    assert.equal(computer5._squares[2].type,  "EXTBORDER");
                    assert.equal(computer5._squares[3].type,  "EXTBORDER");
                    assert.equal(computer5._squares[5].type,  "EXTBORDER");
                    assert.equal(computer5._squares[10].type, "EXTBORDER");
                    assert.equal(computer5._squares[15].type, "EXTBORDER");
                    assert.equal(computer5._squares[9].type,  "EXTBORDER");
                    assert.equal(computer5._squares[14].type, "EXTBORDER");
                    assert.equal(computer5._squares[19].type, "EXTBORDER");
                    assert.equal(computer5._squares[21].type, "EXTBORDER");
                    assert.equal(computer5._squares[22].type, "EXTBORDER");
                    assert.equal(computer5._squares[23].type, "EXTBORDER");
                    done();
                });
                it('intern border squares should be of "INTBORDER" type.', function(done) {
                    assert.equal(computer5._squares[6].type,  "INTBORDER");
                    assert.equal(computer5._squares[7].type,  "INTBORDER");
                    assert.equal(computer5._squares[8].type,  "INTBORDER");
                    assert.equal(computer5._squares[11].type, "INTBORDER");
                    assert.equal(computer5._squares[13].type, "INTBORDER");
                    assert.equal(computer5._squares[16].type, "INTBORDER");
                    assert.equal(computer5._squares[17].type, "INTBORDER");
                    assert.equal(computer5._squares[18].type, "INTBORDER");
                    done();
                });
                it('intern squares should be of "BLACK" type.', function(done) {
                    assert.equal(computer5._squares[12].type, "BLACK");
                    done();
                });
                it('neighbours of left-bottom corner should have the same members as [0, 1, 2, 5, 6, 10].', function(done) {
                    var neighborhood = [0, 1, 2, 5, 6, 10];
                    assert.sameMembers(computer5._squares[0].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of right-top corner should have the same members as [24, 23, 22, 19, 18, 14].', function(done) {
                    var neighborhood = [24, 23, 22, 19, 18, 14];
                    assert.sameMembers(computer5._squares[24].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of left-top corner should have the same members as [20, 21, 22, 15, 16, 10].', function(done) {
                    var neighborhood = [20, 21, 22, 15, 16, 10];
                    assert.sameMembers(computer5._squares[20].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of right-bottom corner should have the same members as [20, 21, 22, 15, 16, 10].', function(done) {
                    var neighborhood = [2, 3, 4, 8, 9, 14];
                    assert.sameMembers(computer5._squares[4].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of squares[1] (a bottom external border square) should have the same members as [0, 1, 2, 5, 6, 7].', function(done) {
                    var neighborhood = [0, 1, 2, 5, 6, 7];
                    assert.sameMembers(computer5._squares[1].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of squares[23] (a top external border square) should have the same members as [24, 23, 22, 19, 18, 17].', function(done) {
                    var neighborhood = [24, 23, 22, 19, 18, 17];
                    assert.sameMembers(computer5._squares[23].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of squares[14] (a right external border square) should have the same members as [18, 19, 13, 14, 8, 9].', function(done) {
                    var neighborhood = [8, 9, 13, 14, 18, 19];
                    assert.sameMembers(computer5._squares[14].neighborhood, neighborhood);
                    done();
                });
                it('neighbours of squares[5] (a left external border square) should have the same members as [0, 1, 5, 6, 10, 11].', function(done) {
                    var neighborhood = [0, 1, 5, 6, 10, 11];
                    assert.sameMembers(computer5._squares[5].neighborhood, neighborhood);
                    done();
                });
                it('intern squares index should be equal to -1.', function(done) {
                    assert.equal(computer5._squares[12].index, -1);
                    done();
                });
                it('length of intern squares neighborhood should be equal to 0.', function(done) {
                    assert.equal(computer5._squares[12].neighborhood.length, 0);
                    done();
                });
                it('length of intern-border squares neighborhood should be equal to 0.', function(done) {
                    assert.equal(computer5._squares[6].neighborhood.length,  0);
                    assert.equal(computer5._squares[7].neighborhood.length,  0);
                    assert.equal(computer5._squares[8].neighborhood.length,  0);
                    assert.equal(computer5._squares[11].neighborhood.length, 0);
                    assert.equal(computer5._squares[13].neighborhood.length, 0);
                    assert.equal(computer5._squares[16].neighborhood.length, 0);
                    assert.equal(computer5._squares[17].neighborhood.length, 0);
                    assert.equal(computer5._squares[18].neighborhood.length, 0);
                    done();
                });
            });
            describe('-- With number by side = 6', function () {
                var computer6 = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene, 6);
                computer6._generateSquares();
                it("should create 36 squares.", function(done) {
                    assert.equal(computer6._squares.length, 36);
                    done();
                });
                it('corner squares should be of "CORNER" type.', function(done) {
                    assert.equal(computer6._squares[0].type,  "CORNER");
                    assert.equal(computer6._squares[5].type,  "CORNER");
                    assert.equal(computer6._squares[30].type, "CORNER");
                    assert.equal(computer6._squares[35].type, "CORNER");
                    done();
                });
                it('extern border squares should be of "EXTBORDER" type.', function(done) {
                    assert.equal(computer6._squares[1].type,  "EXTBORDER");
                    assert.equal(computer6._squares[2].type,  "EXTBORDER");
                    assert.equal(computer6._squares[3].type,  "EXTBORDER");
                    assert.equal(computer6._squares[4].type,  "EXTBORDER");
                    assert.equal(computer6._squares[6].type,  "EXTBORDER");
                    assert.equal(computer6._squares[12].type, "EXTBORDER");
                    assert.equal(computer6._squares[18].type, "EXTBORDER");
                    assert.equal(computer6._squares[24].type, "EXTBORDER");
                    assert.equal(computer6._squares[11].type, "EXTBORDER");
                    assert.equal(computer6._squares[17].type, "EXTBORDER");
                    assert.equal(computer6._squares[23].type, "EXTBORDER");
                    assert.equal(computer6._squares[29].type, "EXTBORDER");
                    assert.equal(computer6._squares[31].type, "EXTBORDER");
                    assert.equal(computer6._squares[32].type, "EXTBORDER");
                    assert.equal(computer6._squares[33].type, "EXTBORDER");
                    assert.equal(computer6._squares[34].type, "EXTBORDER");
                    done();
                });
                it('intern border squares should be of "INTBORDER" type.', function(done) {
                    assert.equal(computer6._squares[7].type,  "INTBORDER");
                    assert.equal(computer6._squares[8].type,  "INTBORDER");
                    assert.equal(computer6._squares[9].type,  "INTBORDER");
                    assert.equal(computer6._squares[10].type, "INTBORDER");
                    assert.equal(computer6._squares[13].type, "INTBORDER");
                    assert.equal(computer6._squares[16].type, "INTBORDER");
                    assert.equal(computer6._squares[19].type, "INTBORDER");
                    assert.equal(computer6._squares[22].type, "INTBORDER");
                    assert.equal(computer6._squares[25].type, "INTBORDER");
                    assert.equal(computer6._squares[26].type, "INTBORDER");
                    assert.equal(computer6._squares[27].type, "INTBORDER");
                    assert.equal(computer6._squares[28].type, "INTBORDER");
                    done();
                });
                it('intern squares should be of "BLACK" type.', function(done) {
                    assert.equal(computer6._squares[14].type, "BLACK");
                    assert.equal(computer6._squares[15].type, "BLACK");
                    assert.equal(computer6._squares[20].type, "BLACK");
                    assert.equal(computer6._squares[21].type, "BLACK");
                    done();
                });
            });
        });
    });
});
