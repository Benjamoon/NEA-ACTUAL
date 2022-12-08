<script>
    export let label
    export let placeholder = ""
    export let inputType = "text"

    export let value

    // Manually set the type of the input element
    const setType = (node)=>{
        node.type = inputType
    }
</script>

<!-- Container to hold both the label and the input element -->
<div class="inputContainer">
    <!-- Label -->
    <label for="input">{label}</label>
    <!-- Input, using the setType handler to change its type -->
    <!-- The keydown event is also forwarded up the component tree (so the parent gets it) -->
    <input class="input" use:setType id="input" name="fname" placeholder={placeholder} bind:value={value} on:keydown>
</div>

<style>
    .inputContainer {
        /* Add margin to space out consecutive inputs */
        margin-bottom: 10px;
        /* Flex layout to align the label and input */
        display: flex;
        flex-direction: column;
    }
    .input {
        /* Give the input element a rounded border */
        border-radius: 5px;
        border: 1px rgb(134, 133, 133) solid;

        /* Add some padding to distance the text from the border */
        padding: 4px;

        /* Transition for the hover effect */
        transition: all .2s;
    }
    /* On hover */
    .input:hover {
        /* Scale the input up slightly */
        transform: scale(1.01);
    }
    /* When focused */
    .input:focus {
        /* Scale it up even more and add a box shadow */
        transform: scale(1.05);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    }
</style>