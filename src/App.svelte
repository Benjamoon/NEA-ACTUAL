<script>
	import Auth from "./loginComponents/Auth.svelte"
	import Game from "./gameComponents/Game.svelte"

	let user
	let token

	const updateUser = (evt)=>{
		const data = evt.detail
		//Update localstorage
		localStorage.setItem("token", data.token)
		//Update our variables
		user = data.username
		token = data.token
	}

</script>

<main>
	{#if !user}
		<Auth on:updateUser={updateUser}/>
	{:else}
		<Game on:updateUser={updateUser} user={user} token={token}/>
	{/if}
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
	}
</style>