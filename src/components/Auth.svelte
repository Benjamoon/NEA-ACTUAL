<script>
    import GradientBackground from "./GradientBackground.svelte"
    import Card from "./Card.svelte"
    import CardHeader from "./CardHeader.svelte"
    import CardContent from "./CardContent.svelte"
    import Input from "./Input.svelte"
    import Button from "./Button.svelte"
    import Loader from "./Loader.svelte"
    import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

    let username
    let password
    let email
    let loading = ""
    let error = ""

    let isLogin = true

    let toggleText = "Dont have an account, signup!"
    $: {
        toggleText = isLogin? "Dont have an account? Signup!":"Already have an account? Login!"
    }

    let submitText = "Login"
    $: {
        submitText = isLogin? "Login":"Signup"
    }

    const submit = async ()=>{
        if (isLogin) { //Login
            loading = "Checking your details..."

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

            let response = await result.json()

            if (response.ok == true) {
                //Success login!
                loading = ""
                error = ""

                dispatch("updateUser", {username: username, token: response.token})

                return
            }


            //Unsuccessfull login!
            error = "Incorrect username or password!"

            loading = ""
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
        if (!foundToken) {
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

</script>

{#if loading!=""}
    <Loader text={loading} />
{/if}

<GradientBackground>
    <Card centered=true>
        <CardHeader> {submitText} </CardHeader>
        <CardContent>
            <Input label="Username" bind:value={username}/>
            {#if !isLogin}
            <Input label="Email" inputType="email" bind:value={email}/>
            {/if}
            <Input label="Password" inputType="password" bind:value={password}/>
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