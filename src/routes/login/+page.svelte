<script lang="ts">
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";

    let code = $state('P6PMSP')
    let error = $state<string>()

    onMount(async () => {
        if (await database.auth.getEmail()) window.location.replace(window.location.origin);
    })

    const logIn = async () => {
        if (!await database.auth.logInWithStudentPassword(code))
            error = 'Kód, není správný. Prosím, zkontrolujte, že jste ho zadali správně.'
    }
</script>

<div class="content">
    <form onsubmit={logIn}>
        <div class="row">
            <label>
                Zadej své ID:
                <input bind:value={code} type="text"/>
            </label>
            <button class="blue" type="submit">Potvrdit</button>
        </div>
        <p>{error}</p>
    </form>
    <div class="row">
        <hr/>
        <span>nebo</span>
        <hr/>
    </div>
    <button class="blue" onclick={database.auth.logInWithMS}>Přihlásit se pomocí školního MS účtu</button>
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