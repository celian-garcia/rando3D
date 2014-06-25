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

    var initialPosition = BABYLON.Vector3.Zero();
    var computer = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene);
    describe('Attributes', function () {
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
        describe('Squares generation (number by side : 5) - this._generateSquares()', function () {
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
            it("should create 25 squares.", function(done) {
                assert.equal(computer._squares.length, 25);
                done();
            });
            it("indices values should be between 0 and 10.", function(done) {
                for (var it in computer._squares) {
                    assert.operator(computer._squares[it].index, '>=', 0);
                    assert.operator(computer._squares[it].index, '<=', 10);
                }
                done();
            });
            it('corner squares should be of "CORNER" type.', function(done) {
                assert.equal(computer._squares[0].type,  "CORNER");
                assert.equal(computer._squares[4].type,  "CORNER");
                assert.equal(computer._squares[20].type, "CORNER");
                assert.equal(computer._squares[24].type, "CORNER");
                done();
            });
            it('extern border squares should be of "EXTBORDER" type.', function(done) {
                assert.equal(computer._squares[1].type,  "EXTBORDER");
                assert.equal(computer._squares[2].type,  "EXTBORDER");
                assert.equal(computer._squares[3].type,  "EXTBORDER");
                assert.equal(computer._squares[5].type,  "EXTBORDER");
                assert.equal(computer._squares[10].type, "EXTBORDER");
                assert.equal(computer._squares[15].type, "EXTBORDER");
                assert.equal(computer._squares[9].type,  "EXTBORDER");
                assert.equal(computer._squares[14].type, "EXTBORDER");
                assert.equal(computer._squares[19].type, "EXTBORDER");
                assert.equal(computer._squares[21].type, "EXTBORDER");
                assert.equal(computer._squares[22].type, "EXTBORDER");
                assert.equal(computer._squares[23].type, "EXTBORDER");
                done();
            });
            it('intern border squares should be of "INTBORDER" type.', function(done) {
                assert.equal(computer._squares[6].type,  "INTBORDER");
                assert.equal(computer._squares[7].type,  "INTBORDER");
                assert.equal(computer._squares[8].type,  "INTBORDER");
                assert.equal(computer._squares[11].type, "INTBORDER");
                assert.equal(computer._squares[13].type, "INTBORDER");
                assert.equal(computer._squares[16].type, "INTBORDER");
                assert.equal(computer._squares[17].type, "INTBORDER");
                assert.equal(computer._squares[18].type, "INTBORDER");
                done();
            });
            it('intern squares should be of "BLACK" type.', function(done) {
                assert.equal(computer._squares[12].type, "BLACK");
                done();
            });
            
        });
        describe('Squares generation (number by side : 6) - this._generateSquares()', function () {
            var computer6 = new RANDO.CameraComputer(center, extent, altitudes, offsets, scene, 6);
            computer6._generateSquares();
            it("the first square's extent should have the same xmin and zmin than this._totalExtent.", function(done) {
                assert.equal(computer6._squares[0].extent.x.min, computer6._totalExtent.x.min);
                assert.equal(computer6._squares[0].extent.z.min, computer6._totalExtent.z.min);
                done();
            });
            it("the last square's extent should have the same xmax and zmax than this._totalExtent.", function(done) {
                var length = computer6._squares.length-1;
                assert.equal(computer6._squares[length].extent.x.max, computer6._totalExtent.x.max);
                assert.equal(computer6._squares[length].extent.z.max, computer6._totalExtent.z.max);
                done();
            });
            it("should create 36 squares.", function(done) {
                assert.equal(computer6._squares.length, 36);
                done();
            });
            it("indices values should be between 0 and 10.", function(done) {
                for (var it in computer6._squares) {
                    assert.operator(computer6._squares[it].index, '>=', 0);
                    assert.operator(computer6._squares[it].index, '<=', 10);
                }
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
