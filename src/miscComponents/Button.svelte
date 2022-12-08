<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    
    export let text
    export let success
    export let discreet
    export let disabled = false

    // On a click, check if we are disabled.
    // If we arent, pass the event up
    const clicked = ()=>{
        if (disabled) return;
        dispatch("click")
    }
</script>

<div class="button" on:click={clicked} class:success={success} class:discreet={discreet} class:disabled={disabled}>
    <div class="buttonText" >{text}</div>
</div>

<style>
    /* Button styling */
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

    /* Button hover styling */
    .button:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

    /* Discreet Button hover styling */
    .discreet {
        box-shadow: none;
        text-decoration: underline;
        color: rgba(113, 203, 238, 0.952);
    }

    /* Discreet Button hover styling */
    .discreet:hover {
        box-shadow: none;
        color: rgba(94, 163, 190, 0.952);
        transform: scale(1.05);
    }


    /* Success button and hover styling */
    .success {
        border: 1px rgb(70, 204, 92) solid;
    }

    .success:hover {
        border: 1px rgb(126, 219, 141) solid;
        transform: scale(1.05);
    }

    /* Disabled button and hover styling */
    .disabled {
        border: 1px rgb(235, 138, 114) solid;
        transform: scale(0.95);
        cursor: not-allowed !important;
    }

    .disabled:hover {
        border: 1px rgb(235, 138, 114) solid;
        transform: scale(0.95);
    }
</style>