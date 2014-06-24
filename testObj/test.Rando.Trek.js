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
        describe('Merge function - this.merge()', function (done) {
            it("this.mergedTreks array should not be empty", function (done) {
                var trek = new RANDO.Trek(data, offsets, scene);
                trek.merge();
                assert(trek.mergedTreks.length > 0, "this.mergedTreks array is empty !");
                done();
                trek.dispose();
            });
            
            it("this.mergedTreks array should not contain any mesh which have more vertices than the limit of vertices by mesh", function (done) {
                var nMax = RANDO.SETTINGS.LIMIT_VERT_BY_MESH;
                RANDO.SETTINGS.TREK_SPH_TESSEL = 5;
                RANDO.SETTINGS.TREK_CYL_TESSEL = 10;
                var hugeDataLength = 420; 
                /* 420 is a number chosen to reach the limit of vertices, it 
                 * trains a number of vertices equal to 67998 with this configuration : 
                 *      - RANDO.SETTINGS.TREK_SPH_TESSEL = 5;
                 *      - RANDO.SETTINGS.TREK_CYL_TESSEL = 10;
                 */
                var hugeData = [];
                
                // Fill a huge set of data
                for (var i = 0; i < hugeDataLength; i++) {
                    hugeData.push({
                        x: i,
                        y: i,
                        z: i
                    });
                }
                var trek = new RANDO.Trek(hugeData, offsets, scene);
                trek.merge();
                var result = trek.mergedTreks;
                for (var it in result) {
                    assert(result[it].getTotalVertices() < nMax, 
                        "one or several mergedTrek(s) have too many vertices "
                    );
                }

                done();
                trek.dispose();
            });
            
            it("the number of merged Treks should be equal to the number of necessary subdivisions in the total number of vertices", function (done) {
                var nMax = RANDO.SETTINGS.LIMIT_VERT_BY_MESH;
                RANDO.SETTINGS.TREK_SPH_TESSEL = 5;
                RANDO.SETTINGS.TREK_CYL_TESSEL = 10;
                var hugeDataLength = 420; 
                /* 420 is a number chosen to reach the limit of vertices, it 
                 * trains a number of vertices equal to 67998 with this configuration : 
                 *      - RANDO.SETTINGS.TREK_SPH_TESSEL = 5;
                 *      - RANDO.SETTINGS.TREK_CYL_TESSEL = 10;
                 */
                var hugeData = [];

                // Fill a huge set of data
                for (var i = 0; i < hugeDataLength; i++) {
                    hugeData.push({
                        x: i,
                        y: i,
                        z: i
                    });
                }
                var trek = new RANDO.Trek(hugeData, offsets, scene);
                var totalVertices = trek.getTotalVertices();

                trek.merge();
                var result = trek.mergedTreks;

                assert.equal(result.length, Math.floor(totalVertices/nMax) + 1);

                done();
                trek.dispose();
            });
        });
    });
});
