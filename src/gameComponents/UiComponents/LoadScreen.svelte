<script>
    import Loader from "../../miscComponents/Loader.svelte"

    export let user
    export let loadingDebug = ""

</script>

<Loader text="Loading! {loadingDebug}"/>