<script>
    import {onMount} from 'svelte';
    import toast from 'svelte-french-toast';

    let raiders = []

    async function fetchRaiders(){
        const res = await fetch('http://localhost:8080/auth/raiders', {
            credentials: 'include'
        });

        if (res.ok) {
            raiders = await res.json();
        } else {
            toast.error("Not authorized to view raiders");
            
        }
    }

    async function incrementLoot(id) {
        const res = await fetch(`http://localhost:8080/auth/user/${id}/increment-loot`, {
            method: 'PATCH',
            credentials: 'include'
        });
        if(res.ok){
            toast.success('Loot increased');
            fetchRaiders();
        }
    }

    async function deleteRaider(id){
        const res = await fetch(`http://localhost:8080/auth/user/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if(res.ok){
            toast.success('Raider deleted');
            fetchRaiders();
        }
    }

    async function changeRank(id, newRank) {
        const res = await fetch(`http://localhost:8080/auth/user/${id}/rank`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({newRank})
        });

        if(res.ok){
            toast.success('Rank updated');
            fetchRaiders();
        }
    }

    onMount(fetchRaiders);
</script>

{#each raiders as raider}
  <div style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;">
    <p><strong>{raider.username}</strong> (Rank: {raider.rank}) - Loot: {raider.amountofLoot}</p>

    <button on:click={() => incrementLoot(raider.id)}>+1 Loot</button>
    <button on:click={() => deleteRaider(raider.id)}>🗑️ Delete</button>

    <select on:change={(e) => changeRank(raider.id, /** @type {HTMLSelectElement} */ (e.target).value)}>
      <option selected disabled>Change rank</option>
      <option value="trial">Trial</option>
      <option value="raider">Raider</option>
      <option value="veteran">Veteran</option>
      <option value="bench">Bench</option>
    </select>
  </div>
{/each}