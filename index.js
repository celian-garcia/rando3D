/**
 * 
 *  VARIABLES   
 * 
 * */
    var b_zone =  true;
    var b_troncon = true;
    
    var _CAM_OFFSET = 100;
    var _ALT_OFFSET = 2;
    var _ID_SCENE;
    var scene = null;



var onload = function(){
/**
 *  Main function    
 * 
 * TRICK : use the python module SimpleHTTPServer with the command :
 *              python -m SimpleHTTPServer 
 *          to launch in chromium 
 * */
$("#menu .button").click(function() {
    // Get the Canvas element from our HTML 
    var canvas = document.getElementById("canvas_renderer");
    _ID_SCENE = $(this).data('id');
    
    // Check support
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        // Load BABYLON 3D engine
        var engine = new BABYLON.Engine(canvas, true);
        
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


/**
 * createScene() : 
 * 
 * 
 */
function createScene(engine){
     //Creation of the scene 
    var scene = new BABYLON.Scene(engine);
    
    // Camera
    var camera = RANDO.Utils.initCamera(scene);
    
    var grid2D, translateXY = {
        x : 0,
        y : 0
    };
    
    if (b_zone){
        var dem;
        // Getting data of DEM----------
        $.ajax({
            url:  "json/dem-pne-" + _ID_SCENE + ".json",
            dataType: 'json',
            async: false,
            success: function(data) {
                console.log("MNT en entrée : ");
                console.log(data);
                
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
            }
        });//------------------------------------------------------------
        
        RANDO.Utils.translateDEM(
            dem, 
            translateXY.x, 
            dem.extent.altitudes.min, 
            translateXY.y
        );
        
        console.log("MNT en sortie : prêt à être manipulé par BABYLON.js");
        console.log(dem);
        //RANDO.Builds.cardinals(dem.extent, scene);
        
        // Zone building
        RANDO.Builds.zone(
            scene, 
            dem, 
            new BABYLON.Texture("img/tex-pne-" + _ID_SCENE + ".jpg", scene)
        );
    }

    var vertices;
    if (b_troncon) {
        // Getting data of TRONCON----------
        $.ajax({
            url: "json/profile-pne-" + _ID_SCENE + ".json",
            dataType: 'json',
            async: false,
            success: function(data) {
                vertices = RANDO.Utils.getVerticesFromProfile(data.profile);
            }
        });//------------------------------------------------------------
        if(vertices){
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
                _ALT_OFFSET, 
                0
            );
            
            // Route building
            RANDO.Builds.route(scene, vertices);
        }
    }   
    
    return scene;
}

};

