<script lang="ts">
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";

    let value = $state('')
    let error = $state<string>()

    onMount(async () => {
        if (await database.auth.getEmail()) window.location.replace(window.location.origin);
    })

    const logIn = async () => {
        if (!await database.auth.logInWithStudentPassword(value))
            error = 'Kód, není správný. Prosím, zkontrolujte, že jste ho zadali správně.'
    }
</script>

<div class="content">
    <form class="row" onsubmit={logIn}>
        <p>{error}</p>
        <label>
            Zadej své ID:
            <input bind:value type="text"/>
        </label>
        <button type="submit">Potvrdit</button>
    </form>
    <div class="row">
        <hr/>
        <span>nebo</span>
        <hr/>
    </div>
    <button onclick={database.auth.logInWithMS}>Přihlásit se pomocí školního MS účtu</button>
</div>

<style>
    .content {
        padding: 1rem;

        form {
            input {
                margin: 0 .375rem;
            }
        }

        label {
            display: block;
        }

        .row {
            display: flex;
            align-items: center;

            hr {
                flex-grow: 1;
                margin: 1rem;
            }
        }
    }
</style>