<script>
    //export
    export let centered = false; //Should the card be centered?
</script>

<div class:centered={centered}>
    <div class="card">
        <slot />
    </div>
</div>

<style>
    .centered {
        /* Set the containers size to max */
        width: 100%;
        height: 100%;

        /* Set the display to flex */
        display: flex;

        /* Center the content within */
        align-items: center;
        justify-content: center;
    }

    .card {
        /* A small box shadow, to give it some depth */
        box-shadow: 0 4px 8px 0 rgba(255, 147, 147, 0.2);
        /* Transition for the hover effect */
        transition: 0.3s;

        /* Apply a white background color and round the edges */
        background-color: white;
        border-radius: 10%;

        /* Give the content some padding */
        padding: 30px
    }

    /* On card hover */
    .card:hover {
        /* Increase the darkness of the box shadow on hover */
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        /* Make the card and its content slightly larger on hover */
        transform: scale(1.05);
    }
</style>

