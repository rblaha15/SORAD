<script lang="ts">
    import Questionnaire from "$lib/components/questionnaire/Questionnaire.svelte";
    import {onMount} from "svelte";
    import {allData, type Data, isAdmin} from "$lib/data";
    import database from "$lib/database/supabase";
    import Tutorial from "$lib/components/questionnaire/Tutorial.svelte";
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";
    import BasicLayout from "$lib/components/BasicLayout.svelte";

    let data = $state<Data | null>();
    onMount(async () => {
        const email = await database.auth.getEmail()
        if (email) {
            try {
                if (isAdmin(email))
                    window.location.replace('/admin')
                else
                    data = await allData(email)
            } catch (e) {
                data = null
            }
        } else window.location.replace('/login')
    })
</script>

{#if data === undefined}
    <span class="loader"></span>
{:else if data === null}
    <BasicLayout>
        {#snippet content()}
            <p>V této třídě aktuálně neprobíhá sběr dat.</p>
        {/snippet}
        {#snippet buttons()}
            <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
        {/snippet}
    </BasicLayout>
{:else}
    <Questionnaire {data}/>
{/if}