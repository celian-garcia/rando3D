// Rando.Utils.js 
// Rando utilities

var RANDO = RANDO || {};
RANDO.Utils = {};


/****    BABYLON extents     ************************/
/**
 *  createGroundFromExtent(): Create a ground from an extent of 4 points 
 *      - name : Name of the new Ground
 *      - A : northwest vertex
 *      - B : northeast vertex
 *      - C : southeast vertex
 *      - D : southwest vertex
 *      - w_subdivisions : Number of Width's subdivisions in the new Ground 
 *      - h_subdivisions : Number of Height's subdivisions in the new Ground
 *      - scene : Scene which contains the new Ground 
 *      - updatable : 
 * 
 ****************************************************************/
RANDO.Utils.createGroundFromExtent = function (name, A, B, C, D, w_subdivisions, h_subdivisions, scene, updatable) {
    var ground = new BABYLON.Mesh(name, scene);

    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    
    var grid = RANDO.Utils.createGrid(A, B, C, D, w_subdivisions+ 1, h_subdivisions+ 1);
    for (row = 0; row <= h_subdivisions; row++) {
        for (col = 0; col <= w_subdivisions; col++) {
            var position = grid[row][col];
            var normal = new BABYLON.Vector3(0, 1.0, 0);
            
            positions.push(position.x, 0, position.y);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / w_subdivisions, 1.0 - row / h_subdivisions);
        }
    }

    for (row = 0; row < h_subdivisions; row++) {
        for (col = 0; col < w_subdivisions; col++) {
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + row * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));

            indices.push(col + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
        }
    }
    
    ground.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
    ground.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
    ground.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
    ground.setIndices(indices);

    return ground;
};

/**
 *  createGroundFromGrid(): Create a ground from a grid of 2D points
 *      - name : Name of the new Ground
 *      - grid : grid of 2d points (each point contains a x and a y)
 *      - scene : Scene which contains the new Ground 
 *      - updatable : 
 * 
 ****************************************************************/
RANDO.Utils.createGroundFromGrid = function (name, grid, scene, updatable) {
    var ground = new BABYLON.Mesh(name, scene);

    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    
    var h_subdivisions = grid.length-1;
    var w_subdivisions = grid[0].length-1;
    
    for (row = 0; row <= h_subdivisions; row++) {
        w_subdivisions = grid[row].length-1;
        for (col = 0; col <= w_subdivisions; col++) {
            var position = grid[h_subdivisions - row][col];
            var normal = new BABYLON.Vector3(0, 1.0, 0);
            
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / w_subdivisions, 1.0 - row / h_subdivisions);
        }
    }

    for (row = 0; row < h_subdivisions; row++) {
        w_subdivisions = grid[row].length-1;
        for (col = 0; col < w_subdivisions; col++) {
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + row * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));

            indices.push(col + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
        }
    }
    
    ground.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
    ground.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
    ground.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
    ground.setIndices(indices);

    return ground;
};

/**
 *  createGroundFromVertices(): Create a ground from an array of vertices
 *      - name : Name of the new Ground
 *      - vertices : Array of vertices in BABYLON.VertexBuffer.PositionKind format 
 *      - w_subdivisions : Number of Width's subdivisions in the new Ground 
 *      - h_subdivisions : Number of Height's subdivisions in the new Ground
 *      - scene : Scene which contains the new Ground 
 *      - updatable : 
 * 
 ****************************************************************/
RANDO.Utils.createGroundFromVertices = function( name, vertices, w_subdivisions, h_subdivisions, scene, updatable) {
    console.assert(vertices.length%3 == 0);
    console.assert((vertices.length/3) == w_subdivisions*h_subdivisions,
    (vertices.length/3) + "!=" + w_subdivisions + "*" + h_subdivisions);
    
    var ground = new BABYLON.Mesh(name, scene);

    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    
    var i = 0;
    for (row = 0; row <= h_subdivisions; row++) {
        for (col = 0; col <= w_subdivisions; col++) {
            var normal = new BABYLON.Vector3(0, 1.0, 0);
            
            positions.push(vertices[i], vertices[i+1], vertices[i+2]);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / w_subdivisions, 1.0 - row / h_subdivisions);
            i+=3;
        }
    }

    for (row = 0; row < h_subdivisions; row++) {
        for (col = 0; col < w_subdivisions; col++) {
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + row * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));

            indices.push(col + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
        }
    }
    
    ground.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
    ground.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
    ground.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
    ground.setIndices(indices);

    return ground;
};

/**
 *  createSideFromLine(): Create a side of the DEM from a line of points (top line)
 *      - name : Name of the new Ground
 *      - line : Array of points [{x: ,y: ,z: }, ...]
 *      - base : Altitude of the base line
 *      - scene : Scene which contains the new side
 *      - updatable : 
 * 
 */
RANDO.Utils.createSideFromLine = function (name, line, base, scene, updatable) {
    var side = new BABYLON.Mesh(name, scene);

    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
    
    var h_subdivisions = 1
    var w_subdivisions = line.length-1;
    
    // Positions, normals, and uvs
    for (row = 0; row <= h_subdivisions; row++) {
        for (col = 0; col <= w_subdivisions; col++) {
            var position = line[col];
            var normal = new BABYLON.Vector3(0, 1.0, 0);
            
            if (row == 0) {
                positions.push(position.x, position.y, position.z);
            } else {
                positions.push(position.x, base, position.z);
            }
            
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / w_subdivisions, 1.0 - row/1);
        }
    }

    // Indices
    for (row = 0; row < h_subdivisions; row++) {
        for (col = 0; col < w_subdivisions; col++) {
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + row * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));

            indices.push(col + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
        }
    }
    
    side.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
    side.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
    side.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
    side.setIndices(indices);

    return side;
}

/**
* processLargeArray(): Common utility to process large arrays
*
*       - array : large array
*       - callback : function that will be called with (array, index)
*/
RANDO.Utils.processLargeArray = function (array, callback) {
    // set this to whatever number of items you can process at once
    var chunk = 10;
    var index = 0;
    function doChunk() {
        var cnt = chunk;
        while (cnt-- && index < array.length-1) {
            callback(array, index);
            ++index;
        }
        if (index < array.length-1) {
            setTimeout(doChunk, 5);
        }
    }
    doChunk();
}

/**
 *  placeCylinder()
 *      - cylinder (BABYLON.Mesh): BABYLON Cylinder object
 *      - A (BABYLON.Vector3):     First Point 
 *      - B (BABYLON.Vector3):     Second Point
 * 
 * Place the cylinder between both points  
 ****************************************************************/
RANDO.Utils.placeCylinder = function (cylinder, A, B) {
    // Initial position at the center of the AB vector
    cylinder.position = new BABYLON.Vector3(
        (A.x+B.x)/2,
        (A.y+B.y)/2,
        (A.z+B.z)/2
    );

    // Adjust scale of cylinder
    var new_height = BABYLON.Vector3.Distance(A, B);
    var scale_y  = (cylinder.scaling.y * new_height) / cylinder.height;
    cylinder.scaling.y = scale_y;
    
    // First rotation
    var angle1 = RANDO.Utils.angleFromAxis(A, B, BABYLON.Axis.X);
    cylinder.rotate(
        BABYLON.Axis.X, 
        angle1,
        BABYLON.Space.LOCAL
    );
    
    // Second rotation
    var H = new BABYLON.Vector3(A.x,B.y,B.z);
    var angle2 = RANDO.Utils.angleFromPoints(A, B, H);
    cylinder.rotate(
        BABYLON.Axis.Z, 
        angle2, 
        BABYLON.Space.LOCAL
    );
    
    return cylinder;
}

/**
 * ComputeMeshNormals() : recompute normals of a mesh (for the shadows after)
 *      - mesh: mesh to recompute
 */
RANDO.Utils.computeMeshNormals = function (mesh) {
    var vertices = BABYLON.VertexData.ExtractFromMesh (mesh);
    BABYLON.VertexData.ComputeNormals(vertices.positions, vertices.indices, vertices.normals);
    vertices.applyToMesh(mesh);
};

/**
 * setMeshUvs() : set the mesh uvs taking from the object uv taken in parameter
 *      mesh: babylon mesh 
 *      uvs: object js containing uvs values
 * 
 * NB: format of uv object parameter : 
 *      uv = {
 *          u: [],
 *          v: []
 *      }
 */
RANDO.Utils.setMeshUvs = function (mesh, uv) {
    var uv_array = [];
    for (row in uv.v) {
        for (col in uv.u) {
            uv_array.push(uv.u[col]);
            uv_array.push(uv.v[row]);
        }
    }
    
    var vertices = BABYLON.VertexData.ExtractFromMesh (mesh);
    
    console.assert(
        vertices.uvs.length == uv_array.length, 
        "setMeshUvs() : uvs in parameter are not well sized"
    );
    vertices.uvs = uv_array;
    vertices.applyToMesh(mesh);
};


/****    GEOMETRY     ************************/
/**tested
 * middle(): 
 *      A: first point
 *      B: second point
 * 
 * return the middle of the segment form by A and B
 */
RANDO.Utils.middle = function (A, B) {
    return {
        x: (A.x+B.x)/2,
        y: (A.y+B.y)/2,
        z: (A.z+B.z)/2
    };
};

/**tested
 * subdivide() :  interpolate a segment between 2 points A and B 
 *      - n : number of points expected in result
 *      - A : first point 
 *      - B : second point
 * 
 * return an array of point 
 * 
 * NB : points are in the format : { x : .. , y : .. } 
 * 
 * 
 * example :
 * 
 *         * B                   * B
 *        /                     /
 *       /      n = 4          * M2
 *      /      ---->          /
 *     /                     * M1
 *    /                     /
 * A *                    A* 
 * 
 *          result : [A, M1, M2, B]
 * 
 */
RANDO.Utils.subdivide = function (n, A, B) {
    
    if (n<=0) return null;
    
    if (n==1) return A;

    if (n==2) return [A,B];
    
    if (n>=3) {
        var dx = (B.x-A.x)/(n-1);
        var dy = (B.y-A.y)/(n-1);
        
        var x = A.x;
        var y = A.y;
        
        var res = [];
        res.push(A);
        for (var i=0; i<n-2; i++){
            x += dx;
            y += dy;
            res.push({
                'x' : x,
                'y' : y 
            });
        }
        res.push(B);
        return res;
    } 
}

/**tested
 * createGrid() : create a grid of points for all type of quadrilateres, in particular
 *  these which are not square or rectangle.
 *      - A, B, C, D :  vertices of quadrilatere to subdivide
 *      - n_verti :     number of points in vertical size
 *      - n_horiz :     number of points in horizontal size
 * 
 * 
 * NB : * n_verti and n_horiz cannot be invert
 *      * the order of input points is also important, it determines 
 * the order of output points : 
 *  [A, ...., B,    -> first line
 *   ..........,
 *   D, ...., C]    -> last line
 * 
 * 
 * Example of quadrilatere :
 * A *------------------* B
 *   |                   \
 *   |                    \
 *   |                     \
 *   |                      \
 *   |                       \
 *   |                        \
 * D *-------------------------* C
 * 
 */
RANDO.Utils.createFlatGrid = function (A, B, C, D, n_horiz, n_verti) {
    if(n_verti<=0) return null;
    if(n_horiz<=0) return null;

    // subdivide both sides of the quad
    var west_side = RANDO.Utils.subdivide(n_verti, A, D);
    var east_side = RANDO.Utils.subdivide(n_verti, B, C);
    var grid = [];
    console.assert(west_side.length == east_side.length, 
        "createGrid : west_side.length != east_side.length \n" +
        west_side.length + 
        " != " + 
        east_side.length 
    );
    
    
    for (var j=0; j < n_verti; j++){
        // subidivide lines
        var line = RANDO.Utils.subdivide(n_horiz, west_side[j], east_side[j]);
        grid.push(line);
    }
    return grid;
}

/**
 *
 * 
 */
RANDO.Utils.createElevationGrid = function (A, B, C, D, altitudes) {
    // Creates grid from extent datas
    var grid = RANDO.Utils.createFlatGrid(
        A, B, C, D,
        altitudes[0].length,
        altitudes.length
    );
    
    // Gives altitudes to the grid 
    for (row in altitudes){
        for (col in altitudes[row]){
            grid[row][col].z = grid[row][col].y;
            grid[row][col].y = altitudes[row][col];
        }
    }
    return grid;
}

/**tested
 * angleFromAxis(): get an angle for a rotation 
 *      - A     (BABYLON.Vector3) : First point 
 *      - B     (BABYLON.Vector3) : Second point
 *      - axis  (BABYLON.Vector3) : Axis of rotation
 * 
 * 
 * Example with a rotation around y axis 
 * 
 *                     _ z
 *       .->           | 
 *      /              |     * B
 *                     |    / 
 *                     |   /
 *                     |  /
 *                     | /
 *                     |/               x
 *       --------------*--------------->
 *                     |A 
 *                     | 
 *
 * NB : It uses global axis only 
 *  (1, 0, 0), (0, 1, 0), or (0, 0, 1)
 *
 */
RANDO.Utils.angleFromAxis = function (A, B, axis) {
    var angle, AH, AB;
    switch (axis){
        case BABYLON.Axis.X :
            if(A.y == B.y && A.z == B.z) // It don't need rotation around X
                return 0;
            AH = B.y-A.y;
            AB = Math.sqrt(
                Math.pow(B.y-A.y, 2)+
                Math.pow(B.z-A.z, 2)
            );
            angle = Math.acos(AH/AB);
            if (B.z < A.z)
                return -angle;
            return angle;
        break;
        case BABYLON.Axis.Y :
            if(A.x == B.x && A.z == B.z) // It don't need rotation around Y
                return 0;
            AH = B.z-A.z;
            AB = Math.sqrt(
                Math.pow(B.z-A.z, 2)+
                Math.pow(B.x-A.x, 2)
            );
            
            angle = Math.acos(AH/AB);
            //if (angle > Math.PI/2)
                //angle = -((Math.PI/2)-angle)
            if (B.x < A.x)
                return -angle;
            return angle;
        break;
        case BABYLON.Axis.Z :
            if(A.x == B.x && A.y == B.y) // It don't need rotation around Z
                    return 0;
            AH = B.x-A.x;
            AB = Math.sqrt(
                Math.pow(B.x-A.x, 2)+
                Math.pow(B.y-A.y, 2)
            );
            angle = Math.acos(AH/AB);
            if (B.y < A.y)
                return -angle;
            return angle;
    }
    return null;
}

/**
 * angleFromPoints() : get an angle from 3 points for a rotation around an axis 
 *  orthogonal of the plan formed by the 3 points 
 *      - A (BABYLON.Vector3) : First point
 *      - B (BABYLON.Vector3) : Second point
 *      - H (BABYLON.Vector3) : Orthogonal projection of B over the axis 
 * 
 * 
 * Example with a rotation around z axis 
 * 
 *                     _ x
 *       .->           | 
 *      /            H *     * B
 *                     |    / 
 *                     |   /
 *                     |  /
 *                     | /
 *                     |/               y
 *       --------------*--------------->
 *                     |A 
 *                     | 
 *
 * NB : It is used when we don't have especially classical global axis. For example
 * after a first rotation.
 * 
 */
RANDO.Utils.angleFromPoints = function (A, B, H) {
    var AH = BABYLON.Vector3.Distance(A, H);
    var AB = BABYLON.Vector3.Distance(A, B);
    var angle = Math.acos(AH/AB);
    
    // Check the sign 
    if (H.x < B.x) 
        return -angle;
    return angle;
}



/****    CAMERA     ************************/
/**
 * moveCameraTo() : move a camera at the position given, and make it look at the 
 *  target given. 
 *      - camera    : camera 
 *      - position  : future position 
 *      - target    : future target
 *      - callback  : callback to call at the end of move
 * 
 */
RANDO.Utils.moveCameraTo = function (camera, position, target, callback) {
    var rotation_y = RANDO.Utils.angleFromAxis(position, target, BABYLON.Axis.Y);
    
    // Translation
    TweenLite.to(camera.position, 2, { 
        x: position.x, 
        y: position.y + RANDO.SETTINGS.CAM_OFFSET,
        z: position.z,
        ease: 'ease-in',
        onComplete : function (){
            if (typeof(callback) === "function") callback();
        }
    });
    // Rotation
    TweenLite.to(camera.rotation, 2, { 
        x: 0,
        y: rotation_y, 
        z: 0,
        ease: 'ease-in',
        onComplete : function (){
            if (typeof(callback) === "function") callback();
        }
    });
}

/**
 * addKeyToCamera() : add a new position key and rotation key to the camera timeline
 *      - timeline: timeline of the camera (TimelineLite)
 *      - camera: camera 
 *      - position: position wanted for the camera
 *      - target: target wanted (necessary to determine the rotation to apply)
 *      - angles: array of all angles of rotation (it is filled in each instance of this function) 
 */
RANDO.Utils.addKeyToCamera = function (timeline, camera, position, target, angles) {
    var speed = 2- (RANDO.SETTINGS.CAM_SPEED_T)+0.1;
    
    var alpha1,
        alpha2 = RANDO.Utils.angleFromAxis(position, target,BABYLON.Axis.Y);
    
    if(angles){
        alpha1 = angles[angles.length-2];
        if(alpha1*alpha2<0 && Math.abs(alpha1) > Math.PI/2 && Math.abs(alpha2) > Math.PI/2){
            alpha2 = (2*Math.PI - Math.abs(alpha2));
        }
    }
    
    timeline.add([
        TweenLite.to(camera.position, speed, {
            x: position.x, 
            y: position.y + RANDO.SETTINGS.CAM_OFFSET, 
            z: position.z, 
            ease: "Linear.easeNone"  
        }), 
        TweenLite.to(camera.rotation, speed, {
            y: alpha2,
            ease: "Power1.easeInOut"  
        })]
    );
    
    angles.push(alpha2);
}

/**
 *  animateCamera() : animation and controls of the camera 
 *      - vertices : array of vertices
 *      - scene : the current scene
 * 
 * */
RANDO.Utils.animateCamera = function (vertices, scene) {
    var d = 10, // Number of points between the current point and the point watched
        b_foll = {"value": false},
        b_pause = true,
        timeline = new TimelineLite(),
        angles = [];

    // Filling of the timeline "tl_foll"
    for (var i=d; i< vertices.length-d; i+=d){
        RANDO.Utils.addKeyToCamera(timeline, scene.activeCamera, vertices[i], vertices[i+d], angles);
    }
    
    RANDO.Utils.addKeyToCamera(timeline, scene.activeCamera, vertices[i], vertices[vertices.length-1], angles);
    
    // Animation paused by default
    timeline.pause(0);
    
    // Controls
    var state = "flying";
    $(document).keyup(function(e){
        var keyCode = e.keyCode;

        // Space
        if (keyCode == 32){
            if (state == "start" || state == "pause") {
                state = "moving";
                timeline.play();
            }
            else if (state == "moving") {
                state = "pause";
                timeline.pause();
            }
        }

        // Enter
        if (keyCode == 13){
            if (state == "flying"){
                RANDO.Utils.moveCameraTo(scene.activeCamera, vertices[0], vertices[d], function(){
                    state = "start";
                });
            }
            else if ( state == "pause" || state == "moving" || state == "end" ){
                timeline.pause(0);
                state = "start";
            }
        }
    });
}

/**
 * refreshPanels() : refresh pivot matrices of all panels to always have panels 
 *  directed to the camera.
 *      - number (int)          : number of panels in the scene 
 *      - scene (BABYLON.Scene) : current scene
 */
RANDO.Utils.refreshPanels = function (number, scene) {
    var A = scene.activeCamera.position;
    for (var i = 1; i < number; i++){
        var panel = scene.getMeshByName("Panel" +i);
        if (!panel) return null;
        var B = panel.position;
        var angle = RANDO.Utils.angleFromAxis(A, B, BABYLON.Axis.Y);
        var matrix = BABYLON.Matrix.RotationY(angle);
        panel.setPivotMatrix(matrix);
    }
    return 1;
}


/****    GETTERS     ************************/
/**tested
 * getUrlFromCoordinates(): get the url of a tile texture 
 *      z : level of zoom
 *      x : x coordinates of tile
 *      y : y coordinates of tile
 * 
 */
RANDO.Utils.replaceUrlCoordinates = function (url, z, x, y) {
    url = url.replace("{z}", z);
    url = url.replace("{x}", x);
    url = url.replace("{y}", y);

    return url;
}

/**
 * getFrameFromTiles() : get borders of the DEM from the list of DEM tiles 
 *      - tiles: tiles of the DEM
 */
RANDO.Utils.getFrameFromTiles = function (tiles) {
    var frame = {};
    frame.east  = [];
    frame.west  = [];
    frame.north = [];
    frame.south = [];

    var extent = RANDO.Utils.getTileExtent(tiles);

    for (it in tiles) {
        var tile = tiles[it];
        if ( tile.coordinates.x == extent.x.max ) {
            var last_col = tile.grid[0].length -1;
            for (row in tile.grid) {
                frame.east.push(tile.grid[row][last_col]);
            }
        }
        if ( tile.coordinates.x == extent.x.min ) {
            var first_col = 0;
            for (row in tile.grid) {
                frame.west.push(tile.grid[row][first_col]);
            }
        }
        if ( tile.coordinates.y == extent.y.min ) {
            var last_row = tile.grid.length-1;
            for (col in tile.grid[last_row]){
                frame.south.push(tile.grid[last_row][col]);
            }
        }
        if ( tile.coordinates.y == extent.y.max ) {
            var first_row = 0;
            for (col in tile.grid[first_row]){
                frame.north.push(tile.grid[first_row][col]);
            }
        }
    }

    return frame;
};

/**tested
 * getTileExtent() : get tile extent from the list of DEM tiles
 *      - tiles: tiles of the DEM
 */
RANDO.Utils.getTileExtent = function (tiles) {
    var tileExtent = {};
    tileExtent.x = {};
    tileExtent.y = {};
    
    // X extent
    tileExtent.x.min = _.min(tiles, function (tile) { 
        return tile.coordinates.x; 
    }).coordinates.x;
    
    tileExtent.x.max = _.max(tiles, function (tile) { 
        return tile.coordinates.x; 
    }).coordinates.x;

    // Y extent
    tileExtent.y.min = _.min(tiles, function (tile) { 
        return tile.coordinates.y; 
    }).coordinates.y;
    tileExtent.y.max = _.max(tiles, function (tile) { 
        return tile.coordinates.y; 
    }).coordinates.y;
    
    return tileExtent;
};


/****    CONVERSIONS     ************************/
/**tested
 * toMeters() : convert a point in latitude/longitude to x/y meters coordinates
 *      - latlng : point in lat/lng 
 * 
 * return a point in meters 
 * 
 * { lat : .. , lng : .. }  ---> { x : .. , y : .. }
 */
RANDO.Utils.toMeters = function (latlng) {

    var R = 6378137;

    var d = Math.PI / 180;
    var max = 1 - 1*Math.pow(10, -15);
    var sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);

    return {
        x : R * latlng.lng * d,
        y : R * Math.log((1 + sin) / (1 - sin)) / 2
    };
};

/**tested
 * toLatlng() : convert a point in x/y meters coordinates to latitude/longitude 
 *      - point : point in x/y meters coordinates
 * 
 * return a point in lat/long 
 * 
 * { x : .. , y : .. }  --->  { lat : .. , lng : .. }  
 */
RANDO.Utils.toLatlng = function (point) {
    
    var R = 6378137;
    
    var d = 180 / Math.PI;

    return {
        lat: (2 * Math.atan(Math.exp(point.y / R)) - (Math.PI / 2)) * d,
        lng: point.x * d / R
    };
}

/**
 * extent2meters() : convert the four corners of the DEM in meters 
 *      - extent : extent of the DEM in latitudes/longitudes
 */
RANDO.Utils.extent2meters = function (extent) {
    return {
        'northwest' : RANDO.Utils.toMeters(extent.northwest),
        'northeast' : RANDO.Utils.toMeters(extent.northeast),
        'southeast' : RANDO.Utils.toMeters(extent.southeast),
        'southwest' : RANDO.Utils.toMeters(extent.southwest),
        'altitudes' : extent.altitudes
    };
};

/**
 * meters2num(): get the tile number of the tile containing a point 
 *  in a certain level of zoom
 *      - x: x coordinate of point (in meters)
 *      - y: y coordinate of point (in meters)
 *      - zoom: zoom level
 */
RANDO.Utils.meters2num = function (x, y, zoom) {
    var tmp_ll = RANDO.Utils.toLatlng({
        'x': x,
        'y': y
    });
    return RANDO.Utils.deg2num(tmp_ll.lat, tmp_ll.lng, zoom);
};

/**
 * deg2num(): get the tile number of the tile containing a point 
 *  in a certain level of zoom
 *      - lat_deg: latitude  coordinate of point (in degrees)
 *      - lng_deg: longitude coordinate of point (in degrees)
 *      - zoom: zoom level
 */
RANDO.Utils.deg2num = function (lat_deg, lng_deg, zoom) {
    var lat_rad = lat_deg*Math.PI/180;
    var n = Math.pow(2.0, zoom);
    var xtile = Math.floor((lng_deg + 180.0) / 360.0 * n);
    var ytile = Math.floor((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n);
    return {
        "xtile": xtile, 
        "ytile": ytile
    };
};

/**
 * rad2num(): get the tile number of the tile containing a point 
 *  in a certain level of zoom
 *      - lat_rad: latitude  coordinate of point (in radians)
 *      - lng_rad: longitude coordinate of point (in radians)
 *      - zoom: zoom level
 */
RANDO.Utils.rad2num = function (lat_rad, lng_rad, zoom) {
    var lat_deg = lat_rad*180/Math.PI;
    var lng_deg = lng_rad*180/Math.PI;
    var n = Math.pow(2.0, zoom);
    var xtile = Math.floor((lng_deg + 180.0) / 360.0 * n);
    var ytile = Math.floor((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n);
    return {
        "xtile": xtile, 
        "ytile": ytile
    };
};


/****    TRANSLATIONS     ************************/
/**
 * drapePoint() : drape a point over the ground 
 *      - point: point to drape
 *      - dem: ground 
 */
RANDO.Utils.drapePoint = function (point, dem) {
    var children = dem.getChildren();
    var ray =  new BABYLON.Ray(point, BABYLON.Axis.Y);
    for (it in children) {
        var pick = children[it].intersects(ray, true);
        if (pick.pickedPoint) {
            point.y = pick.pickedPoint.y + RANDO.SETTINGS.TREK_OFFSET;
        }
    }
}



var getExponantOfTwo = function (value, max) {
        var count = 1;

        do {
            count *= 2;
        } while (count < value);

        if (count > max)
            count = max;

        return count;
    };

var prepareWebGLTexture = function (texture, scene, width, height, invertY, noMipmap, processFunction) {
        var engine = scene.getEngine();
        var potWidth = getExponantOfTwo(width, engine._caps.maxTextureSize);
        var potHeight = getExponantOfTwo(height, engine._caps.maxTextureSize);

        engine._gl.bindTexture(engine._gl.TEXTURE_2D, texture);
        engine._gl.pixelStorei(engine._gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? true : invertY);

        processFunction(potWidth, potHeight);

        engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MAG_FILTER, engine._gl.LINEAR);

        if (noMipmap) {
            engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MIN_FILTER, engine._gl.LINEAR);
        } else {
            engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MIN_FILTER, engine._gl.LINEAR_MIPMAP_LINEAR);
            engine._gl.generateMipmap(engine._gl.TEXTURE_2D);
        }
        engine._gl.bindTexture(engine._gl.TEXTURE_2D, null);

        engine._activeTexturesCache = [];
        texture._baseWidth = width;
        texture._baseHeight = height;
        texture._width = potWidth;
        texture._height = potHeight;
        texture.isReady = true;
        scene._removePendingData(texture);
    };

RANDO.Utils.createTexture = function (engine, mesh, url, scene, noMipmap, invertY) {
    var texture = engine._gl.createTexture();
    var img = new Image();
    scene._addPendingData(texture);
    texture.url = url;
    texture.noMipmap = noMipmap;
    texture.references = 1;
    engine._loadedTexturesCache.push(texture);
    
    
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        prepareWebGLTexture(texture, scene, img.width, img.height, invertY, noMipmap, function (potWidth, potHeight) {
            var isPot = (img.width == potWidth && img.height == potHeight);
            if (!isPot) {
                engine._workingCanvas.width = potWidth;
                engine._workingCanvas.height = potHeight;

                engine._workingContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, potWidth, potHeight);
            }

            engine._gl.texImage2D(
                engine._gl.TEXTURE_2D, 
                0, 
                engine._gl.RGBA, 
                engine._gl.RGBA, 
                engine._gl.UNSIGNED_BYTE, 
                isPot ? img : engine._workingCanvas
            );
            
            mesh.material.wireframe = false;
        });
    }
    
    img.onerror = function() {
        scene._removePendingData(texture);
    };
    
    img.src = url;
    
    return texture;
};
