<script>
    export let text = ""

    import Spinner from "../loginComponents/Spinner.svelte"
</script>

<div class="loader">
    <div class="loaderDetail">
        <Spinner />
        <br>
        <br>
        {text}
    </div>
</div>

<style>
    .loader {
        z-index: 999;
        width: 100vw;
        height: 100vh;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.726);

        display: flex;
        align-items: center;
        justify-content: center;

        color: white;
        text-align: center;
    }
</style>