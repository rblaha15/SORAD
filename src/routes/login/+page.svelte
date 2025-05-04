<script lang="ts">
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";

    let code = $state('')
    let error = $state<string>()

    onMount(async () => {
        if (await database.auth.getEmail()) window.location.replace(window.location.origin);
    })

    const logIn = async () => {
        if (!await database.auth.logInWithStudentPassword(code))
            error = 'Kód není správný. Prosím, zkontrolujte, že jste ho zadali správně.'
    }
</script>

<div class="content">
    <form onsubmit={logIn}>
        <div class="row">
            <label>
                Zadej své ID:
                <input value={code} type="text" oninput={e => code = e.currentTarget.value.toUpperCase()}/>
            </label>
            <button class="primary" type="submit">Potvrdit</button>
        </div>
        <p>{error}</p>
    </form>
    <div class="row">
        <hr/>
        <span>nebo</span>
        <hr/>
    </div>
    <button class="primary" onclick={database.auth.logInWithMS}>Přihlásit se pomocí školního MS účtu</button>
</div>

<style>
    .content {
        padding: 1rem;

        form {
            label {
                display: block;

                input {
                    margin: 0 .375rem;
                }
            }

            p {
                margin: .375rem 0 0;
            }
        }


        hr {
            flex-grow: 1;
            margin: 1rem;
        }
    }
</style>