var assert = chai.assert;

describe('Geotrek 3D - Poi Object', function() {
    
    var position = new BABYLON.Vector3(100, 1000, 100);
    var label = "hello";
    var picto = "img/picto.png"
    
    describe('Attributes', function () {
        it("_position attribute should equals to position parameter.", function(done) {
            var poi = new RANDO.Poi(position, label, scene);
            assert.deepEqual(poi._position, position);
            done();
            poi.dispose();
        });
        
        it("_label attribute should equals to label parameter.", function(done) {
            var poi = new RANDO.Poi(position, label, scene);
            assert.deepEqual(poi._label, label);
            done();
            poi.dispose();
        });
        
        it("_scene attribute should equals to scene parameter.", function(done) {
            var poi = new RANDO.Poi(position, label, scene);
            assert.deepEqual(poi._scene, scene);
            done();
            poi.dispose();
        });
        
        it("_picto attribute should equals to picto parameter if given", function(done) {
            var poi = new RANDO.Poi(position, label, scene, picto);
            assert.deepEqual(poi._picto, picto);
            done();
            poi.dispose();
        });
        it("_picto attribute should equals to null if not given", function(done) {
            var poi = new RANDO.Poi(position, label, scene);
            assert.deepEqual(poi._picto, null);
            done();
            poi.dispose();
        });
    });
    describe('Properties', function () {
    });
});
