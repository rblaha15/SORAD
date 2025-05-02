<script lang="ts">
    import { getClassScore, getStudentsScores, rankedBy, type RatingWithStudents, type StudentScoreWithRanks } from "$lib/data";
    import Table from "$lib/components/Table.svelte";
    import type { Student } from "$lib/database";

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

    const keys = ['influence', 'popularity', 'influenceability', 'affection', 'overall'] as const
    const ranks = $derived(keys.map(key => {
        const nonNull = allScores.filter(s => s[key] != undefined);
        return [key, rankedBy(nonNull, s => s[key]!), nonNull.length] as const;
    }))

    const ranked = $derived(scores.map((s): StudentScoreWithRanks => {
        const indexes = Object.fromEntries(ranks.map(([key, rank, count]) => [key, s[key] == undefined ? undefined : {
            value: s[key], rank: rank[s[key]], of: count
        }] as const))
        return {
            ...s, ...indexes,
        }
    }))

    const columns = (s: StudentScoreWithRanks) => keys.map(key => s[key] == undefined ? '—'
        : `${s[key].value.toFixed(2).replace('.', ',')} (${s[key].rank}/${s[key].of})`
    )

</script>

<div class="filters btn-group">
    <label class="btn toggle white">
        <input bind:group={filter} type="radio" value="all" />
        Všichni
    </label>
    {#if students.some(s => s.is_girl)}
        <label class="btn toggle red">
            <input bind:group={filter} type="radio" value="girls" />
            Pouze dívky o dívkách
        </label>
    {/if}
    {#if students.some(s => !s.is_girl)}
        <label class="btn toggle blue">
            <input bind:group={filter} type="radio" value="boys" />
            Pouze chlapci o chlapcích
        </label>
    {/if}
</div>

{#if overview}
    <p>Průměrné indexy celé skupiny:</p>
    <Table items={[getClassScore(scores)]}>
        {#snippet header()}
            <th>Index vlivu</th>
            <th>Index obliby</th>
            <th>Index ovlivnitelnosti</th>
            <th>Index náklonosti</th>
            <th>Celkové hodnocení</th>
        {/snippet}

        {#snippet row(score)}
            {#each Object.values(score) as col}
                <td>{col?.toFixed(2)?.replace('.', ',') ?? '—'}</td>
            {/each}
        {/snippet}
    </Table>
{/if}

<Table columns={{
    s: 'student_number', n: 'surname', i: r => r.influence?.value, p: r => r.popularity?.value,
    a: r => r.affection?.value, b: r => r.influenceability?.value, o: r => r.overall?.value
}} defaultSort={ranked.length <= 1 ? undefined : {n: 'ascending'}} items={ranked}>
    {#snippet header(c, o)}
        {#if ranked.length > 1}
            <th class={c.s} onclick={o.s}>#</th>
            <th class="left {c.n}" onclick={o.n}>Jméno a příjmení</th>
        {/if}
        <th class={c.i} onclick={o.i}>Index vlivu</th>
        <th class={c.p} onclick={o.p}>Index obliby</th>
        <th class={c.b} onclick={o.b}>Index ovlivnitelnosti</th>
        <th class={c.a} onclick={o.a}>Index náklonosti</th>
        <th class={c.o} onclick={o.o}>Celkové hodnocení</th>
    {/snippet}

    {#snippet row(score)}
        {#if ranked.length > 1}
            <td>{score.student_number}</td>
            <td class="left">
                <a style:color={score.is_girl ? 'orangered' : 'dodgerblue'}
                   tabindex="0" href="/admin?class={score.class}&student={score.id}"
                >{score.names} <strong>{score.surname}</strong></a>
            </td>
        {/if}
        {#each columns(score) as col}
            <td>{col}</td>
        {/each}
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