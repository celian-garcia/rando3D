/**
 * 
 *  VARIABLES   
 * 
 * */
    var id = 22954; 
    //var id = 20205;
    var step = '20';
    var buff_border = '100';
    var database = 'mercantour';
    var z_offset = 10;
    var b_zone =  true;
    var b_troncon = false;
    
    
/**
 *  Main function    
 * 
 * */
$(function() {
    // Get the Canvas element from our HTML 
    var canvas = document.getElementById("canvas_renderer");
    // Load BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);
    // Scene
    var scene = new BABYLON.Scene(engine);
    // Camera
    var camera = RANDO.Utils.initCamera(scene);
    camera.attachControl(canvas);
    

    if (b_zone){
        // Getting data of DEM----------
        $.ajax({
          url:  "json/dem-pne-2007.json",
          dataType: 'json',
          async: false,
          success: function(data) {
                //var texture =  new BABYLON.Texture("{{ url_for('static', filename='img/texture-8.jpg') }}", scene);
                
                console.log(data);
                
                
                RANDO.Builds.cardinals(data.extent, scene);
                
                
                var vertices = RANDO.Utils.getVertices(data);
                var resolution = data.resolution;
                var center = RANDO.Utils.toMeters(data.center);
                center.z = data.center.z;
                
                var dem_data = {
                    "vertices"  : vertices,
                    "resolution": resolution,
                    "center"    : center
                };
                
                console.log(dem_data);

                // Zone 
                RANDO.Builds.buildZone(scene, dem_data);
                
          }
        });//------------------------------------------------------------
    }
       
    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
        //RANDO.Utils.refreshPanels(troncon.length, scene);
        scene.render();
    });
    
    
});
