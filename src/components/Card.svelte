<script>
    export let centered = false;
</script>

<div class:centered={centered}>
    <div class="card">
        <slot />
    </div>
</div>

<style>
    .centered {
        width: 100%;
        height: 100%;

        display: flex;

        align-items: center;
        justify-content: center;
    }

    .card {
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;

        background-color: white;
        border-radius: 10%;

        padding: 30px
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        transform: scale(1.05);
    }
</style>