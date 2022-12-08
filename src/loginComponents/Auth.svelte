<script>
    import GradientBackground from "./GradientBackground.svelte"
    import Card from "../miscComponents/Card.svelte"
    import CardHeader from "../miscComponents/CardHeader.svelte"
    import CardContent from "../miscComponents/CardContent.svelte"
    
    import Input from "./Input.svelte"
    import Button from "../miscComponents/Button.svelte"
    import Loader from "../miscComponents/Loader.svelte"
    import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

    let username
    let password
    let email

    
    let loading = ""
    let error = ""

    // Are we currently on the login form?
    // true = login
    // false = signup
    let isLogin = true

    let toggleText = "Dont have an account, signup!"
    $: {
        toggleText = isLogin? "Dont have an account? Signup!":"Already have an account? Login!"
    }

    // The text to show within the button and the header of the card
    let submitText = "L ogin"
    // Reactive statement
    $: {
        // update submit text
        submitText = isLogin? "Login":"Signup"
    }

    const submit = async ()=>{
        if (isLogin) { //Login
            // Update the loader
            loading = "Checking your details..." 

            // Make the api call and await the result
            let result = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            // Once we get that response, we convert it to json
            let response = await result.json()

            // If the response returned an OK status
            if (response.ok == true) {
                //Success login!
                loading = "" // Get rid of the loader
                error = "" // Clear any errors
                dispatch("updateUser", {username: username, token: response.token}) // update the user on the parent component

                return
            }


            //Unsuccessfull login!
            error = "Incorrect username or password!" //Display error

            loading = "" //Clear loader
            return
        }

        //Signup
        loading = "Lets get you an account sorted!"

        let result = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })

        let response = await result.json()

        if (response.ok == true) {
            //Success signup!
            //Instant login cuz we litteraly just made the account
            error = ""

            dispatch("updateUser", {username: username, token: response.token})
            loading = ""
            return
        }


        //Unsuccessfull signup!
        error = response.err || "Oops... Try again?"

        loading = ""
        return

    }

    const switchType = ()=>{
        isLogin=!isLogin
    }


    //Deal with previously stored account data

    onMount(async ()=>{
        const foundToken = await localStorage.getItem("token")
        console.log(foundToken)
        if (!foundToken || foundToken == "null") {
            loading = ""
            return
        }
        loading = "Verifying found token"

        let result = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jwt: foundToken
            })
        })

        let response = await result.json()

        if (response.ok == true) {
            //Success login!
            loading = ""
            error = ""

            dispatch("updateUser", {username: response.username, token: foundToken})

            return
        }


        //Unsuccessfull login!
        error = "Incorrect or expired token. Please login again!"
        //Clear local storage, since this token doesnt work
        localStorage.clear("token")

        loading = ""
    })


    const keyDown = (e) => {
        if (e.key == "Enter") {
            submit()
        }
    }

</script>

{#if loading!=""}
    <Loader text={loading} />
{/if}

<GradientBackground>
    <Card centered=true>
        <CardHeader> {submitText} </CardHeader>
        <CardContent>
            <Input label="Username" bind:value={username} on:keydown={keyDown}/>
            <!-- Only singup needs email -->
            {#if !isLogin}
            <Input label="Email" inputType="email" bind:value={email} on:keydown={keyDown}/>
            {/if}
            
            <Input label="Password" inputType="password" bind:value={password} on:keydown={keyDown}/>
            <!-- Buttons -->
            <Button success=true text={submitText} on:click={submit}/>
            <p class="error">{error}</p>
            <Button discreet=true text={toggleText} on:click={switchType}/>
        </CardContent>
    </Card>
</GradientBackground>

<style>
    .error {
        color: rgb(219, 67, 67);
        text-align: center;
    }
</style>