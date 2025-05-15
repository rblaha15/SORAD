<script lang="ts">
    import Questionnaire, { type QuestionnaireData } from "$lib/components/questionnaire/Questionnaire.svelte";
    import { onMount } from "svelte";
    import { isAdmin, isStudent } from "$lib/admin";
    import database from "$lib/database/supabase";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import { goto } from "$app/navigation";

    let data = $state<QuestionnaireData | 'loading' | 'notStudent' | 'noData'>('loading');
    onMount(async () => {
        const email = await database.auth.getUserEmail()

        if (!email) return await goto('/login')
        if (isAdmin(email)) return await goto('/admin')
        if (!isStudent(email)) return data = 'notStudent'

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

<title>SORAD</title>

{#if data === 'loading'}
    <div><span class="loader"></span></div>
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
            <button class="secondary" onclick={database.auth.logOut} >Odhlásit se</button>
        {/snippet}
    </BasicLayout>
{:else}
    <Questionnaire {...data} />
{/if}