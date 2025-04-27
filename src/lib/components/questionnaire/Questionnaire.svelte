<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import { pushState } from "$app/navigation";
    import Tutorial from "./Tutorial.svelte";
    import { storeable, value } from "$lib/stores";
    import { type Data, defaultRating, getRatingGroups, sortedBy, validateRating } from "$lib/data";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import database from "$lib/database/supabase";
    import type { Rating, Student } from "$lib/database";
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";
    import { sortedByDescending } from "$lib/data.js";

    let { data }: { data: Data } = $props()

    const pageState = $derived(browser ? page.state : {})
    const currentStudentId = $derived(pageState.student ?? -1)
    const phase = $derived(pageState.phase ?? 'influence')

    const myId = data.myself.id;

    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    // const phase = $derived(
    //     !$savedData.every(r => r.influence > -1) ? 'influence'
    //         : !$savedData.every(r => r.sympathy > -1) ? 'sympathy'
    //             : 'sympathy-reasoning'
    // )
    const allGroups = $derived(getRatingGroups(data.myself, data.students, phase == 'sympathy-reasoning' ? Number.POSITIVE_INFINITY : 7));
    const currentGroupIndex = $derived(allGroups.findIndex(g => g.some(s => s.id == currentStudentId)))
    const currentGroup = $derived(allGroups[currentGroupIndex] ?? [])

    const thisRating = (student: Student) => (r: Rating) => r.about == student.id;

    const groupRatings = $derived(sortedBy(
        sortedByDescending(
            currentGroup.map(student => ({
                student,
                rating: value({
                    get: () => $savedData[$savedData.findIndex(thisRating(student))!],
                    set: newRating =>
                        $savedData = $savedData.toSpliced($savedData.findIndex(thisRating(student)), 1, newRating),
                }),
            })), s => phase == 'sympathy-reasoning' ? Math.abs(3 - s.rating.current.sympathy) : 0
        ), s => phase == 'sympathy-reasoning' ? s.student.is_girl : false
    ))

    let showErrors = $state(false)
    const noError = $derived(groupRatings.every(({ rating }) => validateRating(rating.current, phase)))
    $effect(() => {
        if (noError) showErrors = false
    })

    const prevPhase = (phase: string) => phase == 'sympathy-reasoning' ? 'sympathy' : 'influence'
    const nextPhase = (phase: string) => phase == 'influence' ? 'sympathy' : 'sympathy-reasoning'

    const back = () => pushState('', currentGroupIndex > -1
        ? { student: allGroups[currentGroupIndex - 1]?.[0]?.id ?? -1, phase }
        : { student: allGroups[allGroups.length - 1][0].id, phase: prevPhase(phase) })
    const next = () => noError
        ? pushState('', currentGroupIndex < allGroups.length - 1
            ? { student: allGroups[currentGroupIndex + 1][0].id, phase }
            : { student: -1, phase: nextPhase(phase) })
        : showErrors = true
    const send = () => database.rate($savedData)

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
        {:else if currentGroupIndex === -1}
            <p>Js{i} přihlášen jako {data.myself.names} {data.myself.surname}.</p>
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} />
        {:else}
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} justOverview />
            <div class="student-group {phase.replace('-', ' ')}">
                <span class="main-title"></span>
                <span class="main-title I">Vliv:</span>
                <span class="main-title S">Sympatie:</span>
                <span class="main-title R">Vysvětlení sympatií:</span>
                {#each groupRatings as {student, rating}}
                    <StudentRow type={phase} {student} bind:rating={rating.current} {showErrors} />
                {/each}
            </div>
        {/if}
    {/snippet}
    {#snippet buttons()}
        <button class="grey" onclick={database.auth.logOut} style="margin-right: auto;">Odhlásit</button>
        {#if data.alreadyRated || !data.myClass.enabled}{:else if currentGroupIndex === -1 && phase === 'influence'}
            <button class="blue" onclick={next}>Začít!</button>
        {:else}
            <button class="grey" onclick={back}>Zpět</button>
            {#if phase === 'sympathy-reasoning' && currentGroupIndex === allGroups.length - 1}
                <button class="red" onclick={send}>Odeslat</button>
            {:else}
                <button class="blue" onclick={next}>Další</button>
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

        @media only screen and (min-width: 250px) {
            grid-template-columns: auto 1fr;
        }
        @media only screen and (min-width: 600px) {
            grid-template-columns: auto auto 1fr;

            .main-title {
                display: inline;
                margin-left: .5rem;

                &.I {
                    color: var(--influence-color);
                }

                &.S, &.R {
                    color: var(--sympathy-color);
                }
            }

            &:not(.influence) .main-title.I,
            &:not(.sympathy) .main-title.S,
            &:not(.reasoning) .main-title.R {
                display: none;
            }
        }
    }
</style>