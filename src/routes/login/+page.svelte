<script lang="ts">
    import { onMount } from "svelte";
    import database from "$lib/database/supabase";
    import { goto } from "$app/navigation";
    import BasicLayout from "$lib/components/BasicLayout.svelte";

    let code = $state('')
    let error = $state<string>()

    onMount(async () => {
        if (await database.auth.getUserEmail()) await goto('/');
    })

    const logIn = async () => {
        if (!await database.auth.logInWithStudentPassword(code))
            error = 'Kód není správný. Prosím, zkontrolujte, že jste ho zadali správně.'
    }
</script>

<title>SORAD</title>

<BasicLayout>
    {#snippet title()}
        Přihlášení
    {/snippet}
    {#snippet content()}
        <form onsubmit={logIn} class="column">
            <label for="login">Zadejte kód, který vám dal vyučující:</label>
            <div class="row">
                <input value={code} type="text" oninput={e => code = e.currentTarget.value.toUpperCase()} id="login" />
                <button class="primary" type="submit">Potvrdit</button>
            </div>
            {#if error}
            <p>{error}</p>
            {/if}
        </form>
        <span>nebo</span>
        <button class="primary" onclick={database.auth.logInWithMS}>Přihlásit se pomocí školního MS účtu</button>
    {/snippet}
</BasicLayout>

<style>
    .row {
        align-items: stretch;
    }
</style>