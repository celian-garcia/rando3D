var assert = chai.assert;

describe('Rando3D', function() {
    
    describe('Segment subdivision', function() {

        it("should return null point.", function(done) {
            var A = { x : 3543, y : 252 };
            var B = { x : 243,  y : 53434 };
            
            assert.deepEqual(RANDO.Utils.subdivide( 0, A, B), null);
            assert.deepEqual(RANDO.Utils.subdivide(-1, A, B), null);
            done();
        });
        
        
        it("should return first point.", function(done) {
            var A = { x : 3543, y : 252 };
            var B = { x : 243,  y : 53434 };
            
            assert.equal(RANDO.Utils.subdivide(1, A, B), A);
            done();
        });
        
        it("should return both points.", function(done) {
            var A = { x : 3543, y : 252 };
            var B = { x : 243,  y : 53434 };
            
            assert.deepEqual(RANDO.Utils.subdivide(2, A, B), [A,B]);

            done();
        });
        
        it("should return first, mid and end point.", function(done) {
            var A = { x : 0, y : 0 };
            var B = { x : 2, y : 2 };
            var M = { x : 1, y : 1 };
               
            assert.deepEqual(RANDO.Utils.subdivide(3, A, B), [A,M,B]);

            done();
        });
        
        it("should return the four points equally spaced between A and B (A, B included).", function(done) {
            var A = { x : 0, y : 0 };
            var M = { x : 1, y : 1 };
            var N = { x : 2, y : 2 };
            var B = { x : 3, y : 3 };
                
            assert.deepEqual(RANDO.Utils.subdivide(4, A, B), [A,M,N,B]);

            done();
        });
        
    });
    describe('Trapeze grid', function() {
        it("should return null point", function(done) {
            var A = { x : 54,  y : 545 };
            var B = { x : 325, y : 245 };
            var C = { x : 24,  y : 42  };
            var D = { x : 525, y : 245 };
                
            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D, 0, 54), null);
            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D, 45, 0), null);
            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D,  0, 0), null);
            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D, -5,45), null);
            
            done();
        });
    });
});
