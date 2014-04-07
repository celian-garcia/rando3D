/**
 * 
 *  VARIABLES   
 * 
 * */
    var scene = null;
    var engine = null;
    
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
        
        //~ scene.executeWhenReady(function () {
            //~ $("#loader").switchClass("loading", "unloading", 200, "easeOutQuad" );
            //~ $("#loader").switchClass("unloading", "endloading", 200);
        //~ });
    }
});
$("#menu .button:first").click();



function createScene(engine){
    // Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    
    // Camera
    var camera = RANDO.Builds.camera(scene);
    
    // Lights
    var lights = RANDO.Builds.lights(scene);
    
    var grid2D, translateXY = {
        x : 0,
        y : 0
    };
    
    var dem;
    $.getJSON(RANDO.SETTINGS.DEM_URL)
     .done(function (data) {
        var extent = RANDO.Utils.getExtent(data.extent);
        var ll_center = RANDO.Utils.toMeters(data.center);

        // Create grid
        grid2D = RANDO.Utils.createGrid(
            extent.southwest,
            extent.southeast,
            extent.northeast,
            extent.northwest,
            data.resolution.x,
            data.resolution.y
        );

        dem = {
            "extent"    :   extent,
            "vertices"  :   RANDO.Utils.getVerticesFromDEM(
                                data.altitudes,
                                grid2D
                            ),
            "resolution":   data.resolution,
            "center"    :   {
                                x: ll_center.x,
                                y: data.center.z,
                                z: ll_center.y
                            }
        };
        translateXY.x = -dem.center.x;
        translateXY.y = -dem.center.z;

        RANDO.Utils.translateDEM(
            dem,
            translateXY.x,
            dem.extent.altitudes.min,
            translateXY.y
        );

        // Zone building
        RANDO.Builds.zone(
            scene,
            dem,
            new BABYLON.Texture(RANDO.SETTINGS.TEXTURE_URL, scene)  // texture
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
        RANDO.Builds.route(scene, vertices);
    });

    return scene;
}
};









