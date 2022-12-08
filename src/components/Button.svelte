<script>

    import { createEventDispatcher } from "svelte";

    export let text
    export let success
    export let discreet

    const dispatch = createEventDispatcher()

    const clicked = ()=>{
        dispatch("click")
    }

</script>

<div class="button" on:click={clicked} class:success={success} class:discreet={discreet}>
    <div class="buttonText">{text}</div>
</div>

<style>
    .button {
        margin-top: 1vh;
        padding: 0.2vh;
        display: flex;
        
        transition: 0.3s;

        align-items: center;
        justify-content: center;

        border-radius: 20px;

        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        cursor: pointer;

    }

    .button:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

    .discreet {
        box-shadow: none;
        text-decoration: underline;
        color: rgba(113, 203, 238, 0.952);
    }

    .discreet:hover {
        box-shadow: none;
        color: rgba(94, 163, 190, 0.952);
        transform: scale(1.05);
    }

    .success {
        border: 1px rgb(70, 204, 92) solid;
    }

    .success:hover {
        border: 1px rgb(126, 219, 141) solid;
        transform: scale(1.05);
    }

    .buttonText {
        
    }
</style>