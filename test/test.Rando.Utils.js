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
        
        it("should return 3 points aligned with the straight x = 2.", function(done) {
            var A = { x : 2, y : 0 };
            var B = { x : 2, y : 2 };
            var M = { x : 2, y : 1 };
               
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
        
        it("should return a grid available with a square input", function(done) {
            var A = { x : 0, y : 0 };
            var B = { x : 2, y : 0 };
            var C = { x : 2, y : 2 };
            var D = { x : 0, y : 2 };
            
            var res = [
                [ A, { x : 1, y : 0 }, B ],
                [ { x : 0, y : 1 }, { x : 1, y : 1 },{ x : 2, y : 1 } ],
                [D, { x : 1, y : 2 }, C]
            ];

            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D, 3, 3), res);
            
            done();
        });
        
        it("should return a grid available with a losange input", function(done) {
            var A = { x :-2, y : 0 };
            var B = { x : 0, y : 2 };
            var C = { x : 2, y : 0 };
            var D = { x : 0, y :-2 };
            
            var res = [
                [A, { x :-1, y : 1 },B],
                [{ x :-1, y :-1 }, { x : 0, y : 0 }, { x : 1, y : 1 }],
                [D, { x : 1, y :-1 }, C]
            ];

            assert.deepEqual(RANDO.Utils.createGrid(A, B, C, D, 3, 3), res);
            
            done();
        });
    });
    
    describe('Rotations and angles', function() {
        describe('Around X axis', function() {
            it("should return 0.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(0,10,0);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                
                var A = new BABYLON.Vector3(0,10,10);
                var B = new BABYLON.Vector3(0,10,10);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                done();
            });
            
            it("should return 3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(0,-10,10);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 3*Math.PI/4, 0.0001);
                done();
            });
            
            it("should return -3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(0,-10,-10);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), -3*Math.PI/4, 0.0001);
                done();
            });
        });
        
        describe('Around Y axis', function() {
            it("should return 0.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(0,0,10);
                var axis = BABYLON.Axis.Y;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                
                var A = new BABYLON.Vector3(10,0,10);
                var B = new BABYLON.Vector3(10,0,10);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                done();
            });
            
            it("should return 3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(10,0,-10);
                var axis = BABYLON.Axis.Y;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 3*Math.PI/4, 0.0001);
                done();
            });
            
            it("should return -3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(-10,0,-10);
                var axis = BABYLON.Axis.Y;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), -3*Math.PI/4, 0.0001);
                done();
            });
        });
        
        describe('Around Z axis', function() {
            it("should return 0.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(10,0,0);
                var axis = BABYLON.Axis.Z;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                
                var A = new BABYLON.Vector3(10,10,0);
                var B = new BABYLON.Vector3(10,10,0);
                var axis = BABYLON.Axis.X;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 0, 0.0001);
                done();
            });
            
            it("should return 3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(-10,10,0);
                var axis = BABYLON.Axis.Z;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), 3*Math.PI/4, 0.0001);
                done();
            });
            
            it("should return -3*PI/4.", function(done) {
                var A = new BABYLON.Vector3(0,0,0);
                var B = new BABYLON.Vector3(-10,-10,0);
                var axis = BABYLON.Axis.Z;
                assert.closeTo(RANDO.Utils.angleFromAxis(A, B, axis), -3*Math.PI/4, 0.0001);
                done();
            });
        });
    });
    
    describe('Translations', function() {
        describe('DEM', function() {
            // Initialization of the DEM
            var extent = {
                northwest : {x:  5, y: -5},
                northeast : {x:  5, y:  5},
                southeast : {x: -5, y:  5},
                southwest : {x: -5, y: -5},
                altitudes : {max: 10, min: 0 }
            };
            var vertices = [
                -5, 4, -5,
                 0, 4, -5,
                 5, 6, -5,
                -5, 8,  0,
                 0, 2,  0,
                 5, 5,  0,
                -5, 4,  5,
                 0, 8,  5,
                 5, 9,  5
            ];
            var center = {
                x: 0,
                y: 0,
                z: 0
            };
            var dem = {
                "extent"    : extent,
                "vertices"  : vertices,
                "center"    : center,
                "toto"      : "toto"
            };///-----------------------
            
            // Translation of 10 
            RANDO.Utils.translateDEM(dem, 10, 10, 10);
            
            it("should translate the DEM extent  ", function(done) {
                var translated_extent = {
                    northwest : {x: 15, y:  5},
                    northeast : {x: 15, y: 15},
                    southeast : {x:  5, y: 15},
                    southwest : {x:  5, y:  5},
                    altitudes : {max: 20, min: 10 }
                };
                
                assert.deepEqual(dem.extent, translated_extent);
                done();
            });
            
            it("should translate the DEM center  ", function(done) {
                var translated_center = {
                    x: 10,
                    y: 10,
                    z: 10
                };
                assert.deepEqual(dem.center, translated_center);
                done();
            });
            
            it("should translate the DEM vertices  ", function(done) {
                var translated_vertices = [
                     5, 14,  5,
                    10, 14,  5,
                    15, 16,  5,
                     5, 18, 10,
                    10, 12, 10,
                    15, 15, 10,
                     5, 14, 15,
                    10, 18, 15,
                    15, 19, 15
                ];
                assert.deepEqual(dem.vertices, translated_vertices);
                done();
            });
        });
        
        describe('Route', function() {
            it("should translate the Route vertices  ", function(done) {
                var vertices = [{
                    x: 0,
                    y: 0, 
                    z: 0
                },
                {
                    x: 5,
                    y: 5, 
                    z: 5
                },
                {
                    x: 10,
                    y: 10, 
                    z: 10
                }];
                var tr_vertices = [{
                    x: 5,
                    y: 10, 
                    z: 15
                },
                {
                    x: 10,
                    y: 15, 
                    z: 20
                },
                {
                    x: 15,
                    y: 20, 
                    z: 25
                }];
                RANDO.Utils.translateRoute(vertices, 5, 10, 15);
                assert.deepEqual(vertices, tr_vertices);
                done();
            });
        });
    });
    
    describe('Conversion', function() {
        describe('latitude/longitude to meters x/y', function() {
            it("should return {x: 0 ,y: 0} .", function(done) {
                var latlng = {
                    'lat': 0,
                    'lng': 0,
                    'toto': "toto"
                };
                assert.deepEqual(RANDO.Utils.toMeters(latlng), {x: 0, y: 0});
                done();
            });
            
            it("should return good x value for null latitude", function(done) {
                var latlng = {
                    'lat': 0,
                    'lng': 90,
                    'toto': "toto"
                };
                assert.closeTo(RANDO.Utils.toMeters(latlng).x, 90* 111319.458, 100);
                done();
            });
        });
    });
});
