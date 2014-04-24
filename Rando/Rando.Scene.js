RANDO = RANDO || {};
RANDO.Scene = {};


/**
 * launch():  launch the building of the DEM and trek from 2 json files
 * 
 *      - canvas: canvas in which we build the scene
 */
RANDO.Scene.launch = function(canvas){
    // Check support
    if (!BABYLON.Engine.isSupported()) {
        return null;
    } 
    
    // Load BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    RANDO.Events.addEvent(window, "resize", function(){
        engine.resize();
    });
    
    // Creation of the scene 
    scene = new BABYLON.Scene(engine);
    // Enable Collisions
    scene.collisionsEnabled = true;

    // Camera
    var camera = RANDO.Builds.Camera(scene);
    
    // Lights
    var lights = RANDO.Builds.Lights(scene);
    
    
    // Data used by DEM build
    var dem_data = {};
    
    // Data used by trek build
    var trek_data = [];
    
    // Data used by both of them
    var offsets = {};
    
    $.getJSON(RANDO.SETTINGS.DEM_URL)
     .done(function (data) {
        var m_center = RANDO.Utils.toMeters(data.center);
        var m_extent = RANDO.Utils.extent2meters (data.extent);
        
        // Record DEM data
        dem_data.o_extent = $.extend(true, {}, m_extent);
        dem_data.extent = m_extent;
        dem_data.altitudes = data.altitudes; // altitudes already in meters
        dem_data.resolution = data.resolution; // do not need conversion
        dem_data.o_center = {
            x: m_center.x,
            y: data.center.z,// altitude of center already in meters
            z: m_center.y
        }
        dem_data.center = {
            x: m_center.x,
            y: data.center.z,// altitude of center already in meters
            z: m_center.y
        };

        // Control if altitudes data coincide with resolution data
        console.assert(dem_data.altitudes.length == dem_data.resolution.y);
        console.assert(dem_data.altitudes[0].length == dem_data.resolution.x);
        
        // Records offsets
        offsets.x = -dem_data.center.x;
        offsets.y = dem_data.extent.altitudes.min;
        offsets.z = -dem_data.center.z;
     })
     .then(function () {
        return $.getJSON(RANDO.SETTINGS.PROFILE_URL);
     })
     .done(function (data) {
        trek_data = RANDO.Utils.getVerticesFromProfile(data.profile);
     }).then(function () {
         
        /***************************************************
         *    DEM
         ****************************************************/
        setTimeout(build_dem, 1);
        function build_dem() {
            
            // Tiled DEM mesh building
            var tiled_dem = RANDO.Builds.TiledDEM(
                dem_data,
                offsets,
                scene
            );
            
            // Render the DEM
            scene.render();
            
            setTimeout(build_trek, 1);
        };
        /****************************************************/
        
        
        /***************************************************
         *    TREK
         ****************************************************/
        function build_trek() {
            // Translation of the route to make it visible
            RANDO.Utils.translateTrek(
                trek_data,
                offsets.x,
                offsets.y,
                offsets.z
            );
            
            // Route building
            RANDO.Builds.Trek(scene, trek_data);
            
            // Attach camera controls
            scene.activeCamera.attachControl(canvas);
            
            scene.executeWhenReady(function () {
                executeWhenReady (scene);
            });
        }
        /****************************************************/
         
     });

    return scene;
};


function renderLoop (scene) {
    scene.getEngine().runRenderLoop(function() {
        scene.render();
    });
};


function executeWhenReady (scene) {
    
    console.log("Scene is ready ! " + (Date.now() - RANDO.START_TIME) );
    var dem = scene.getMeshByName("Digital Elevation Model");
    var trek_length = scene.getMeshByName("Spheres").getChildren().length;
    
    console.log("Trek adjustments ..." + (Date.now() - RANDO.START_TIME) );
    
    var index = 0;
    var chunk = 100; // By chunks of 100 points
    drape();

    // Drape vertices (spheres) over the DEM
    function drape(){
        var cnt = chunk;
        while (cnt-- && index < trek_length) {
            RANDO.Utils.drapePoint(scene.getMeshByName("Sphere " + (index+1)).position, dem);
            ++index;
        }
        if (index < trek_length){
            setTimeout(drape, 1);
        }else {
            // At the end of draping we place cylinders
            setTimeout(place, 1); 
        }
    }

    // Place all cylinders between each pairs of spheres 
    function place() {
        for (var i = 0; i < trek_length-1; i++) {
            RANDO.Utils.placeCylinder(
                scene.getMeshByName("Cylinder " + (i+1)), 
                scene.getMeshByName("Sphere "   + (i+1)).position, 
                scene.getMeshByName("Sphere "   + (i+2)).position
            );
        }
        console.log("Trek adjusted ! " + (Date.now() - RANDO.START_TIME) );
        
        // At the end, run the render loop 
        renderLoop(scene);
    }
};


















