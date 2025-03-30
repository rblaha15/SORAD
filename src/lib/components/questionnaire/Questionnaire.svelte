<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import {pushState} from "$app/navigation";
    import Tutorial from "./Tutorial.svelte";
    import {storeable, value} from "$lib/stores";
    import {type Data, defaultRating, getRatingGroups, validateRating} from "$lib/data";
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import database from "$lib/database/supabase";
    import type {Rating, Student} from "$lib/database";

    let {data}: { data: Data } = $props()

    const currentGroupNumber = $derived((browser ? page.state : {}).group ?? -1) as -1 | 0 | 1 | 2 | 3

    const myId = data.myself.id;

    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    const currentGroup = $derived(getRatingGroups(data.myself, data.students)[currentGroupNumber] ?? [])

    const thisRating = (student: Student) => (r: Rating) => r.about == student.id;

    const groupRatings = $derived(currentGroup.map(student => ({
        student,
        rating: value({
            get: () => $savedData[$savedData.findIndex(thisRating(student))!],
            set: newRating =>
                $savedData = $savedData.toSpliced($savedData.findIndex(thisRating(student)), 1, newRating),
        }),
    })))

    let showErrors = $state(false)
    const noError = $derived(groupRatings.every(({rating}) => validateRating(rating.current)))
    $effect(() => {
        if (noError) showErrors = false
    })

    const back = () => pushState('', {group: currentGroupNumber - 1})
    const next = () => noError
        ? pushState('', {group: currentGroupNumber + 1})
        : showErrors = true
    const send = () => noError
        ? database.rate($savedData)
        : showErrors = true

    const tve = data.myClass.grade > 4 ? 'Vaše' : 'Tvé'
    const i = data.myClass.grade > 4 ? 'te' : 'i'
</script>

<BasicLayout>
    {#snippet title()}
        Třída: {data.myClass.name}
    {/snippet}
    {#snippet content()}
        {#if data.alreadyRated}
            <p>Js{i} přihlášen jako {data.myself.names} {data.myself.surname}.</p>
            <p>Hotovo! {tve} odpovědi byly odeslány.</p>
        {:else if !data.myClass.enabled}
            <p>Js{i} přihlášen jako {data.myself.names} {data.myself.surname}.</p>
            <p>V této třídě aktuálně neprobíhá sběr dat.</p>
        {:else if currentGroupNumber === -1}
            <p>Js{i} přihlášen jako {data.myself.names} {data.myself.surname}.</p>
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade}/>
        {:else}
            <div class="student-group">
                <span class="main-title"></span>
                <span class="main-title">Vliv:</span>
                <span class="main-title">Sympatie:</span>
                <span class="main-title">Důvod:</span>
                {#each groupRatings as {student, rating}}
                    <StudentRow {student} bind:rating={rating.current} {showErrors}/>
                {/each}
            </div>
        {/if}
    {/snippet}
    {#snippet buttons()}
        {#if data.alreadyRated || !data.myClass.enabled}{:else if currentGroupNumber === -1}
            <button onclick={() => pushState('', {group: 0})}>Začít!</button>
        {:else}
            <button class="grey" onclick={back}>Zpět</button>
            {#if currentGroupNumber === 3}
                <button class="red" onclick={send}>Odeslat</button>
            {:else}
                <button onclick={next}>Další</button>
            {/if}
        {/if}
    {/snippet}
</BasicLayout>

<style>
    .student-group {
        display: grid;
        grid-template-columns: 1fr;

        .main-title {
            display: none;
        }

        @media only screen and (min-width: 400px) {
            grid-template-columns: 0fr auto 50%;
            grid-auto-flow: dense;
        }
        @media only screen and (min-width: 500px) {
            grid-template-columns: 0fr 1fr 0fr 1fr;
        }
        @media only screen and (min-width: 800px) {
            grid-template-columns: 0fr 0fr 0fr 1fr;

            .main-title {
                display: inline;
                margin-left: .5rem;
            }
        }
    }
</style>