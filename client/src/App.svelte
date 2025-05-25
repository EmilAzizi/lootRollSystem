<script>
  import { onMount } from 'svelte';
  import RaiderManager from './components/Raidermanager/RaiderManager.svelte';
  import { Toaster } from 'svelte-french-toast';

  let user = null;

  async function fetchMe() {
    const res = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      user = data.user;
    }
  }

  onMount(fetchMe);
</script>

<Toaster />

{#if user}
  <h1>Welcome, {user.username}</h1>

  {#if user.isAdmin === 'true' || user.isAdmin === true}
    <RaiderManager />
  {:else}
    <p>You are a raider. No admin access.</p>
  {/if}

{:else}
  <p>Please log in.</p>
{/if}
