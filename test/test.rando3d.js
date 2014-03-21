var assert = chai.assert;

describe('Rando3D', function() {
    
    describe('Trapeze grid points ', function() {

        it("should return null point.", function(done) {
            var A = {
                x : 3543,
                y : 252
            };
            var B = {
                x : 243,
                y : 53434
            };
            var n = 0;
            assert.equal(RANDO.Utils.interpol(n, A, B).x, 0);
            assert.equal(RANDO.Utils.interpol(n, A, B).y, 0);
            done();
        });
        
        
        it("should return first point.", function(done) {
            var A = {
                x : 3543,
                y : 252
            };
            var B = {
                x : 243,
                y : 53434
            };
            var n = 1;
            assert.equal(RANDO.Utils.interpol(n, A, B).x, A.x);
            assert.equal(RANDO.Utils.interpol(n, A, B).y, A.y);
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
