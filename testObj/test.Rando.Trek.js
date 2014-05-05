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
    
    var data_translated = [
        {x:  0, y:  9, z: -5},
        {x:  3, y:  7, z: -4},
        {x:  6, y:  5, z: -3},
        {x:  9, y:  7, z: -2},
        {x:  6, y:  9, z: -3},
        {x:  3, y:  7, z: -4},
        {x:  0, y:  5, z: -5}
    ];
    
    
    describe('Attributes', function () {
        it("_data attribute should equals to data parameter.", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek._data, data);
            done();
            trek.dispose();
        });
        
        it("_offsets attribute should equals to offsets parameter.", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek._offsets, offsets);
            done();
            trek.dispose();
        });
        
        it("_scene attribute should equals to scene parameter.", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek._scene, scene);
            done();
            trek.dispose();
        });
        
        it("spheres attribute name should equals to \"Spheres\" .", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek.spheres.name, "Spheres");
            done();
            trek.dispose();
        });
        
        it("cylinders attribute name should equal to \"Cylinders\" .", function(done) {
            var trek = new RANDO.Trek(data, offsets, scene);
            assert.equal(trek.cylinders.name, "Cylinders");
            done();
            trek.dispose();
        });
    });
    
    describe('Methods', function () {
        describe('build the Trek - this.buildTrek()', function () {
            it("Number of Cylinders should be equals to the number of vertices -1.", function(done) {
                var trek = new RANDO.Trek(data, offsets, scene);
                trek.buildTrek();
                
                assert.deepEqual(
                    trek.cylinders.getChildren().length, 
                    data.length-1
                );
                done();
                trek.dispose();
            });
            
            it("Number of Spheres should be equals to the number of vertices .", function(done) {
                var trek = new RANDO.Trek(data, offsets, scene);
                trek.buildTrek();
                
                assert.deepEqual(
                    trek.spheres.getChildren().length, 
                    data.length
                );
                done();
                trek.dispose();
            });
        });
        describe('translate - this.translate()', function () {
            it("should translates of offsets attribute if no arguments.", function(done) {
                var trek = new RANDO.Trek(data, offsets, scene);
                var trek_data_tr = _.clone(trek._data);
                for (var it in trek_data_tr) {
                    trek_data_tr[it].x += offsets.x;
                    trek_data_tr[it].y += offsets.y;
                    trek_data_tr[it].z += offsets.z;
                }
                
                trek.translate();
                
                assert.deepEqual(trek._data, trek_data_tr);
                done();
                trek.dispose();
            });
            
            
            it("should translates of arguments values if arguments.", function(done) {
                var trek = new RANDO.Trek(data, offsets, scene);
                var trek_data_tr = _.clone(trek._data);
                var dx = 10, dy = 5, dz = -5;
                
                for (var it in trek_data_tr) {
                    trek_data_tr[it].x += dx;
                    trek_data_tr[it].y += dy;
                    trek_data_tr[it].z += dz;
                }
                
                trek.translate(dx, dy, dz);
                
                assert.deepEqual(trek._data, trek_data_tr);
                done();
                trek.dispose();
            });
        });
    });
});
