<script>
    import Card from "../../miscComponents/Card.svelte" //We need the card component
    import CardHeader from "../../miscComponents/CardHeader.svelte" //its header,
    import CardContent from "../../miscComponents/CardContent.svelte" // and its content
    import Button from "../../miscComponents/Button.svelte" // We also need the button component
    import { createEventDispatcher } from "svelte"; // We will need the ability to create and dispatch events.

    const dispatch = createEventDispatcher()

    export let user

    const logout = ()=>{ //Send the logout event up the chain
        console.log("Logout")
        dispatch("updateUser", {username: "", token: null})
    }
</script>

<Card centered=true>
    <CardHeader> Gorbino's Quest </CardHeader>
    <CardContent>
        <Button success=true text="Play" on:click={ ()=>{dispatch("updateGameState", "Load")}} />
        <Button success=true text="Settings" on:click={ ()=>{dispatch("changePage", "settings")}} />
        <Button discreet=true text="Logout of {user}" on:click={logout} />
    </CardContent>
</Card>

