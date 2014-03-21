var assert = chai.assert;

describe('Rando3D', function() {
    
    describe('Trapeze grid points ', function() {

        it("should return null points.", function(done) {
            var A = [0,0];
            var B = [0,0];
            var n = 0;
            assert.equal(RANDO.Utils.interpol(A, B, n).x, 0);
            assert.equal(RANDO.Utils.interpol(A, B, n).y, 0);
            done();
        });
        
        /*it("should have x value equal to 1.", function(done) {
            var A = [0,0];
            var B = [2,2];
            var n = 1;
            assert.equal(RANDO.Utils.interpol(A, B, n).x, 1);
            done();
        });*/
    });
});
