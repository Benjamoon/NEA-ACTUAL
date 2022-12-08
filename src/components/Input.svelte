<script>
    export let label
    export let placeholder = ""
    export let inputType = "text"

    export let value

    const setType = (node)=>{
        node.type = inputType
    }

</script>

<div class="inputContainer">
    <label for="input">{label}</label>
    <input class="input" use:setType id="input" name="fname" placeholder={placeholder} bind:value={value}>
</div>

<style>
    .inputContainer {
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
    }

    .input {
        border-radius: 5px;
        border: 1px rgb(134, 133, 133) solid;
        padding: 4px;

        transition: all .2s;
    }

    .input:hover {
        transform: scale(1.01);
    }

    .input:focus {
        transform: scale(1.05);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    }

</style>