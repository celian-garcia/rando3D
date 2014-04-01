/**
 * 
 *  VARIABLES   
 * 
 * */
    var altitude_offset = 10;
    var b_zone =  true;
    var b_troncon = true;
    
    
    // Get the Canvas element from our HTML 
    var canvas = document.getElementById("canvas_renderer");
    // Load BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    
    var _CAM_OFFSET = 30;
/**
 *  Main function    
 * 
 * 
 * 
 * TRICK : use the python module SimpleHTTPServer with the command :
 *              python -m SimpleHTTPServer 
 *          to launch in chromium 
 * */
$("#menu .choice").click(function() {
    var id = $(this).data('id');
    
    // clear engine if it contains something
    engine.clear(new BABYLON.Color4(255,255,255,0),true ,true );
    // Scene
    var scene = new BABYLON.Scene(engine);
    // Camera
    var camera = RANDO.Utils.initCamera(scene);
    camera.attachControl(canvas);
    var translateXY = {
        x : 0,
        y : 0
    };
    
    if (b_zone){
        var dem;
        // Getting data of DEM----------
        $.ajax({
            url:  "json/dem-pne-" + id + ".json",
            dataType: 'json',
            async: false,
            success: function(data) {
                console.log("MNT en entrée : ");
                console.log(data);

                var extent = RANDO.Utils.getExtent(data.extent);
                var ll_center = RANDO.Utils.toMeters(data.center);

                dem = {
                    "extent"    :   extent,
                    "vertices"  :   RANDO.Utils.getVerticesFromDEM(
                                        data.resolution, 
                                        data.altitudes, 
                                        extent
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
        
        
        dem = RANDO.Utils.translateDEM(
            dem, 
            translateXY.x, 
            dem.extent.altitudes.min, 
            translateXY.y
        );
        
        console.log("MNT en sortie : prêt à être manipulé par BABYLON.js");
        console.log(dem);
        //RANDO.Builds.cardinals(dem.extent, scene);
        
        var texture = new BABYLON.Texture("img/image.jpg", scene);
        // Zone building
        RANDO.Builds.zone(scene, dem, texture);
    }

    var vertices;
    if (b_troncon) {
        // Getting data of TRONCON----------
        $.ajax({
            url: "json/profile-pne-" + id + ".json",
            dataType: 'json',
            async: false,
            success: function(data) {
                vertices = RANDO.Utils.getVerticesFromProfile(data.profile);
            }
        });//------------------------------------------------------------
        if(vertices){
            vertices = RANDO.Utils.translateRoute(
                vertices, 
                translateXY.x, 
                altitude_offset, 
                translateXY.y
            );
            
            // Route building
            RANDO.Builds.route(scene, vertices);
        }
    }   
       
    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
        //RANDO.Utils.refreshPanels(vertices.length, scene);
        scene.render();
    });
});
$("#menu .choice:first").click();
