<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import toast from 'svelte-french-toast';

  let username = "";
  let password = "";

  async function signup() {
    const res = await fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      dispatch('signupSuccess');
      toast.success('Sign in succesfull');
    } else {
      const data = await res.json();
      toast.error('Sign in failed');
    }
  }

  function goBack() {
    dispatch('goBack');
  }
</script>

<form on:submit|preventDefault={signup}>
  <input bind:value={username} placeholder="Username" required />
  <input type="password" bind:value={password} placeholder="Password" required />

  <button type="submit">Sign Up</button>
  <button type="button" on:click={goBack}>Back</button>
</form>
