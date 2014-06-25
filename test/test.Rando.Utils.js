var assert = chai.assert;

describe('Rando3D Utilitaries', function() {
    describe("BABYLON Extents", function() {
        
    });
    
    describe("Geometry ", function() {
        describe('Rotation and Angles', function() {
            describe('Around X axis - "angleFromAxis()"', function() {
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
            
            describe('Around Y axis - "angleFromAxis()"', function() {
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
            
            describe('Around Z axis - "angleFromAxis()"', function() {
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
        
        describe('Segment subdivision - "subdivide()"', function() {
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
    
        describe('Middle between two points - "middle()"', function () {
            var A = {
                x: 0,
                y: 0,
                z: 0
            };
            var B = {
                x: 10,
                y: 10,
                z: 10
            };
            var mid = {
                x: 5,
                y: 5,
                z: 5
            };
            it("should return {x: 5, y: 5, z: 5}", function(done) {
                assert.deepEqual(RANDO.Utils.middle(A, B), mid);
                done();
            });
        });
        
        describe('Trapeze grid - "createFlatGrid()"', function() {
            it("should return null point", function(done) {
                var A = { x : 54,  y : 545 };
                var B = { x : 325, y : 245 };
                var C = { x : 24,  y : 42  };
                var D = { x : 525, y : 245 };
                    
                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D, 0, 54), null);
                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D, 45, 0), null);
                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D,  0, 0), null);
                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D, -5,45), null);
                
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

                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D, 3, 3), res);
                
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

                assert.deepEqual(RANDO.Utils.createFlatGrid(A, B, C, D, 3, 3), res);
                
                done();
            });
        });
    
        describe('Scale a 2-dimensions Array - scaleArray2()', function () {
            var array2 = [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1]
            ];
            
            var result = [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2]
            ];
            
            it("should return the same array", function(done) {
                assert.deepEqual(RANDO.Utils.scaleArray2(array2, 1), array2);
                done();
            });
            
            it("should return an array of 2", function(done) {
                assert.deepEqual(RANDO.Utils.scaleArray2(array2, 2), result);
                done();
            });
        });
    });
  
    describe("Getters", function() {
        describe('Get an url of texture from coordinates z, x, y - "replaceUrlCoordinates()"', function () {
            it("should return the new url with '{z}', '{x}' and '{y}' replaced  ", function(done) {
                var url = "blablabla{z}blabla{y}blabla{x}";
                var z = 12
                var x = 135;
                var y = 45;
                var result = "blablabla12blabla45blabla135"
                assert.equal(RANDO.Utils.replaceUrlCoordinates(url, z, x, y), result);
                done();
            });
        });

    describe('Conversions', function() {
        describe('latitude/longitude to meters x/y - "toMeters()"', function () {
            it("should return {x: 0 ,y: 0} .", function(done) {
                var latlng = {
                    'lat': 0,
                    'lng': 0,
                };
                assert.deepEqual(RANDO.Utils.toMeters(latlng), {x: 0, y: 0});
                done();
            });
            
            it("should return a result close to {x: 5009377 ,y: 5621521} .", function(done) {
                var latlng = {
                    'lat': 45,
                    'lng': 45,
                };
                var meters = {
                    'x': 5009377,
                    'y': 5621521
                };
                assert.closeTo(RANDO.Utils.toMeters(latlng).x, meters.x, 10);
                assert.closeTo(RANDO.Utils.toMeters(latlng).y, meters.y, 10);
                done();
            });
        });
        
        describe('meters x/y to latitude/longitude - "toLatlng()"', function () {
            it("should return {lat: 0 ,lng: 0} .", function(done) {
                var meters = {
                    'x': 0,
                    'y': 0,
                };
                assert.deepEqual(RANDO.Utils.toLatlng(meters), {lat: 0, lng: 0});
                done();
            });
            
            it("should return a result close to {lat: 45 ,y: 45} .", function(done) {
                var latlng = {
                    'lat': 45,
                    'lng': 45,
                };
                var meters = {
                    'x': 5009377,
                    'y': 5621521
                };
                assert.closeTo(RANDO.Utils.toLatlng(meters).lat, latlng.lat, 0.0001);
                assert.closeTo(RANDO.Utils.toLatlng(meters).lng, latlng.lng, 0.0001);
                done();
            });
        });
    });
    
    describe("Translations ", function() {
    });

});
