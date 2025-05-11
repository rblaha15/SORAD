<script lang="ts">
    import { onMount } from "svelte";
    import database from "$lib/database/supabase";
    import type { Class } from "$lib/database";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import { goto } from "$app/navigation";

    let classes = $state<Class[]>([])

    const refresh = async () => {
        classes = await database.admin.getClasses()
        return classes
    }
    onMount(refresh)

    const newClass = async () => {
        await database.admin.setClass({ enabled: false, name: '', grade: -1 })
        const classes = await refresh()
        const newClass = classes.find(c => c.grade == -1)
        if (newClass) return await goto(`/admin/?class=${newClass.id}`, { replaceState: false })
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
                <a class={{enabled: klass.enabled}} href="/admin/?class={klass.id}" data-sveltekit-replacestate="off">
                    <strong>{klass.name ? klass.name : 'Nová třída'}</strong>
                </a>
            </li>
        {/each}
    </ul>
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit se</button>
{/snippet}

<title>Administrace: třídy</title>

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