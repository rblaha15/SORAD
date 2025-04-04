<script lang="ts">

    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import type {Class} from "$lib/database";
    import BasicLayout from "$lib/components/BasicLayout.svelte";

    let classes = $state<Class[]>([])

    const refresh = async () => {
        classes = await database.admin.getClasses()
    }
    onMount(refresh)
</script>


{#snippet title()}
    SO-RA-D <br/>
    <span style="font-size: 1rem">Sociometricko-ratingový dotazník</span>
{/snippet}
{#snippet content()}
    <h5>Třídy:</h5>
    {#each classes as klass}
        <a class="btn blue" href="/admin/?class={klass.id}">{klass.name} ({klass.grade})</a>
    {/each}
{/snippet}
{#snippet buttons()}
    <button class="grey" onclick={database.auth.logOut} style="margin-right: 'auto';">Odhlásit</button>
{/snippet}

<BasicLayout {title} {content} {buttons} />