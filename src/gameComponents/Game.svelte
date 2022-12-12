<script>
    import Ui from "./Ui.svelte"
    import Render from "./Render.svelte"

    export let user
    export let token

    let gameState = "Menu"

    $: console.log("Game state changed: ", gameState)
    const updateGameState = (evt)=>{
        console.log("Got event", evt)
        gameState = evt.detail
    }


    //Loading Debug
    let loadingDebug = ""

    const setLoadingDebug = (evt)=>{
        loadingDebug=evt.detail
    }

</script>

<div class="gameContainer">

    <Ui user={user} token={token} gameState={gameState} loadingDebug={loadingDebug} on:updateGameState={updateGameState} on:updateUser/>

    <Render 
        user={user} 
        token={token} 
        gameState={gameState} 
        on:updateGameState={updateGameState} 
        on:setLoadingDebug={setLoadingDebug}
    />

</div>

<style>
    .gameContainer {
        display: fixed;
        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;
    }

    .gameContainer > * {
        display: fixed;
        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;
    }
</style>
