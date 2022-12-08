<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { 
        Scene,
        PerspectiveCamera,
        WebGLRenderer,
        BoxGeometry,
        MeshBasicMaterial,
        Mesh,
        PlaneGeometry
    } from 'three';

    const dispatch = createEventDispatcher()

    export let gameState


    
    let currentScene = "menu"




    onMount(()=>{

        const scenes = {}
        const cameras = {}
        const animationThreads = {}

        const canvasElement = document.getElementById("renderContent") 

    
        //three.js
        const renderer = new WebGLRenderer( {
            canvas: canvasElement
        });
        renderer.setSize( window.innerWidth, window.innerHeight );

        //Menu

        const menuObjects = {}
        scenes.menu = new Scene
        cameras.menu = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        const geometry = new BoxGeometry( 1, 1, 1 ); 
        const material = new MeshBasicMaterial( { color: 0x00ff00 } ); 
        menuObjects.cube = new Mesh( geometry, material ); 
        scenes.menu.add( menuObjects.cube ); 
        cameras.menu.position.z = 3;

        animationThreads.menu = () =>{
            menuObjects.cube.rotation.x += 0.01;
            menuObjects.cube.rotation.y += 0.01;
        }

        //Load
        scenes.load = new Scene
        cameras.load = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

        //create the gameplay scene so we can start generating map content
        scenes.play = new Scene
        cameras.play = new PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000)
        let playObjects = {}

        const loadGame = async ()=>{
            const FloorGeometry = PlaneGeometry(1000, 1000)
            const FloorMaterial = new MeshBasicMaterial( {color: 0xffff00} );
            playObjects.floor_plane = new Mesh(FloorGeometry, FloorMaterial)
            scenes.play.add(playObjects.floor_plane)

            return true
        }


        $: {
            switch (gameState) {
                case "Load":
                    currentScene = "load"
                    loadGame()
                    dispatch("updateGameState", "Play")
                case "Play":
                    currentScene = "play"
            }
        }


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