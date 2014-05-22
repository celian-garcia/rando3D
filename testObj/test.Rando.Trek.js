var assert = chai.assert;

        
describe('Geotrek 3D - Trek Object', function() {
    var data = [
        {x: -5, y:  2, z:  0},
        {x: -2, y:  0, z:  1},
        {x:  1, y: -2, z:  2},
        {x:  4, y:  0, z:  3},
        {x:  1, y:  2, z:  2},
        {x: -2, y:  0, z:  1},
        {x: -5, y: -2, z:  0}
    ];

    var offsets = {
        x: 5,
        y: 7,
        z: -5
    };

    describe('Attributes', function () {
        it("_vertices attribute should be equal to data parameter translated by offsets.", function(done) {
            var vertices = [
                {x:  0, y:  9, z: -5},
                {x:  3, y:  7, z: -4},
                {x:  6, y:  5, z: -3},
                {x:  9, y:  7, z: -2},
                {x:  6, y:  9, z: -3},
                {x:  3, y:  7, z: -4},
                {x:  0, y:  5, z: -5}
            ];
            
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.deepEqual(trek._vertices, vertices);
            done();
            trek.dispose();
        });

        it("_scene attribute should be equal to scene parameter.", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek._scene, scene);
            done();
            trek.dispose();
        });
        
        it("spheres BABYLON name should be equal to \"TREK - Spheres\" .", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek.spheres.name, "TREK - Spheres");
            done();
            trek.dispose();
        });
        
        it("cylinders BABYLON name should be equal to \"TREK - Cylinders\" .", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek.cylinders.name, "TREK - Cylinders");
            done();
            trek.dispose();
        });
    });
    
    describe('Methods', function () {
    });
});
