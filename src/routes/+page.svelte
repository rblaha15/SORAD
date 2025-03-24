<script lang="ts">
    import Questionnaire from "./Questionnaire.svelte";
    import {onMount} from "svelte";
    import {getEmail} from "$lib/auth";
    import {allData, type Data} from "$lib/data";

    let data = $state<Data>();
    onMount(async () => {
        const email = await getEmail()
        if (email)
            data = await allData(email)
        else
            window.location.replace('/login')
    })
</script>

{#if data === undefined}
    <span class="loader"></span>
{:else}
    <Questionnaire {data}/>
{/if}