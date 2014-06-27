var assert = chai.assert;

describe('Geotrek 3D - ExamineCamera Object', function () {
    describe('Set position function - this.setPosition()', function (done) {
        var camera = new RANDO.ExamineCamera(
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

    describe('Coordinates conversion : Spheric to Cartesian - this.sphericToCartesian()', function (done) {
        var sphericCoordinates = {
            'alpha' : Math.PI/2,
            'beta': Math.PI/2,
            'radius' : 40
        };

        it ("should return {x: 0, y: 0, z: 0}", function (done) {
            var vector3 = RANDO.ExamineCamera.sphericToCartesian(0, 0, 0);
            assert.equal(vector3.x, 0);
            assert.equal(vector3.y, 0);
            assert.equal(vector3.z, 0);
            done();
        });

        it ("should return {x: 0, y: 0, z: 0} (with alpha and beta different from 0)", function (done) {
            var vector3 = RANDO.ExamineCamera.sphericToCartesian(10, 2, 0);
            assert.equal(vector3.x, 0);
            assert.equal(vector3.y, 0);
            assert.equal(vector3.z, 0);
            done();
        });

        it ("should return {x: 0, y: 0, z: 0} translated of the center value of {x: 20, y: 4000, z: -5}", function (done) {
            var vector3 = RANDO.ExamineCamera.sphericToCartesian(0, 0, 0, new BABYLON.Vector3(20, 4000, -5));
            assert.equal(vector3.x, 20);
            assert.equal(vector3.y, 4000);
            assert.equal(vector3.z, -5);
            done();
        });
    });
});
