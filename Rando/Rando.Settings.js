// Rando.Settings.js 
// General settings  

var RANDO = RANDO || {};
RANDO.SETTINGS = {};


RANDO.SETTINGS.ID_SCENE ; // Id of the scene

// Camera 
RANDO.SETTINGS.CAM_OFFSET = 50; // Camera's altitude offset (in meters)

RANDO.SETTINGS.CAM_SPEED_T = 1.8; // Camera speed in Trek following mode (from 0 to 2)
RANDO.SETTINGS.CAM_SPEED_F = 99;  // Camera speed in Flying mode(from 0 to infinity !) 

// Trek
RANDO.SETTINGS.TREK_OFFSET = 2; // Trek's altitude offset (in meters)

RANDO.SETTINGS.TREK_COLOR = new BABYLON.Color3(0.1,0.6,0.2); // Trek color (green)
                 // new BABYLON.Color3(0.8,0,0.2); // fuschia
                 // new BABYLON.Color3(0.9,0.5,0); // orange
                 
RANDO.SETTINGS.TREK_WIDTH = 3; // Trek width (in meters)
