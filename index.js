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
 * to launch in chromium 
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
        // Getting data of DEM----------
        // make serve
        // http://localhost:8000/api/trek/903488/dem.json
        // http://localhost:8000/api/trek/903488/profile.json
        $.ajax({
          url:  "json/dem-pne-" + id + ".json",
          dataType: 'json',
          async: false,
          success: function(data) {
                //var texture =  new BABYLON.Texture("{{ url_for('static', filename='img/texture-8.jpg') }}", scene);
            console.log("MNT en entrée : ");
            console.log(data);

            var extent = RANDO.Utils.getExtent(data.extent);
            var vertices = RANDO.Utils.getVerticesFromDEM(data.resolution, data.altitudes, extent);
            var resolution = data.resolution;
            var ll_center = RANDO.Utils.toMeters(data.center);
            var center = {
                x: ll_center.x,
                y: data.center.z,
                z: ll_center.y
            };
            
            console.log(center);
            var dem = {
                "extent"    : extent,
                "vertices"  : vertices,
                "resolution": resolution,
                "center"    : center
            };
            translateXY.x = -dem.center.x;
            translateXY.y = -dem.center.z;
            
            RANDO.Utils.translateDEM(
                dem, 
                translateXY.x, 
                dem.extent.altitudes.min, 
                translateXY.y
            );
            
            console.log("MNT en sortie : prêt à être manipulé par BABYLON.js");
            console.log(dem);
            //RANDO.Builds.cardinals(dem.extent, scene);
            
            // Zone 
            RANDO.Builds.zone(scene, dem);
                
          }
        });//------------------------------------------------------------
    }
    var troncon_length;
    if (b_troncon) {
        // Getting data of TRONCON----------
        //profile-pne-903488
        $.ajax({
            url: "json/profile-pne-" + id + ".json",
            dataType: 'json',
            async: false,
            success: function(data) {
                var vertices = RANDO.Utils.getVerticesFromProfile(data.profile);
                
                console.log(translateXY);
                vertices = RANDO.Utils.translateRoute(
                    vertices, 
                    translateXY.x, 
                     altitude_offset, 
                    translateXY.y
                );
                troncon_length = vertices.length;
                //console.log(vertices);
                RANDO.Builds.route(scene, vertices);
            }
        });//------------------------------------------------------------
    }   
       
    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
        RANDO.Utils.refreshPanels(troncon_length, scene);
        scene.render();
    });
});
$("#menu .choice:first").click();
