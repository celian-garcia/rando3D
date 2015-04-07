(function (jQuery) {
    'use strict';

    var jQuery = jQuery || $;

    var BABYLON = require('babylonjs');
    require('EasePack');
    require('TweenLite');
    require('TimelineLite');
    require('BezierPlugin');
    require('DirectionalRotationPlugin');

    function Rando3D() {

        var RANDO = RANDO || {};

        require('./modules/settings')(RANDO, BABYLON, jQuery);
        require('./modules/dem')(RANDO, BABYLON, jQuery);
        require('./modules/events')(RANDO, jQuery);
        require('./modules/poi')(RANDO, BABYLON, jQuery);
        require('./modules/scene')(RANDO, BABYLON, jQuery);
        require('./modules/tile-container')(RANDO, jQuery);
        require('./modules/trek')(RANDO, BABYLON, jQuery);
        require('./modules/utils')(RANDO, BABYLON, jQuery);
        require('./modules/cameras/camera-computer')(RANDO, BABYLON, jQuery);
        require('./modules/cameras/camera-container')(RANDO, BABYLON, jQuery);
        require('./modules/cameras/bird-camera')(RANDO, BABYLON, jQuery);
        require('./modules/cameras/examine-camera')(RANDO, BABYLON, jQuery);
        require('./modules/cameras/hiker-camera')(RANDO, BABYLON, jQuery);

        function init(customSettings, canvas, cameraID) {

            $.each(customSettings, function (settingName, settingValue) {
                RANDO.SETTINGS[settingName] = settingValue;
            });

            RANDO.START_TIME = Date.now();

            var scene = new RANDO.Scene(canvas, cameraID);

            return scene;
        }

        return {
            init: init
        };

    }

    if (window) {
        window.Rando3D = Rando3D;
    }
})(jQuery);