// Rando.Utils.js 
// Rando utilities

var RANDO = RANDO || {};
RANDO.Utils = {};

/**
 *  createGround()
 *      - name : Name of the new Ground
 *      - width : Width of the new Ground
 *      - height : Height of the new Ground
 *      - w_subdivisions : Number of Width's subdivisions in the new Ground 
 *      - h_subdivisions : Number of Height's subdivisions in the new Ground
 *      - scene : Scene which contain the new Ground 
 *      - updatable : 
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
 *      - cylinder (BABYLON.Mesh): BABYLON Cylinder object
 *      - A (BABYLON.Vector3):     First Point 
 *      - B (BABYLON.Vector3):     Second Point
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



/****    MATH     ************************/
/**
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
RANDO.Utils.angleFromPoints = function (A, B, H){
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
 *  init_camera() : initialize main parameters of camera    
 *      - scene : the current scene
 * 
 *  return the camera
 * */
RANDO.Utils.initCamera = function(scene){
    var camera  = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, 0), scene);
    camera.checkCollisions = true;
    camera.maxZ = 10000;
    camera.speed = 20;
    camera.keysUp = [90, 38]; // Touche Z
    camera.keysDown = [83, 40]; // Touche S
    camera.keysLeft = [81, 37]; // Touche Q
    camera.keysRight = [68, 39]; // Touche D
    var l_cam = new BABYLON.HemisphericLight("LightCamera", new BABYLON.Vector3(0,1000,0), scene)
    l_cam.intensity = 0.8;
    l_cam.parent = camera;
    return camera;
}

/**
 * placeCamera() : place a camera at the position given, and make it look at the 
 *  target given. 
 *      - camera    : camera 
 *      - position  : future position 
 *      - target    : future target
 *      - no_offset : boolean which determines if we give an y-offset to the camera or not
 * 
 */
RANDO.Utils.moveCameraTo = function(camera, position, target, no_offset){
    var y_offset = 0;
    if (typeof(no_offset)==="undefined") y_offset = _CAM_OFFSET;
   
    var start_pos = position;
    var start_rot_y = RANDO.Utils.angleFromAxis(position, target, BABYLON.Axis.Y);
    TweenLite.to(camera.position, 2, { 
        x: start_pos.x, 
        y: start_pos.y + y_offset,
        z: start_pos.z,
        ease: 'ease-in'
    });
    TweenLite.to(camera.rotation, 2, { 
        x: 0,
        y: start_rot_y, 
        z: 0,
        ease: 'ease-in' 
    });
}
//RANDO.Utils.addKeyToCamera(timeline
/**
 *  animate_camera() : animation and controls of the camera 
 *      - vertices : array of vertices
 *      - scene : the current scene
 * 
 *  return the camera
 * */
RANDO.Utils.animateCamera = function(vertices, scene){
    
    var d = 5 // Distance between the current point and the point watched
        speed = 0.5; // Time between each point
        b_fly = false;
        b_pause = true;
        fly = new TimelineLite();
        angles = [];
        
    //Filling of the timeline "flying" animation
    for (var i=d; i< vertices.length-d; i+=d){
        var curr_pos = vertices[i],
            next_pos = vertices[i+d],
            alpha1, alpha2 = RANDO.Utils.angleFromAxis(curr_pos, next_pos,BABYLON.Axis.Y);
        
        if(i!=d){
            alpha1 = angles[(i/d)-2];
            if(alpha1*alpha2<0 && Math.abs(alpha1) > Math.PI/2 && Math.abs(alpha2) > Math.PI/2){
                alpha2 = (2*Math.PI - Math.abs(alpha2));
            }
        }
        fly.appendMultiple( 
            [new TweenLite(scene.activeCamera.position, speed, {
                x: curr_pos.x, 
                y: curr_pos.y + _CAM_OFFSET, 
                z: curr_pos.z,
                ease: "Linear.easeNone"  
                }),
            new TweenLite(scene.activeCamera.rotation, speed, {
                y: alpha2,
                ease: "Power1.easeInOut"  
            })],
            0,
            "start"
        );
        angles.push(alpha2);

    }//-------------------
    
    var alpha1, alpha2 = RANDO.Utils.angleFromAxis(vertices[0], vertices[1], BABYLON.Axis.Y);
    
    alpha1 = angles[angles.length-1];
    if(alpha1*alpha2<0 && Math.abs(alpha1) > Math.PI/2 && Math.abs(alpha2) > Math.PI/2){
        alpha2 = (2*Math.PI - Math.abs(alpha2));
    }
    fly.appendMultiple( 
        [new TweenLite(scene.activeCamera.position, speed, {
            x: curr_pos.x, 
            y: curr_pos.y + _CAM_OFFSET, 
            z: curr_pos.z,
            ease: "Linear.easeNone"  
            }),
        new TweenLite(scene.activeCamera.rotation, speed, {
            y: alpha2,
            ease: "Power1.easeInOut"  
        })],
        0,
        "start"
    );
        
    // Animation paused by default
    fly.pause(0);
    
    // Controls
    $(document).keyup(function(e){
        var keyCode = e.keyCode;

        // Space
        if (keyCode == 32 && b_fly){   
            b_pause = !b_pause;
            if(b_pause)
                fly.pause();
            else
                fly.play();
        }

        // Enter
        if (keyCode == 13){
            if(!b_fly){
                RANDO.Utils.moveCameraTo(scene.activeCamera, vertices[0], vertices[1]);
                b_fly = true;
            }else {
                fly.pause(0);
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



/****    GETTERS     ************************/
/**
 * getVertices() : get DEM vertices in a format which can be understood by the DEM builder
 *      - resolution : number of points along x and y 
 *      - altitudes  : 2 dimensions array containing altitudes of the vertices
 *      - extent     : object containing the four exrems point of the DEM
 * 
 */
RANDO.Utils.getVerticesFromDEM = function(resolution, altitudes, extent){
    var vertices = [];

    // Create grid 
    var grid = RANDO.Utils.createGrid(
        extent.southwest, 
        extent.southeast, 
        extent.northeast, 
        extent.northwest, 
        resolution.x,
        resolution.y
    );

    // Fills array of vertices 
    var k = 1;
    for (var j=0; j<resolution.y ;j++){
        for (var i=0; i<resolution.x ;i++){
            vertices.push(grid[j][i].x);
            vertices[k] = altitudes[j][i];
            vertices.push(grid[j][i].y);
            k += 3;
        }
    }

    return vertices ;
}

/**
 * getVerticesFromProfile() : 
 *      - profile : troncon profile in json 
 * 
 * return an array of vertices 
 */
RANDO.Utils.getVerticesFromProfile = function(profile){
    var vertices =  [];
    
    for (it in profile){
        var tmp = {
            'lat' : profile[it][2][1],
            'lng' : profile[it][2][0]
        }
        tmp = RANDO.Utils.toMeters(tmp);
        tmp.z = tmp.y;
        tmp.y = profile[it][1]
        vertices.push(tmp);
    }
    
    return vertices;
}

/**
 * getExtent() : get the four corners of the DEM (in meters) and altitudes minimum and maximum
 *      - extent : extent of the DEM served by the json
 */
RANDO.Utils.getExtent = function(extent){
    return {
        northwest : RANDO.Utils.toMeters(extent.northwest),
        northeast : RANDO.Utils.toMeters(extent.northeast),
        southeast : RANDO.Utils.toMeters(extent.southeast),
        southwest : RANDO.Utils.toMeters(extent.southwest),
        altitudes : extent.altitudes
    }
}

/**
 * toMeters() : transform a point in latitude/longitude to x/y meters coordinates
 *      - latlng : point in lat/lng 
 * 
 * return a point in meters 
 * 
 * { lat : .. , lng : .. }  ---> { x : .. , y : .. }
 */
RANDO.Utils.toMeters = function(latlng){
    
    var R = 6378137;

    var d = Math.PI / 180;
    var max = 1 - 1*Math.pow(10, -15);
    var sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);

    return {
        x : R * latlng.lng * d,
        y : R * Math.log((1 + sin) / (1 - sin)) / 2
    };
}


/****    TRANSLATIONS     ************************/
/**
 * translateDEM() : translate the DEM with coefficients given in parameters
 *      - dem : dem to translate 
 *      - dx  : x coefficient 
 *      - dy  : y coefficient  (altitudes in BABYLON)
 *      - dz  : z coefficient  (depth     in BABYLON)
 * 
 * return the DEM translated
 */
RANDO.Utils.translateDEM = function(dem, dx, dy, dz){
    for (var i=0; i< dem.vertices.length; i+=3){
        dem.vertices[i]   += dx;
        dem.vertices[i+1] += dy;
        dem.vertices[i+2] += dz;
    }
    dem.center.x += dx;
    dem.center.y += dy;
    dem.center.z += dz;
    
    dem.extent.northwest.x += dx;
    dem.extent.northwest.y += dz;
    
    dem.extent.northeast.x += dx;
    dem.extent.northeast.y += dz;
    
    dem.extent.southeast.x += dx;
    dem.extent.southeast.y += dz;
    
    dem.extent.southwest.x += dx;
    dem.extent.southwest.y += dz;
    
    dem.extent.altitudes.min += dy;
    dem.extent.altitudes.max += dy;
    return dem;
}

/**
 * translateRoute() : translate a route with coefficients given in parameters
 *      - vertices : vertices of the route 
 *      - dx  : x coefficient 
 *      - dy  : y coefficient  (altitudes in BABYLON)
 *      - dz  : z coefficient  (depth     in BABYLON)
 * 
 * return the DEM translated
 */
RANDO.Utils.translateRoute = function(vertices, dx, dy, dz){
    for (it in vertices){
        vertices[it].x += dx;
        vertices[it].y += dy;
        vertices[it].z += dz;
    }
    
    return vertices;
}
