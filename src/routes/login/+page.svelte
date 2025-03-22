<script lang="ts">
    import {studentId} from "$lib/auth";
    import {browser} from "$app/environment";

    let value = $state('')

    if ($studentId != undefined && browser)
        window.location.replace('/');
</script>

<label>
    Zadej své ID:
    <input type="text" bind:value />
</label>
<button onclick={() => {$studentId = Number(value); window.location.replace('/');}}>Potvrdit</button>

<style>
    label {
        display: block;
    }
    button {
        margin-top: .5rem;
    }
</style>