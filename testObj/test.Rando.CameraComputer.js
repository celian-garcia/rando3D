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
            'min' : -200,
            'max' : 400
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
            line.push(Math.floor((Math.random() * 600) - 200));
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
            it("should set the _totalExtent value of this to equal the extent value on parameter.", function(done) {
                assert.deepEqual(computer._totalExtent, extent);
                done();
            });
            it("should set the _altitudes value of this to equal the altitudes value on parameter.", function(done) {
                assert.deepEqual(computer._altitudes, altitudes);
                done();
            });
        });
    });
});
