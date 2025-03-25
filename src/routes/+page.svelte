<script lang="ts">
    import Questionnaire from "$lib/components/Questionnaire.svelte";
    import {onMount} from "svelte";
    import {getEmail} from "$lib/auth";
    import {allData, type Data, isAdmin} from "$lib/data";
    import Administration from "$lib/components/Administration.svelte";

    let data = $state<Data>();
    let admin = $state<boolean>();
    onMount(async () => {
        const email = await getEmail()
        if (email) {
            data = await allData(email)
            admin = isAdmin(email)
        } else
            window.location.replace('/login')
    })
</script>

{#if data === undefined && !admin}
    <span class="loader"></span>
{:else if admin}
    <Administration />
{:else if data}
    <Questionnaire {data}/>
{/if}