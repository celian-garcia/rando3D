var assert = chai.assert;

describe('Geotrek 3D - CameraComputer Object', function() {
    var extent = {
        'x' : {
            'min' : -150,
            'max' : 120
        },
        'y' : {
            'min' : -200,
            'max' : 400
        },
        'z' : {
            'min' : 50,
            'max' : 190
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

    var initialPosition = BABYLON.Vector3.Zero();
    var computer = new RANDO.CameraComputer();
    describe('Initial position calculation - computeInitialPositionToRef()', function () {
        computer.computeInitialPositionToRef(extent, altitudes, initialPosition);
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
