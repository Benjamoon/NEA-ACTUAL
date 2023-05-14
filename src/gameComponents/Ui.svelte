<script>
	import WinScreen from './UiComponents/WinScreen.svelte';
    import Menu from "./UiComponents/Menu.svelte"
    import LoadScreen from "./UiComponents/LoadScreen.svelte"
    import { onMount } from 'svelte';

    export let user
    export let token
    export let gameState

    export let loadingDebug


</script>

<div class="uiContainer">
    {#if gameState=="Menu"}
        <Menu user={user} token={token} on:updateUser on:updateGameState/>
    {/if}
    {#if gameState=="Load"}
        <LoadScreen user={user} loadingDebug={loadingDebug} />
    {/if}
    {#if gameState=="Win"}
        <WinScreen />
    {/if}
</div>

<style>
    .uiContainer {
        width: 100vw;
        height: 100vh;

        z-index: 999;
    }
</style>