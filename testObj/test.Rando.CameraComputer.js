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
    var computer = new RANDO.CameraComputer(center, extent, altitudes, offsets);
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
        describe('Initial position calculation - computeInitialPositionToRef()', function () {
            it(".", function(done) {
                assert.equal(true, true);
                done();
            });
        });
        describe('Squares generation - this._generateSquares()', function () {
            computer._generateSquares();
            it("the first square's extent must have the same xmin and zmin than this._totalExtent.", function(done) {
                assert.equal(computer._squares[0].extent.x.min, computer._totalExtent.x.min);
                assert.equal(computer._squares[0].extent.z.min, computer._totalExtent.z.min);
                done();
            });
            it("the last square's extent must have the same xmax and zmax than this._totalExtent.", function(done) {
                var length = computer._squares.length-1;
                assert.equal(computer._squares[length].extent.x.max, computer._totalExtent.x.max);
                assert.equal(computer._squares[length].extent.z.max, computer._totalExtent.z.max);
                done();
            });
            it("indices values should be between 0 and 10.", function(done) {
                for (var it in computer._squares) {
                    assert.operator(computer._squares[it].index, '>=', 0);
                    assert.operator(computer._squares[it].index, '<=', 10);
                }
                done();
            });
        });
    });
});
