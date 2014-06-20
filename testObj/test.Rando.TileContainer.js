var assert = chai.assert;

describe('Geotrek 3D - TileContainer Object', function() {
    var extent = {
        x: {
            max: 100,
            min: 50
        },
        y: {
            max: 100,
            min: 50
        },
        z: {
            max: 100,
            min: 20
        }
    };
    
    var altitudes = [
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [90, 73, 85, 98, 50],
        [100, 73, 85, 98, 80]
    ];
    var number_of_points = 5*7;

    var offsets = {
        x: -50,
        y: 30,
        z: -50
    };
    
    describe('Attributes', function() {
        it("_extent attribute should be equal to extent parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._extent, extent);
            done();
            tilC.dispose();
        });
        it("_altitudes attribute should be equal to altitudes parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._altitudes, altitudes);
            done();
            tilC.dispose();
        });
        it("_offsets attribute should be equal to offsets parameter.", function(done) {
            var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
            assert.deepEqual(tilC._offsets, offsets);
            done();
            tilC.dispose();
        });
    });
    
    describe('Methods', function() {
        describe('Tiles generation - this._generateTiles()', function () {
            it("should store all points (test the number of points).", function(done) {
                var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
                //~ tilC._generateTiles();

                var tiles = tilC._tiles;
                var count = 0;
                for (var it in tiles) {
                    var grid = tiles[it].grid;
                    for (var row in grid) {
                        for (var col in grid[row]) {
                            count++;
                        }
                    }
                }
                assert.equal(count, number_of_points);
                done();
                tilC.dispose();
            });
        });
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        //~ describe('translate - this.translate()', function () {
            //~ it("should translates all tiles grids of offsets attribute if no arguments.", function(done) {
                //~ var tilC = new RANDO.TileContainer(extent, altitudes, offsets);
                //~ var tiles_tr = _.clone(tilC._tiles);
                //~ for (var it in tiles_tr) {
                    //~ var grid = tiles_tr[it].grid;
                    //~ for (row in grid) {
                        //~ for (col in grid[row]) {
                            //~ grid[row][col].x += offsets.x;
                            //~ grid[row][col].y += offsets.y;
                            //~ grid[row][col].z += offsets.z;
                        //~ }
                    //~ }
                //~ }
                //~ 
                //~ tilC.translate();
                //~ 
                //~ assert.deepEqual(tilC._data, trek_data_tr);
                //~ done();
                //~ trek.dispose();
            //~ });
            
            
            //~ it("should translates of arguments values if arguments.", function(done) {
                //~ var trek = new RANDO.Trek(data, offsets, scene);
                //~ var trek_data_tr = _.clone(trek._data);
                //~ var dx = 10, dy = 5, dz = -5;
                //~ 
                //~ for (var it in trek_data_tr) {
                    //~ trek_data_tr[it].x += dx;
                    //~ trek_data_tr[it].y += dy;
                    //~ trek_data_tr[it].z += dz;
                //~ }
                //~ 
                //~ trek.translate(dx, dy, dz);
                //~ 
                //~ assert.deepEqual(trek._data, trek_data_tr);
                //~ done();
                //~ trek.dispose();
            //~ });
        //~ });
    
    
    });
});












//WIP

//~ describe('Subdivide grid in tiles - "subdivideGrid()"', function() {
            //~ var tiles = {};
            //~ var A = { x : -10, y : 20 };
            //~ var B = { x : 30, y : 30 };
            //~ var C = { x : 30, y : 0 };
            //~ var D = { x : 0, y : -10 };
            //~ var altitudes = [
                //~ [10, 10, 10, 10],
                //~ [10, 10, 10, 10],
                //~ [10, 10, 10, 10],
                //~ [10, 10, 10, 10],
                //~ [10, 10, 10, 10],
                //~ [10, 10, 10, 10]
            //~ ];
            //~ var grid_trapeze = RANDO.Utils.createElevationGrid(
                //~ A, B, C, D, 
                //~ altitudes
            //~ );
            //~ 
            //~ it("each grid of tiles array should have a number of columns stable ", function(done) {
                //~ RANDO.Utils.subdivideGrid(tiles, grid_trapeze, 18);
                //~ console.log(tiles);
                //~ 
                //~ for (it in tiles) {
                    //~ var grid = tiles[it].grid
                    //~ var res = grid[0].length;
                    //~ for (row in grid) {
                        //~ assert.equal(grid[row].length, res);
                    //~ }
                //~ }
//~ 
                //~ done();
            //~ });
        //~ });
