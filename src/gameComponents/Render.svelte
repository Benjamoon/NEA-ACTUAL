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

    //Settings
    const levelSize = 30;
    const levelWallHeight = 5.0;

    const controlKeysDown = {};

    const setupPlayControls = () => {
        controls = new PointerLockControls(cameras.play, renderer.domElement);
        controls.addEventListener("lock", () => {
            console.log("Lock");
        });

        window.addEventListener("mousedown", () => {
            if (gameState == "Play") {
                controls.lock();
            }
        });

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
            cameras.play.position.y = 0;
            checkCollision();
        }
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
        const playObjects = {};

        const floorGeometry = new THREE.BoxGeometry(levelSize+0.01, 0.1, levelSize+0.01);
        const floorMaterial = CreateMaterialFromPBR("floor", [3, 3]);
        floorMaterial.side = THREE.BackSide;
        playObjects.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        scenes.play.add(playObjects.floor).position.y = -2;

        const ceilGeometry = new THREE.BoxGeometry(levelSize+0.01, 0.1, levelSize+0.01);
        const ceilMaterial = CreateMaterialFromPBR("floor", [3, 3]);
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
    };

    $: {
        switch (gameState) {
            case "Load":
                currentScene = "load";
                setTimeout(async () => {
                    await loadGame();
                    dispatch("updateGameState", "Play");
                }, 100);
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
        return new THREE.MeshBasicMaterial({
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
