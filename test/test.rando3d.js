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
            assert.equal(RANDO.Utils.subdivide(0, A, B).x, 0);
            assert.equal(RANDO.Utils.subdivide(0, A, B).y, 0);
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
            assert.equal(RANDO.Utils.subdivide(1, A, B), A);
            done();
        });
        
        it("should return both points.", function(done) {
            var A = {
                x : 3543,
                y : 252
            };
            var B = {
                x : 243,
                y : 53434
            };
            assert.deepEqual(RANDO.Utils.subdivide(2, A, B), [A,B]);

            done();
        });
        
        it("should return first, mid and end point.", function(done) {
            var A = {
                x : 0,
                y : 0
            };
            var B = {
                x : 2,
                y : 2
            };
            var M = {
                x : 1,
                y : 1
            };
            assert.deepEqual(RANDO.Utils.subdivide(3, A, B), [A,M,B]);

            done();
        });
        
        it("should return the four points equally spaced between A and B (A, B included).", function(done) {
            var A = {
                x : 0,
                y : 0
            };
            var M = {
                x : 1,
                y : 1
            };
            var N = {
                x : 2,
                y : 2
            };
            var B = {
                x : 3,
                y : 3
            };
            
            assert.deepEqual(RANDO.Utils.subdivide(4, A, B), [A,M,N,B]);

            done();
        });
        /*it("should return first, mid and end point.", function(done) {
            var A = {
                x : 0,
                y : 0
            };
            var B = {
                x : 2,
                y : 2
            };
            var M = {
                x : 1,
                y : 1
            };
            assert.deepEqual(RANDO.Utils.subdivide(3, A, B), [A,M,B]);

            done();
        });*/
        
        /*it("should have x value equal to 1.", function(done) {
            var A = [0,0];
            var B = [2,2];
            var n = 1;
            assert.equal(RANDO.Utils.subdivide(A, B, n).x, 1);
            done();
        });*/
    });
});
