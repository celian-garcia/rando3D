// Rando.Builds.js 
// Builders of zone and route

var RANDO = RANDO || {};
RANDO.Builds = {};
    
/**
 * buildZone() : build a heightMap from a DEM corresponding of zone around a troncon 
 *      - scene (BABYLON.Scene) : current scene
 *      - data (Dictionnary)    : dictionnary containing :
 *              * center of DEM
 *              * resolution of DEM
 *              * vertices  
 *      - texture (BABYLON.Texture) : texture which will be applied  **optionnal**
 *      - cam_b (Boolean)       : settings of camera **optionnal**
 * 
 */
RANDO.Builds.zone = function(scene, data, texture, cam_b){
    if(typeof(cam_b)==='undefined') texture = null;
    if(typeof(cam_b)==='undefined') cam_b = true;
    
    var center = data.center;
    var resolution = data.resolution;
    var vertices = data.vertices;

    // Camera 
    if (cam_b){
        scene.activeCamera.rotation = new BABYLON.Vector3(0.6, 1, 0);
        scene.activeCamera.position = new BABYLON.Vector3(
            center.x-2000, 
            center.z+2000, 
            center.y-1500
        );
    }
    // Material
    var material =  new BABYLON.StandardMaterial("GroundMaterial", scene);
    material.backFaceCulling = false;
    if(texture) 
        material.ambientTexture = texture;
    else 
        material.wireframe = true;

    // Create Zone
    var zone = RANDO.Utils.createGround(
        "Zone",
        10,
        10, 
        resolution.x-1,
        resolution.y-1, 
        scene
    );
    console.assert(
        zone.getVerticesData(BABYLON.VertexBuffer.PositionKind).length == vertices.length,
        zone.getVerticesData(BABYLON.VertexBuffer.PositionKind).length + " != " + vertices.length
    );
    
            
    zone.material = material;
    zone.setVerticesData(vertices, BABYLON.VertexBuffer.PositionKind);
    //console.log(zone.getVerticesData(BABYLON.VertexBuffer.PositionKind).slice(18500, vertices.length-2));
    // Light
    var sun = new BABYLON.HemisphericLight("Sun", new BABYLON.Vector3(500, 1000, 0), scene);
}

/**
 * buildRoute() : build a troncon from an array of point
 *      - scene (BABYLON.Scene) : current scene
 *      - vertices     : array of vertices
 *      - cam_b (bool): settings of camera **optionnal**
 *      - lin_b (bool): using of "line" meshes (kind of ribbon) **optionnal**
 *      - sph_b (bool): using of sphere meshes **optionnal**
 *      - cyl_b (bool): using of cylinder meshes **optionnal**
 *      - pan_b (bool): using of panel meshes to display informations **optionnal**
 */
RANDO.Builds.route = function(scene, vertices, cam_b,  lin_b, sph_b, cyl_b, pan_b ){
    if(typeof(cam_b)==='undefined') cam_b = true;
    if(typeof(lin_b)==='undefined') lin_b = false;
    if(typeof(sph_b)==='undefined') sph_b = true;
    if(typeof(cyl_b)==='undefined') cyl_b = true;
    if(typeof(pan_b)==='undefined') pan_b = true;
    
    var material =  new BABYLON.StandardMaterial("PathMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(212,97,56);
    
    // Camera 
    if (cam_b){
        var cam_z_off = 30;
        scene.activeCamera.position = vertices[0];
        
        // Current position of the camera : the first point
        var position = scene.activeCamera.position;
        // Target of the camera : the fourth point 
        var target = vertices[1];
        // Rotation around the y axis
        var y = RANDO.Utils.angleFromAxis(position,target, BABYLON.Axis.Y);
        scene.activeCamera.rotation.y = y;
        
        RANDO.Utils.animateCamera(vertices, cam_z_off, scene);
    }//------------------------------------------------------------------
    
    // With Cylinder meshes 
    if (cyl_b){ 
        var cyl_diameter = 1;
        var cyl_tessel = 10;
        var cyl_material = new BABYLON.StandardMaterial("CylinderMaterial", scene);
        cyl_material.diffuseColor = new BABYLON.Color3(255,255,255);
        
        for (var i = 0; i < vertices.length-1; i++){
            var A = vertices[i];
            var B = vertices[i+1];
            var cyl_height = BABYLON.Vector3.Distance(A,B);
                                
            var cylinder = BABYLON.Mesh.CreateCylinder(
                "Cylinder" + (i+1), 
                cyl_height, 
                cyl_diameter, 
                cyl_diameter, 
                cyl_tessel, 
                scene
            );
            cylinder.material = cyl_material;
            
            // Place the cylinder between the current point A and the next point B
            cylinder = RANDO.Utils.placeCylinder(cylinder, A, B);
        }
    }//------------------------------------------------------------------
    
    // With "Line" meshes (kind of ribbon)
    /*if (lin_b){
        // Troncon material
        var lin_material = new BABYLON.StandardMaterial("RibbonMaterial", scene);
        lin_material.backFaceCulling = false;
        lin_material.diffuseColor = new BABYLON.Color3(255,255,255);
        
        // Create troncon
        var line = createGround("Line", 10, 10, troncon.length-1, 1, scene);
        line.material = lin_material;
        
        // Get and Set vertices
        var vertices = [];
        var lin_strength = 0.2;
        for(point in troncon){
            vertices.push(troncon[point][0]);
            vertices.push(troncon[point][2] + z_offset);
            vertices.push(troncon[point][1] - lin_strength/2);
        }
        for(point in troncon){
            vertices.push(troncon[point][0]);
            vertices.push(troncon[point][2] + z_offset);
            vertices.push(troncon[point][1] + lin_strength/2);
        }
        line.setVerticesData(vertices, BABYLON.VertexBuffer.PositionKind);
        
    }*///------------------------------------------------------------------
    
    // Spheres for each point
    if (sph_b){
        // Create Sphere
        var sph_diam = 1;
        var sph_material = new BABYLON.StandardMaterial("SphereMaterial", scene);
        sph_material.diffuseColor = new BABYLON.Color3(255,255,255);
        for(it in vertices){
            var sphere = BABYLON.Mesh.CreateSphere("Sphere" + it, 5, sph_diam, scene);
            sphere.material = material;
            sphere.position = vertices[it];
        }
    }//------------------------------------------------------------------
    
    // Panel for each point which indicates infos about point 
    if (pan_b){
        // Create Panel
        var pan_offset = 3;
        var pan_size = 10;
        var pan_info = {
            'policy' : "bold 50px Arial",
            'color'  : "red"
        }
        
        for(it in vertices){
            var pan_material =  new BABYLON.StandardMaterial("Panel", scene);
            pan_material.backFaceSculling = false;
            var panel = BABYLON.Mesh.CreatePlane("Panel" + i, pan_size , scene);
            panel.material = pan_material;
            panel.position = vertices[it];
            //panel.rotate(BABYLON.Axis.X, -Math.PI/2, BABYLON.Space.LOCAL); 
            
            var texture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            panel.material.diffuseTexture = texture;
            texture.hasAlpha = true;
            texture.drawText("Point "+ i+ " : "+ y +" m",
                50, 100, pan_info.policy, pan_info.color, 
                null
            );
        }
    }//------------------------------------------------------------------
}

/**
 * cardinals() : build the NW, NE, SE and SW extrems points of the DEM with spheres
 * 
 *      - extent : contain the four corners of the DEM
 *      - scene  : current scene  
 * 
 * NB : each point have its own color
 *          NW --> White 
 *          NE --> Red
 *          SE --> Blue
 *          SW --> Green
 * 
 */
RANDO.Builds.cardinals = function(extent, scene){

    var tmp;
    var sph_diam = 20;
    var matA = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var A = BABYLON.Mesh.CreateSphere("SphereA", 5, sph_diam, scene);
    tmp = extent.northwest;
    A.position.x = tmp.x;
    A.position.y = 1500;
    A.position.z = tmp.y;
    matA.diffuseColor = new BABYLON.Color3(255,255,255);
    A.material = matA;
    
    var matB = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var B = BABYLON.Mesh.CreateSphere("SphereB", 5, sph_diam, scene);
    tmp = extent.northeast;
    B.position.x = tmp.x;
    B.position.y = 1500;
    B.position.z = tmp.y;
    matB.diffuseColor = new BABYLON.Color3(255,0,0);
    B.material = matB;
    
    var matC = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var C = BABYLON.Mesh.CreateSphere("SphereC", 5, sph_diam, scene);
    tmp = extent.southeast;
    C.position.x = tmp.x;
    C.position.y = 1500;
    C.position.z = tmp.y;
    matC.diffuseColor = new BABYLON.Color3(0,0,255);
    C.material = matC;
    
    var matD = new BABYLON.StandardMaterial("SphereMaterial", scene);
    var D = BABYLON.Mesh.CreateSphere("SphereD", 5, sph_diam, scene);
    tmp = extent.southwest;
    D.position.x = tmp.x;
    D.position.y = 1500;
    D.position.z = tmp.y;
    matD.diffuseColor = new BABYLON.Color3(0,255,0);
    D.material = matD;


}



