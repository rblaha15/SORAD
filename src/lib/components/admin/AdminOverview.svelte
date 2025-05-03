<script lang="ts">

    import {onMount} from "svelte";
    import database from "$lib/database/supabase";
    import type {Class} from "$lib/database";
    import BasicLayout from "$lib/components/BasicLayout.svelte";

    let classes = $state<Class[]>([])

    const refresh = async () => {
        classes = await database.admin.getClasses()
        const newClass = classes.find(c => c.grade == -1)
        if (newClass) location.assign(`/admin/?class=${newClass.id}`)
    }
    onMount(refresh)

    const newClass = async () => {
        await database.admin.setClass({ enabled: false, name: '', grade: -1 })
        await refresh()
    }
</script>


{#snippet title()}
    Administrace: třídy
{/snippet}
{#snippet content()}
    <div class="title">
        <h4>Třídy:</h4>
        <button class="primary" onclick={newClass}>Nová třída</button>
    </div>
    {#each classes as klass}
        <a class="btn primary" href="/admin/?class={klass.id}">{klass.name} ({klass.grade})</a>
    {/each}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
{/snippet}

<BasicLayout {title} {content} {buttons} />

<style>
    .title {
        display: flex;
        align-items: center;
        h4 {
            margin-right: 1rem;
        }
    }
</style>