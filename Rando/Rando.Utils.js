// Rando.Utils.js 
// Rando utilities

var RANDO = RANDO || {};
RANDO.Utils = {};

/**
 *  createGround()
 *   - name : Name of the new Ground
 *   - width : Width of the new Ground
 *   - height : Height of the new Ground
 *   - w_subdivisions : Number of Width's subdivisions in the new Ground 
 *   - h_subdivisions : Number of Height's subdivisions in the new Ground
 *   - scene : Scene which contain the new Ground 
 *   - updatable : 
 * 
 * Create a ground which can be divided differently in width and in height
 * It uses the function BABYLON.Mesh.CreateGround() of the 1.9.0 release of BABYLON
 ****************************************************************/
RANDO.Utils.createGround = function(name, width, height, w_subdivisions, h_subdivisions, scene, updatable) {
    var ground = new BABYLON.Mesh(name, scene);

    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;

    for (row = 0; row <= h_subdivisions; row++) {
        for (col = 0; col <= w_subdivisions; col++) {
            var position = new BABYLON.Vector3((col * width) / w_subdivisions - (width / 2.0), 0, ((h_subdivisions - row) * height) / h_subdivisions - (height / 2.0));
            var normal = new BABYLON.Vector3(0, 1.0, 0);

            positions.push(position.x, position.y, position.z);
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
 *  placeCylinder()
 *   - cylinder (BABYLON.Mesh): BABYLON Cylinder object
 *   - A (BABYLON.Vector3):     First Point 
 *   - B (BABYLON.Vector3):     Second Point
 * 
 * Place the cylinder between both points  
 ****************************************************************/
RANDO.Utils.placeCylinder = function(cylinder, A, B) {
    // Initial position at the center of the AB vector
    cylinder.position = new BABYLON.Vector3(
        (A.x+B.x)/2,
        (A.y+B.y)/2,
        (A.z+B.z)/2
    );
    
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
RANDO.Utils.angleFromAxis = function(A, B, axis){
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
 *      A (BABYLON.Vector3) : First point
 *      B (BABYLON.Vector3) : Second point
 *      H (BABYLON.Vector3) : Orthogonal projection of B over the axis 
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
RANDO.Utils.angleFromPoints = function (A, B, H){
    var AH = BABYLON.Vector3.Distance(A, H);
    var AB = BABYLON.Vector3.Distance(A, B);
    var angle = Math.acos(AH/AB);
    
    // Check the sign 
    if (H.x < B.x) 
        return -angle;
    return angle;
}

/**
 *  init_camera() : initialize main parameters of camera   
 *      
 *      - scene : the current scene
 * 
 *  return the camera
 * */
RANDO.Utils.initCamera = function(scene){
    var camera  = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 0), scene);
    camera.checkCollisions = true;
    camera.maxZ = 10000;
    camera.speed = 20;
    camera.keysUp = [90]; // Touche Z
    camera.keysDown = [83]; // Touche S
    camera.keysLeft = [81]; // Touche Q
    camera.keysRight = [68]; // Touche D
    var l_cam = new BABYLON.HemisphericLight("LightCamera", new BABYLON.Vector3(0,0,0), scene)
    l_cam.intensity = 0.8;
    l_cam.parent = camera;
    return camera;
}

/**
 *  animate_camera() : animation and controls of the camera 
 *      
 *      - troncon : array of points
 *      - scene : the current scene
 * 
 *  return the camera
 * */
RANDO.Utils.animateCamera = function(troncon, z_offset, cam_z_off, scene){
    var fpk = 10; // Time to go from a point to another (frame per key)
    var fps = 30; // Frame per Second
    var d = 5 // Distance between the current point and the point watched
    scene.activeCamera.position.y += cam_z_off;
    
    // Init rotation animation
    var animCameraRot = new BABYLON.Animation(
        "anim_cam_ry",
        "rotation.y",
        fps,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONST
    );
    
    // Init translation animation
    var animCameraTrans = new BABYLON.Animation(
        "anim_cam_tr",
        "position",
        fps,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONST
    );

    // Arrays with all animation keys
    var keys_rot = [];  
    var keys_tr = [];  
    for (var i = 0; i < troncon.length-d; i++){
        var a = new BABYLON.Vector3(
            troncon[i][0], 
            troncon[i][2], 
            troncon[i][1]
        );
        var b = new BABYLON.Vector3(
            troncon[i+d][0], 
            troncon[i+d][2], 
            troncon[i+d][1]
        );
        keys_rot.push({
            frame:  i*fpk,
            value:  RANDO.Utils.angleFromAxis(a, b, BABYLON.Axis.Y)
        });
        keys_tr.push({
            frame:  i*fpk,
            value:  new BABYLON.Vector3(
                        a.x, 
                        a.y + z_offset + cam_z_off,
                        a.z
                    )
        });
    }
       
    // Setting keys of both animations
    animCameraRot.setKeys(keys_rot);
    animCameraTrans.setKeys(keys_tr);
    
    // Push animations in the animation's array of camera
    scene.activeCamera.animations.push(animCameraRot);
    scene.activeCamera.animations.push(animCameraTrans);
    
    
    var pause = true;
    var begin = true;
    var curr;
    var end = (troncon.length-d-1)*fpk;
    $(document).keyup(function (e) {
        var keyCode = e.keyCode;
        
        if (keyCode == 32){   
            if (begin){
                curr = 0;
                begin = false;
            }else
                curr = animCameraTrans.currentFrame;
            if (curr != end){
                pause = !pause;
                if (pause) 
                    scene.stopAnimation(scene.activeCamera);
                else 
                    scene.beginAnimation(scene.activeCamera, curr, end, false);
            }
        }
            
        if (keyCode == 13){
            scene.stopAnimation(scene.activeCamera);
            animCameraTrans.currentFrame = 0;
            scene.activeCamera.position = new BABYLON.Vector3(
                troncon[0][0],
                troncon[0][2]+ z_offset + cam_z_off, 
                troncon[0][1]
            );
            var a = new BABYLON.Vector3(
                troncon[0][0], 
                troncon[0][2], 
                troncon[0][1]
            );
            var b = new BABYLON.Vector3(
                troncon[d][0], 
                troncon[d][2], 
                troncon[d][1]
            );
            scene.activeCamera.rotation.y = RANDO.Utils.angleFromAxis(a, b, BABYLON.Axis.Y);
        }
    });
    
}

/**
 * refreshPanels() : refresh pivot matrices of all panels to always have panels 
 *  directed to the camera.
 * 
 *      - number (int)          : number of panels in the scene 
 *      - scene (BABYLON.Scene) : current scene
 */
RANDO.Utils.refreshPanels = function(number, scene){
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

RANDO.Utils.getVertices = function(resolution, altitudes, extent){
    var vertices = [];
    var A = extent.northwest;
    var B = extent.northeast;
    var C = extent.southeast;
    var D = extent.southwest;
    
    
    var grid = RANDO.Utils.createGrid(
        A, B, C, D, 
        resolution.x,
        resolution.y
    );
    
    // Fills array of vertices
    for (var j=0; j<resolution.y ;j++){
        for (var i=0; i<resolution.x ;i++){
            vertices.push(grid[j][i].x);
            vertices.push(1500);
            vertices.push(grid[j][i].y);
        }
    }
    
    
    var k =1;
    for (var j=0; j < resolution.y ;j++){
        for (var i=0; i<resolution.x ;i++){
            vertices[k] = altitudes[j][i];
            k += 3;
        }
    }
    
    console.log(vertices.slice(0, 100));
    return vertices ;
}

RANDO.Utils.getExtent = function(extent){
    
    return {
        northwest : RANDO.Utils.toMeters(extent.northwest),
        northeast : RANDO.Utils.toMeters(extent.northeast),
        southeast : RANDO.Utils.toMeters(extent.southeast),
        southwest : RANDO.Utils.toMeters(extent.southwest),
        altitudes : extent.altitudes
    }
}

RANDO.Utils.subdivide = function(n, A, B){
    
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
                x : x,
                y : y 
            });
        }
        res.push(B);
        return res;
    } 
}

/**
 * createGrid() : create a grid of points for all type of quadrilateres, in particular
 *  these which are not square or rectangle.
 * 
 *      - A, B, C, D :  vertices of quadrilatere to subdivide
 *      - n_verti :     number of points in vertical size
 *      - n_horiz :     number of points in horizontal size
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
RANDO.Utils.createGrid = function(A, B, C, D, n_horiz, n_verti){
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

RANDO.Utils.toMeters = function(latlng){
    
    var R = 6378137;

    var d = Math.PI / 180;
    var max = 1 - 1E-15;
    var sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);

    return {
        x : R * latlng.lng * d,
        y : R * Math.log((1 + sin) / (1 - sin)) / 2
    };
}


RANDO.Utils.translateDEM = function(dem){
    var dx = dem.center.x,
        dy = dem.center.y,
        dz = dem.extent.altitudes.min;
    
    for (var i=0; i< dem.vertices.length; i+=3){
        dem.vertices[i]   -= dx;
        dem.vertices[i+1] += dz;
        dem.vertices[i+2] -= dy;
    }
    dem.center.x -= dx;
    dem.center.y -= dy;
    
    dem.extent.northwest.x -= dx;
    dem.extent.northwest.y -= dy;
    
    dem.extent.northeast.x -= dx;
    dem.extent.northeast.y -= dy;
    
    dem.extent.southeast.x -= dx;
    dem.extent.southeast.y -= dy;
    
    dem.extent.southwest.x -= dx;
    dem.extent.southwest.y -= dy;
    return dem;
}

/*  HELP 

Rando.Utils.get_x_rotation = function (v) { .... };





Rando.Utils.get_x_rotation().






Rando.Mesh.createPathSegment = function ... {
    var m = BABYLON.Mesh.createCylinder...
    
    m.place = function (A, B) {
    }
    
    return m;
}






Rando.Mesh = BABYLON.Mesh.extends({
    place: function () ...
});


Rando.Mesh.createCylinder = function ()
   ... new Rando.Mesh



 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
