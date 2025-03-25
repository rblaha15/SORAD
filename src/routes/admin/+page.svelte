<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type {Class} from "$lib/database";
    import {onMount} from "svelte";
    import database from "$lib/database/supabase";

    let classes = $state<Class[]>([])

    const refresh = async () => {
        classes = await database.admin.getClasses()
    }
    onMount(refresh)
</script>
<BasicLayout>
    {#snippet title()}
        SO-RA-D <br/>
        <span style="font-size: 1rem">Sociometricko-ratingový dotazník</span>
    {/snippet}
    {#snippet content()}
        <h5>Třídy:</h5>
        {#each classes as klass}
            <p><a href="/admin/class/{klass.id}">{klass.name} ({klass.grade})</a></p>
        {/each}
    {/snippet}
    {#snippet buttons()}{/snippet}
</BasicLayout>