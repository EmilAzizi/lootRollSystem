<script>
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';

	const dispatch = createEventDispatcher();
	let username = '';
	let password = '';

	async function login() {
		const res = await fetch('http://localhost:8080/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			toast.success('Login successful');
			dispatch('loginSuccess');
		} else {
			toast.error('Invalid login');
		}
	}
</script>

<form on:submit|preventDefault={login}>
	<input type="text" bind:value={username} placeholder="Username" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit">Login</button>
</form>
