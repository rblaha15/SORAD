<script lang="ts">
    import { getStudentsScores, type Indexes, type RatingWithStudents, type StudentScore } from "$lib/admin";
    import Table from "$lib/components/Table.svelte";
    import type { Student } from "$lib/database";

    import { averageBy } from "$lib/utils/sums";
    import { rankedBy } from "$lib/utils/ranks";
    import { round } from "$lib/utils/arithmetics";

    type Rank = { value: number, rank: undefined, of: undefined } | { value: number, rank: number, of: number };
    export type Ranks = {
        [I in keyof Indexes]: Rank | undefined
    };
    export type StudentScoreWithRanks = { student: StudentScore | undefined } & Ranks;

    const {
        overview = false, ratings, students, allStudents = students,
    }: {
        ratings: RatingWithStudents[], students: Student[], allStudents?: Student[], overview?: boolean
    } = $props()

    let filter = $state<'all' | 'girls' | 'boys'>('all')
    const filtered = $derived(filter == 'all' ? students : students.filter(s => s.is_girl == (filter == 'girls')))
    const filteredRatings = $derived(filter == 'all' ? ratings : ratings.filter(r => r.by.is_girl == (filter == 'girls') && r.about.is_girl == (filter == 'girls')))
    const allFiltered = $derived(filter == 'all' ? allStudents : allStudents.filter(s => s.is_girl == (filter == 'girls')))

    const scores = $derived(getStudentsScores(filtered, filteredRatings))
    const allScores = $derived(getStudentsScores(allFiltered, filteredRatings))

    const keys = ['influence', 'popularity', 'affection'] as const
    const rankedScores = $derived(keys.map(key => {
        const nonNull = allScores.filter(s => s[key]);
        return { key, ranked: rankedBy(nonNull, s => s[key]!), count: nonNull.length };
    }))

    const ranked = $derived(scores.map(s => {
        const ranks = Object.fromEntries(rankedScores.map(({ key, ranked, count }) => [key, s[key] == undefined ? undefined : {
            value: s[key], rank: ranked[s[key]], of: count
        }])) as Ranks

        return { student: s, ...ranks } as StudentScoreWithRanks
    }))

    const average = {...Object.fromEntries(keys.map(key => [key,
        { value: averageBy(ranked.filter(r => r[key]), r => r[key]!.value), rank: undefined, of: undefined }
    ])), student: undefined } as StudentScoreWithRanks

    const withAverage = $derived(overview ? [average, ...ranked] : ranked)

    const columns = (s: StudentScoreWithRanks) => keys.map(key => s[key] == undefined ? '—'
        : s[key].rank
            ? `${round(s[key].value).toLocaleString('cs')} (${s[key].rank}/${s[key].of})`
            : round(s[key].value).toLocaleString('cs')
    )
</script>

<div class="filters btn-group">
    <label class="btn toggle neutral">
        <input bind:group={filter} type="radio" value="all" />
        Všichni
    </label>
    {#if students.some(s => s.is_girl)}
        <label class="btn toggle" style="--btn-color: var(--girl-color)">
            <input bind:group={filter} type="radio" value="girls" />
            Pouze dívky o dívkách
        </label>
    {/if}
    {#if students.some(s => !s.is_girl)}
        <label class="btn toggle" style="--btn-color: var(--boy-color)">
            <input bind:group={filter} type="radio" value="boys" />
            Pouze chlapci o chlapcích
        </label>
    {/if}
</div>

<Table bordersColumns columns={{
    s: r => r.student?.student_number, n: r => r.student?.surname,
    i: r => r.influence?.value, p: r => r.popularity?.value, a: r => r.affection?.value,
}} defaultSort={ranked.length <= 1 ? undefined : {n: 'ascending'}} items={withAverage}>
    {#snippet header(c, o)}
        {#if ranked.length > 1}
            <th class={c.s} onclick={o.s}>#</th>
            <th class="left {c.n}" onclick={o.n}>Jméno a příjmení</th>
        {/if}
        <th class={c.i} onclick={o.i}>Index vlivu</th>
        <th class={c.p} onclick={o.p}>Index obliby</th>
        <th class={c.a} onclick={o.a}>Index náklonosti</th>
    {/snippet}

    {#snippet row(score)}
        {#if !score.student}
            <td></td>
            <td class="left"><strong>Průměr</strong></td>
            {#each columns(score) as col}
                <td>{col.split(' (')[0]}</td>
            {/each}
        {:else}
            {#if ranked.length > 1}
                <td>{score.student.student_number}</td>
                <td class="left">
                    <a style:color={score.student.is_girl ? 'var(--girl-color)' : 'var(--boy-color)'} data-sveltekit-replacestate
                       tabindex="0" href="/admin?class={score.student.class}&student={score.student.id}"
                    >{score.student.names} <strong>{score.student.surname}</strong></a>
                </td>
            {/if}
            {#each columns(score) as col}
                <td>{col}</td>
            {/each}
        {/if}
    {/snippet}
</Table>

<style>
    .filters {
        margin: .75rem 0;

        label, input {
            cursor: pointer;
        }
    }
</style>