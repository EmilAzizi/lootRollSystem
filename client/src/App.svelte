<script>
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';
  import LoginForm from './components/LoginForm/LoginForm.svelte';
  import RaiderManager from './components/Raidermanager/RaiderManager.svelte';

  let user = null;

  async function getUser() {
    const res = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      user = data.user;
    }
  }

  async function logout() {
    await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    toast.success('Logged out');
    user = null;
    window.location.href = '/'; // or use a router redirect
  }

  onMount(getUser);
</script>

{#if user}
  {#if user.isAdmin === 'true'}
    <!-- Admin sees RaiderManager component -->
    <RaiderManager />
  {:else}
    <!-- Normal user sees their profile -->
    <div class="profile">
      <h2>Welcome, {user.username}</h2>
      <p><strong>Rank:</strong> {user.userrank}</p>
      <p><strong>Loot received:</strong> {user.amountofLoot}</p>
      <button on:click={logout}>Logout</button>
    </div>
  {/if}
{:else}
  <!-- Show login form -->
  <LoginForm on:loginSuccess={getUser} />
{/if}
