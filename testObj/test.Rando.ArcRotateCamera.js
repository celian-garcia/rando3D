var assert = chai.assert;

describe('Geotrek 3D - ArcRotateCamera Object', function () {
    var camera = new RANDO.ArcRotateCamera(
        "Test Camera",
        0, 0, 0,
        BABYLON.Vector3.Zero(),
        scene
    );
    it("setPosition() should place the camera to (-20, 10, -20).", function (done) {
        var newPosition = new BABYLON.Vector3(
            -20, 10, -20
        );

        camera.setPosition(newPosition);
        scene.render();

        assert.closeTo(camera.position.x , newPosition.x, 0.00001);
        assert.closeTo(camera.position.y , newPosition.y, 0.00001);
        assert.closeTo(camera.position.z , newPosition.z, 0.00001);
        done();
    });

    it("setPosition() should place the camera to (20, 10, -20).", function (done) {
        var newPosition = new BABYLON.Vector3(
            20, 10, -20
        );

        camera.setPosition(newPosition);
        scene.render();

        assert.closeTo(camera.position.x , newPosition.x, 0.00001);
        assert.closeTo(camera.position.y , newPosition.y, 0.00001);
        assert.closeTo(camera.position.z , newPosition.z, 0.00001);
        done();
    });

    it("setPosition() should place the camera to (-20, 10, 20).", function (done) {
        var newPosition = new BABYLON.Vector3(
            -20, 10, 20
        );

        camera.setPosition(newPosition);
        scene.render();

        assert.closeTo(camera.position.x , newPosition.x, 0.00001);
        assert.closeTo(camera.position.y , newPosition.y, 0.00001);
        assert.closeTo(camera.position.z , newPosition.z, 0.00001);
        done();
    });

    it("setPosition() should place the camera to (20, 10, 20).", function (done) {
        var newPosition = new BABYLON.Vector3(
            20, 10, 20
        );

        camera.setPosition(newPosition);
        scene.render();

        assert.closeTo(camera.position.x , newPosition.x, 0.00001);
        assert.closeTo(camera.position.y , newPosition.y, 0.00001);
        assert.closeTo(camera.position.z , newPosition.z, 0.00001);
        done();
    });

});
