<script lang="ts">
    import Questionnaire from "$lib/components/questionnaire/Questionnaire.svelte";
    import {onMount} from "svelte";
    import {allData, type Data, isAdmin} from "$lib/data";
    import database from "$lib/database/supabase";

    let data = $state<Data>();
    onMount(async () => {
        const email = await database.auth.getEmail()
        if (email) {
            data = await allData(email)
            if (isAdmin(email))
                window.location.replace('/admin')
        } else
            window.location.replace('/login')
    })
</script>

{#if data === undefined}
    <span class="loader"></span>
{:else if data}
    <Questionnaire {data}/>
{/if}