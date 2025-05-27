<script>
  import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';
  import LoginForm from './components/LoginForm/LoginForm.svelte';
  import SignupForm from './components/SignupForm/SignupForm.svelte';
  import RaiderManager from './components/Raidermanager/RaiderManager.svelte';

  let user = null;
  let currentPage = 'login';

  async function getUser() {
    const res = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      user = data.user;
      currentPage = user.isAdmin === 'true' ? 'admin' : 'profile';
    }
  }

  async function logout() {
    await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    toast.success('Logged out');
    user = null;
    currentPage = 'login';
  }

  onMount(getUser);
</script>

<Toaster />
{#if currentPage === 'login'}
<h2>Welcome to the WoW Loot System</h2>
  <LoginForm
    on:loginSuccess={() => getUser()}
    on:signupRequested={() => (currentPage = 'signup')}
  />
{:else if currentPage === 'signup'}
<h2>Please create your player</h2>
  <SignupForm 
  on:signupSuccess={() => (currentPage = 'login')} 
  on:goBack={() => (currentPage = 'login')} 
/>
{:else if currentPage === 'admin'}
  <RaiderManager user={user} on:logout={logout} />
{:else if currentPage === 'profile'}
  <div class="profile">
    <h2>Welcome, {user.username}</h2>
    <p><strong>Rank:</strong> {user.userrank}</p>
    <p><strong>Loot received:</strong> {user.amountofLoot}</p>
    <button on:click={logout}>Logout</button>
  </div>
{/if}

