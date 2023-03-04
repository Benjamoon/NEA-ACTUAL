<script defer>
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from "three";
    import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

    const dispatch = createEventDispatcher();

    export let gameState;

    let currentScene = "menu";

    let controls;
    let renderer;
    const scenes = {};
    const cameras = {};
    const animationThreads = {};

    let cameraObjects = {} //Children of the camera (player)
    let enemies = [] //enemies

    //Settings
    const levelSize = 30;
    const levelWallHeight = 5.0;

    const controlKeysDown = {};

    const setupPlayControls = () => {
        controls = new PointerLockControls(cameras.play, renderer.domElement);
        controls.addEventListener("lock", () => {
            console.log("Lock");
        });

        window.addEventListener("mousedown", (e) => {
            if (gameState == "Play") {
                controls.lock();
            }
            if (gameState == "Play" && controls.isLocked) {
                console.log(e.button)
                controlKeysDown[e.button] = true;
            } 
        });

        window.addEventListener("mouseup", (e)=>{
            if (gameState == "Play" && controls.isLocked) {
                controlKeysDown[e.button] = false;
            } 
        })

        window.addEventListener("keydown", (e) => {
            console.log("down", e.key);
            if (gameState == "Play" && controls.isLocked) {
                controlKeysDown[e.key.toLowerCase()] = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            console.log("up", e.key);
            controlKeysDown[e.key.toLowerCase()] = false;
        });
    };

    const checkCollision = () => {};

    let lastShot = +new Date();

    const projectileGeoAndMat = {
        geo: new THREE.SphereGeometry( 0.1, 0.2, 3 ),
        mat: new THREE.MeshPhongMaterial({
            shininess: 100,
            color: 0x0
        })
    }

    let projectiles = [] //Current Projectiles In the world

    const attemptShoot = () => {
        const now = +new Date();
        if (now - lastShot < 200) { // shooting interval
            return
        }
        lastShot = now;

        const newProjectile = new THREE.Mesh(projectileGeoAndMat.geo, projectileGeoAndMat.mat);

        newProjectile.position.copy(cameras.play.position)
        newProjectile.rotation.copy(cameras.play.rotation)
        newProjectile.translateX(0.2)
        newProjectile.translateY(-0.2)
        newProjectile.translateZ(-0.2)

        scenes.play.add(newProjectile)

        projectiles.push({
            object: newProjectile,
            time: now
        })
    }

    var enemyTexture = new THREE.TextureLoader().load( "textures/enemies/0.png" );
    var enemyMaterial = new THREE.SpriteMaterial( { map: enemyTexture, color: 0xffffff } );


    const enemyLoop = ()=> {
        if (enemies.length <= 10) {
            console.log("Spawn enemny")
            var sprite = new THREE.Sprite( enemyMaterial );
            sprite.scale.set(4, 4, 4)
            scenes.play.add(sprite)
            enemies.push(sprite)
        }
    }

    
    animationThreads.play = () => {
        const lastX = cameras.play.position.x;
        const lastY = cameras.play.position.x;

        let speed = 0.1;
        if (controlKeysDown["shift"]) {
            console.log("Increase!");
            speed = 0.15;
        }

        if (controlKeysDown["w"]) {
            cameras.play.translateZ(-speed);
        }
        if (controlKeysDown["s"]) {
            cameras.play.translateZ(speed);
        }
        if (controlKeysDown["d"]) {
            cameras.play.translateX(speed);
        }
        if (controlKeysDown["a"]) {
            cameras.play.translateX(-speed);
        }
        if (
            cameras.play.position.x != lastX ||
            cameras.play.position.y != lastY
        ) {
            //reset height, disallow height changes (workaround for now)
            cameras.play.position.y = 2;

            checkCollision();
        }
        //End of movement

        if (controlKeysDown[0]) { //Left Click
            attemptShoot()
        }

        //Handle enemy movement and spawning
        enemyLoop()

        //Handle projectiles
        const now = +new Date()
        projectiles.forEach((projectile, index)=>{

            //Perform raycast to see if we hit something in the next jump...
            var forwardVector = new THREE.Vector3( 0, 0, -1 );
            forwardVector.applyQuaternion( projectile.object.quaternion );
            const raycaster = new THREE.Raycaster(projectile.object.position, forwardVector, 0.01, 1);
            raycaster.camera = cameras.play
            const intersects = raycaster.intersectObjects( scenes.play.children );

            if (intersects.length > 0) {
                const obj = intersects[0]

                console.log("Hit!", obj)
                scenes.play.remove(projectile.object)
                delete projectiles[index]
            }


            projectile.object.translateZ(-0.85)
            
            if (now - projectile.time > 2000) { // Older than 2 seconds
                scenes.play.remove(projectile.object)
                delete projectiles[index]
            }

        })

    };

    function animate() {
        requestAnimationFrame(animate);

        console.log(currentScene);

        if (animationThreads[currentScene]) {
            animationThreads[currentScene]();
        }

        renderer.render(scenes[currentScene], cameras[currentScene]);
    }

    onMount(() => {
        const canvasElement = document.getElementById("renderContent");

        //three.js
        renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            logarithmicDepthBuffer: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        //Menu

        const menuObjects = {};
        scenes.menu = new THREE.Scene();
        cameras.menu = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const geometry2 = new THREE.BoxGeometry(1, 1, 1);
        const material2 = new THREE.MeshBasicMaterial({ color: 0xec3d18 });
        menuObjects.cube = new THREE.Mesh(geometry2, material2);
        scenes.menu.add(menuObjects.cube);
        cameras.menu.position.z = 3;

        animationThreads.menu = () => {
            menuObjects.cube.rotation.x += 0.1;
            menuObjects.cube.rotation.y += 0.1;
        };

        //Make loading camera.
        //Load
        scenes.load = new THREE.Scene();
        cameras.load = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        animate();
    });

    const loadGame = async () => {
        scenes.play = new THREE.Scene();
        cameras.play = new THREE.PerspectiveCamera(
            105,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        cameras.play.position.y = 2;
        const playObjects = {};

        const floorGeometry = new THREE.BoxGeometry(levelSize+0.01, 0.1, levelSize+0.01);
        const floorMaterial = CreateMaterialFromPBR("floor", [3, 3]);
        floorMaterial.side = THREE.BackSide;
        playObjects.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        scenes.play.add(playObjects.floor).position.y = -2;

        const ceilGeometry = new THREE.BoxGeometry(levelSize+0.01, 0.1, levelSize+0.01);
        const ceilMaterial = CreateMaterialFromPBR("ceil", [6, 6]);
        ceilMaterial.side = THREE.DoubleSide;
        playObjects.ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
        playObjects.ceil.translateY(levelWallHeight-0.1)
        scenes.play.add(playObjects.ceil);

        //Boundary walls
        const shape = new THREE.Shape();
        shape.moveTo(-(levelSize / 2), -(levelSize / 2));
        shape.lineTo(-(levelSize / 2), levelSize / 2);
        shape.lineTo(levelSize / 2, levelSize / 2);
        shape.lineTo(levelSize / 2, -(levelSize / 2));
        shape.lineTo(-(levelSize / 2), -(levelSize / 2));

        const extrudeSettings = {
            steps: 2,
            depth: levelWallHeight,
            bevelEnabled: false,
        };

        const wallGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const wallMaterial = CreateMaterialFromPBR("wall", [1,1]);
        wallMaterial.side = THREE.BackSide;
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

        setupPlayControls();

        wallMesh.rotateX(THREE.MathUtils.degToRad(-90));
        wallMesh.translateZ(-0.1)
        scenes.play.add(wallMesh);

        //Lights
        //Ambient
        const color = 0xFFFFFF;
        const intensity = 0.2;
        const light = new THREE.AmbientLight(color, intensity);
        scenes.play.add(light)

        

        //flashlightFlashLightThing

        cameraObjects["gun"] = new THREE.Mesh( 
            new THREE.SphereGeometry( 0.1, 3, 3 ), 
            CreateMaterialFromPBR("wall", [1,1])
        );

        cameraObjects["gun"].position.set(0.2, -0.2, -0.2)
        cameras.play.add(cameraObjects["gun"])

        cameraObjects["flashlight"] = new THREE.SpotLight( 0xffffff, 0.5, 67.2, 0.7);
        cameraObjects["flashlight"].castShadow = true;
        cameraObjects["flashlight"].target.position.set(0.2, -0.2, -10)

        cameraObjects["gun"].add(cameraObjects["flashlight"].target)
        cameraObjects["gun"].add(cameraObjects["flashlight"])

        scenes.play.add(cameras.play)
        dispatch("updateGameState", "Play");
    };

    $: {
        switch (gameState) {
            case "Load":
                currentScene = "load";
                loadGame();
                break;
            case "Play":
                console.log("Somehow got to play, couldnt tell ya how");
                currentScene = "play";
                controls.lock();
        }
    }

    function CreateMaterialFromPBR(name, tiling) {
        const Tiling = tiling || [1, 1];
        const textures = {};
        textures.col = new THREE.TextureLoader().load(
            "textures/"+name+"/col.jpg"
        );
        textures.col.wrapS = THREE.RepeatWrapping;
        textures.col.wrapT = THREE.RepeatWrapping;
        textures.col.repeat.set(Tiling[0], Tiling[1]);
        textures.bump = new THREE.TextureLoader().load(
            "textures/"+name+"/bump.jpg"
        );
        textures.bump.wrapS = THREE.RepeatWrapping;
        textures.bump.wrapT = THREE.RepeatWrapping;
        textures.bump.repeat.set(Tiling[0], Tiling[1]);
        textures.ao = new THREE.TextureLoader().load(
            "textures/"+name+"/ao.jpg"
        );
        textures.ao.wrapS = THREE.RepeatWrapping;
        textures.ao.wrapT = THREE.RepeatWrapping;
        textures.ao.repeat.set(Tiling[0], Tiling[1]);
        return new THREE.MeshPhongMaterial({
            map: textures.col,
            aoMap: textures.ao,
            bumpMap: textures.bump,
        });
    }
</script>

<canvas id="renderContent" />

<style>
    #renderContent {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: -1;
    }
</style>
