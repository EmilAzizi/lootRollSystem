<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import toast from 'svelte-french-toast';

  let username = "";
  let password = "";

  function goToSignup() {
  dispatch('signupRequested');
}


  async function login() {
    const res = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      dispatch('loginSuccess');
      toast.success(`Login successfull, welcome, ${username}`);
    } else {
      toast.error('Login failed');
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <input bind:value={username} placeholder="Username" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
  <button type="button" on:click={goToSignup}>Sign Up</button>
</form>