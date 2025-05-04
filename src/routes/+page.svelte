<script lang="ts">
    import Questionnaire, { type QuestionnaireData } from "$lib/components/questionnaire/Questionnaire.svelte";
    import { onMount } from "svelte";
    import { isAdmin } from "$lib/admin";
    import database from "$lib/database/supabase";
    import BasicLayout from "$lib/components/BasicLayout.svelte";

    let data = $state<QuestionnaireData | 'loading' | 'notStudent' | 'noData'>('loading');
    onMount(async () => {
        const email = await database.auth.getEmail()

        if (!email) return window.location.replace('/login')
        if (isAdmin(email)) return window.location.replace('/admin')
        if (!email.endsWith('@student.gymceska.cz')) return data = 'notStudent'

        try {
            const myself = await database.getStudentByEmail(email)
            data = {
                myself,
                myClass: await database.getMyClass(myself.class),
                students: await database.getStudentsOfClass(myself.class),
                alreadyRated: await database.getAlreadyRated(myself.id),
            };
        } catch (e) {
            data = 'noData'
        }
    })
</script>

{#if data === 'loading'}
    <span class="loader"></span>
{:else if data === 'noData' || data === 'notStudent'}
    <BasicLayout>
        {#snippet content()}
            {#if data === 'noData'}
                <p>V této třídě aktuálně neprobíhá sběr dat.</p>
            {:else if data === 'notStudent'}
                <p>Tento Microsoft účet není podporován.</p>
            {/if}
        {/snippet}
        {#snippet buttons()}
            <button class="secondary" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
        {/snippet}
    </BasicLayout>
{:else}
    <Questionnaire {...data} />
{/if}