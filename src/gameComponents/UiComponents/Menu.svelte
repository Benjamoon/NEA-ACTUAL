<script>
    import MenuHome from "./MenuHome.svelte"
    import MenuSettings from "./MenuSettings.svelte";

    export let user
    export let token

    let menuPage = "home"

    const changePage = (evt) => {
        menuPage = evt.detail
    }

</script>

<div class="mainMenuContainer">
    {#if menuPage == "home"}
        <MenuHome token={token} user={user} on:updateUser on:updateGameState on:changePage={changePage}/>
    {/if}
    {#if menuPage == "settings"}
        <MenuSettings token={token} user={user} on:updateUser on:changePage={changePage}/>
    {/if}
</div>

<style>
    .mainMenuContainer {
        width: 100vw;
        height: 100vh;
    }

    .mainMenuContainer > * {
        width: 100vw;
        height: 100vh;
    }
</style>