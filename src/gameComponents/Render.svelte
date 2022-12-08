<script defer>
    import { createEventDispatcher, onMount } from "svelte";
    import * as THREE from 'three';
    import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js"

    const dispatch = createEventDispatcher()

    export let gameState


    
    let currentScene = "menu"

    let controls
    let renderer
    const scenes = {}
    const cameras = {}
    const animationThreads = {}


    //create the gameplay scene so we can start generating map content
        
    scenes.play = new THREE.Scene
    cameras.play = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000)
    const playObjects = {}

    const geometry = new THREE.BoxGeometry( 100, 0.1, 100 ); 

    const texture = new THREE.TextureLoader().load( "textures/floor.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 8, 8 );

    const material = new THREE.MeshBasicMaterial( { map: texture } );
    playObjects.floor = new THREE.Mesh( geometry, material ); 
    scenes.play.add( playObjects.floor ).position.y = -2; 

    const controlKeysDown = {}

    const setupPlayControls = ()=>{
        controls = new PointerLockControls(cameras.play, renderer.domElement)
        controls.addEventListener( 'lock', ()=>{
            console.log("Lock")
        } );

        window.addEventListener("mousedown", ()=>{
            if (gameState == "Play") {
                controls.lock()
            }
        })

        window.addEventListener("keydown", (e)=>{
            console.log("down", e.key)
            if (gameState == "Play" && controls.isLocked) {
                controlKeysDown[e.key.toLowerCase()] = true
            }
        })

        window.addEventListener("keyup", (e)=>{
            console.log("up", e.key)
            controlKeysDown[e.key.toLowerCase()] = false
        })
    }

    const checkCollision = ()=>{
    }

    animationThreads.play = () => {
        const lastX = cameras.play.position.x
        const lastY = cameras.play.position.x

        const speed = 0.1
        if (controlKeysDown["Shift"]) {
            speed = 0.3
        }

        if (controlKeysDown["w"]) {
            cameras.play.translateZ(-speed)
        }
        if (controlKeysDown["s"]) {
            cameras.play.translateZ(speed)
        }
        if (controlKeysDown["d"]) {
            cameras.play.translateX(speed)
        }
        if (controlKeysDown["a"]) {
            cameras.play.translateX(-speed)
        }
        if (cameras.play.position.x != lastX || cameras.play.position.y != lastY) {
            //reset height, disallow height changes (workaround for now)
            cameras.play.position.y = 0
            checkCollision()
        }
    }    



    onMount(()=>{

        const canvasElement = document.getElementById("renderContent") 


        //three.js
        renderer = new THREE.WebGLRenderer( {
            canvas: canvasElement
        });
        renderer.setSize( window.innerWidth, window.innerHeight );
        setupPlayControls()

        //Menu

        const menuObjects = {}
        scenes.menu = new THREE.Scene
        cameras.menu = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xEC3D18 } ); 
        menuObjects.cube = new THREE.Mesh( geometry, material ); 
        scenes.menu.add( menuObjects.cube ); 
        cameras.menu.position.z = 3;

        animationThreads.menu = () =>{
            menuObjects.cube.rotation.x += 0.1;
            menuObjects.cube.rotation.y += 0.1;
        }

        //Load
        scenes.load = new THREE.Scene
        cameras.load = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        
        //render handler
    
        function animate() { 
            requestAnimationFrame( animate ); 

            if (animationThreads[currentScene]) {
                animationThreads[currentScene]()
            }
            
            renderer.render( scenes[currentScene], cameras[currentScene] ); 
        } 
        animate();

    })
    

    $: {

        switch (gameState) {
            case "Load":
                currentScene = "load"
                dispatch("updateGameState", "Play")
            case "Play":
                currentScene = "play"
                controls.lock()
        }
    }


</script>

<canvas id="renderContent"> 

</canvas>

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