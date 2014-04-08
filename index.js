/**
 * 
 *  VARIABLES   
 * 
 * */
    var scene = null;
    var engine = null;
    START_TIME = Date.now();
    
    window.addEventListener("resize", function(){
        engine.resize();
    });
    
    // Get the Canvas element from our HTML 
    var canvas = document.getElementById("canvas_renderer");


window.onload = function onload(){
$("#menu .button").click(function() {
    RANDO.SETTINGS.ID_SCENE = $(this).data('id');
    RANDO.SETTINGS.DEM_URL      = "json/trek/" + RANDO.SETTINGS.ID_SCENE + "/dem.json",
    RANDO.SETTINGS.PROFILE_URL  = "json/trek/" + RANDO.SETTINGS.ID_SCENE + "/profile.json";
    RANDO.SETTINGS.TEXTURE_URL  = "img/texture/" + RANDO.SETTINGS.ID_SCENE + "/texture.jpg";
    
    if (engine){
        engine.dispose();
        engine = null;
    }
    if(scene){
        scene.dispose();
        scene = null;
    }
    
    // Check support
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        // Load BABYLON 3D engine
        engine = new BABYLON.Engine(canvas, true);
        scene = createScene(engine);
        
        scene.activeCamera.attachControl(canvas);
        
        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            //RANDO.Utils.refreshPanels(vertices.length, scene);
            scene.render();
        });
        
        scene.executeWhenReady(function () {
            console.log("Scene is ready ! " + (Date.now() - START_TIME) );
            
            // texture
            var mesh = scene.getMeshByName("Digital Elevation Model");
            if (mesh){
                var material = mesh.material;
                material.diffuseTexture =  new BABYLON.Texture(
                    RANDO.SETTINGS.TEXTURE_URL, 
                    scene
                );
                material.wireframe = false;
            }
            
            //~ $("#loader").switchClass("loading", "unloading", 200, "easeOutQuad" );
            //~ $("#loader").switchClass("unloading", "endloading", 200);
        });
    }
});
$("#menu .button:first").click();



function createScene(engine){
    // Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    
    // Camera
    var camera = RANDO.Builds.Camera(scene);
    
    // Lights
    var lights = RANDO.Builds.Lights(scene);
    
    // Translation on the XY plane (XZ in babylon)
    var translateXY = {
        x : 0,
        y : 0
    };
    
    $.getJSON(RANDO.SETTINGS.DEM_URL)
     .done(function (data) {
        var m_extent = RANDO.Utils.getExtentinMeters(data.extent);
        var m_center = RANDO.Utils.toMeters(data.center);

        // DEM
        var dem = {
            "extent"    :   m_extent,
            "altitudes"  :  data.altitudes, // altitudes already in meters
            "resolution":   data.resolution,// reso already in meters
            "center"    :   {
                                x: m_center.x,
                                y: data.center.z,// alt of center already in meters
                                z: m_center.y
                            }
        };
        translateXY.x = -dem.center.x;
        translateXY.y = -dem.center.z;

        // Translation of the DEM
        RANDO.Utils.translateDEM(
            dem,
            translateXY.x,
            dem.extent.altitudes.min,
            translateXY.y
        );

        // DEM mesh building
        RANDO.Builds.DEM(
            dem,
            scene
        );
     })
    .then(function () {
        return $.getJSON(RANDO.SETTINGS.PROFILE_URL);
    })
    .done(function (data) {
        var vertices = RANDO.Utils.getVerticesFromProfile(data.profile);
        
        // Translation of the route to make it visible
        RANDO.Utils.translateRoute(
            vertices,
            translateXY.x,
            0,
            translateXY.y
        );

        // Drape the route over the DEM
        RANDO.Utils.drape(vertices, scene);

        // Route just a bit higher to the DEM
        RANDO.Utils.translateRoute(
            vertices,
            0,
            RANDO.SETTINGS.TREK_OFFSET,
            0
        );
        
        // Route building
        RANDO.Builds.Trek(scene, vertices);
    }
    );

    return scene;
}
};









