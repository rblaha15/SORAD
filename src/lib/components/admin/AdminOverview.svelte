<script lang="ts">
    import { onMount } from "svelte";
    import database from "$lib/database/supabase";
    import type { Class } from "$lib/database";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import { goto } from "$app/navigation";

    let classes = $state<Class[]>([])

    const refresh = async () => {
        const _classes = await database.admin.getClasses()
        const newClass = _classes.find(c => c.grade == -1)
        if (newClass) return await goto(`/admin/?class=${newClass.id}`, { replaceState: false })
        classes = _classes
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
    <ul>
        {#each classes as klass}
            <li>
                <a class:enabled={klass.enabled} href="/admin/?class={klass.id}" data-sveltekit-replacestate><strong>{klass.name}</strong></a>
            </li>
        {/each}
    </ul>
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
{/snippet}

<BasicLayout {buttons} {content} {title} />

<style>
    .title {
        display: flex;
        align-items: center;

        h4 {
            margin-right: 1rem;
        }
    }
    a:not(.enabled) {
        color: var(--grey-color)
    }
</style>