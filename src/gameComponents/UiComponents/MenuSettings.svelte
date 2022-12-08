<script>
    import Card from "../../miscComponents/Card.svelte"
    import CardHeader from "../../miscComponents/CardHeader.svelte"
    import CardContent from "../../miscComponents/CardContent.svelte"
    import Button from "../../miscComponents/Button.svelte"
    import Loader  from "../../miscComponents/Loader.svelte"
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher()

    export let user
    export let token

    const settings = [
        {label: "Sound", value: "sound"},
        {label: "Particle Effects", value: "particle"},
        {label: "Increase Render Distance", value: "ultrarender"}
    ] // Different settings that the user can access

    let settingsValues = {
        "sound": true,
        "particle": true,
        "ultrarender": false
    } // The default values for these settings
    // Server saved vaues will overwrite these

    

    const toggle = (value)=>{ // Toggles a setting
        settingsValues[value] = !settingsValues[value]
        savingEnabled = true // Enable saving because we just changed something
    }

    const save = async ()=>{ // Saves the settings (async as the fetch function is a network request)
        settingsLoading = "Saving..." // Start the loader with text "Saving"

        let result = await fetch(`/api/user/${user}/settings/`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jwt: token,
                settings: settingsValues
            })
        })

        if (result.ok) { // If it was ok, hide the loader and disable saving (because we have just saved)
            settingsLoading = false
            savingEnabled = false
        }

    }

    let savingEnabled = false // Whether or whether not the save buton should be disabled

    let settingsLoading = false
    onMount(async ()=>{
        //Get settings from server
        settingsLoading = "Fetching settings" // Give us some status loading text

        let result = await fetch(`/api/user/${user}/settings/`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let response = await result.json()

        if (response.ok == true) {
            //Success got settings, so act accordingly!
            if (response.settings == false) { // user had no settings so keep defaults
                settingsLoading = false
                return
            }

            settingsValues = response.settings //User did have settings, so lets change them!
            savingEnabled = false

            settingsLoading = false
            return
        }


        //Logged in with an invalid token, so log us out
        localStorage.clear("token")
        dispatch("updateUser", {username: null, token: null})

        settingsLoading = false
    })

</script>

{#if settingsLoading}
    <Loader text={settingsLoading} />
{/if}
<Card centered=true>
    <CardHeader> Gorbino's Quest - Settings </CardHeader>
    <CardContent>
        <p>Click the buttons below to toggle the options!</p>

        {#each settings as setting}
            <Button success={settingsValues[setting.value]} text="{setting.label} | {settingsValues[setting.value]?"Enabled":"Disabled"}" on:click={()=>{toggle(setting.value)}} />
        {/each}

        <Button success=true disabled={!savingEnabled} text="Save" on:click={ save } />
        <Button discreet=true text="Back" on:click={ ()=>{dispatch("changePage", "home")}} />
    </CardContent>
</Card>