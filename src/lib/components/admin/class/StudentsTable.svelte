<script lang="ts">
    import { getStudentsScores, type Indexes, type RatingWithStudents, type StudentScore } from "$lib/admin";
    import Table from "$lib/components/Table.svelte";
    import type { Student } from "$lib/database";

    import { averageBy } from "$lib/utils/sums";
    import { rankedBy } from "$lib/utils/ranks";
    import { round } from "$lib/utils/arithmetics";
    import TopScrollable from "$lib/components/TopScrollable.svelte";
    import GenderSelector from "$lib/components/admin/class/GenderSelector.svelte";

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

    let filterBy = $state<'all' | 'girls' | 'boys'>('all')
    let filterAbout = $state<'all' | 'girls' | 'boys'>('all')
    const filteredRatings = $derived(ratings.filter(r => (
        filterBy == 'all' || r.by.is_girl == (filterBy == 'girls')
    ) && (
        filterAbout == 'all' || r.about.is_girl == (filterAbout == 'girls')
    )))

    const scores = $derived(getStudentsScores(students, filteredRatings))
    const allScores = $derived(getStudentsScores(allStudents, filteredRatings))

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

    const average = $derived({
        ...Object.fromEntries(
            keys.map(key =>
                [key, averageBy(ranked.filter(r => r[key]), r => r[key]!.value)]
            ).map(([key, value]) =>
                [key, value == undefined ? undefined : { value, rank: undefined, of: undefined }]
            )
        ), student: undefined
    } as StudentScoreWithRanks)

    const withAverage = $derived(overview ? [average, ...ranked] : ranked)

    const columns = (s: StudentScoreWithRanks) => keys.map(key => s[key] == undefined ? '—'
        : s[key].rank
            ? `${round(s[key].value).toLocaleString('cs')} (${s[key].rank}/${s[key].of})`
            : round(s[key].value).toLocaleString('cs')
    )
</script>

<TopScrollable>
    <div class="filters row">
        <div class="filter row">
            <span>Hodnotící:</span>
            <GenderSelector
                bind:filter={filterBy}
                showBoys={ratings.some(r => !r.by.is_girl)}
                showGirls={ratings.some(r => r.by.is_girl)}
            />
        </div>
        <div class="filter row">
            <span>Hodnocení:</span>
            <GenderSelector
                bind:filter={filterAbout}
                showBoys={ratings.some(r => !r.about.is_girl)}
                showGirls={ratings.some(r => r.about.is_girl)}
            />
        </div>
    </div>
</TopScrollable>

<div class="table-help">
    <Table items={withAverage} sort={{ disabled: ranked.length <= 1, defaultColumn: 's', columns: {
        n: r => r.student?.student_number ?? 0, s: r => r.student?.surname ?? '',
        i: r => r.influence?.value, p: r => r.popularity?.value, a: r => r.affection?.value,
    }}}>
        {#snippet additionalHeader()}
            {#if ranked.length > 1}
                <th colspan="2"></th>
            {/if}
            <th colspan="2">Hodnocení ostatními</th>
            <th>Hodnocení ostatních</th>
        {/snippet}

        {#snippet header(c, o)}
            {#if ranked.length > 1}
                <th class={c.n} onclick={o.n}>#</th>
                <th class={c.s} onclick={o.s} style:text-align="start">Jméno a příjmení</th>
            {/if}
            <th class={c.i} onclick={o.i}>Index vlivu</th>
            <th class={c.p} onclick={o.p}>Index obliby</th>
            <th class={c.a} onclick={o.a}>Index náklonosti</th>
        {/snippet}

        {#snippet row(score)}
            {#if !score.student}
                <td></td>
                <td style:text-align="start"><strong>Průměr</strong></td>
                {#each columns(score) as col}
                    <td>{col.split(' (')[0]}</td>
                {/each}
            {:else}
                {#if ranked.length > 1}
                    <td>{score.student.student_number}</td>
                    <td style:text-align="start">
                        <a style:color={score.student.is_girl ? 'var(--girl-color)' : 'var(--boy-color)'} data-sveltekit-replacestate="off"
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

    <ul>
        <li><strong>Index vlivu</strong> – Aritmetický průměr všech hodnocení vlivu, které daný žák obdržel</li>
        <li><strong>Index obliby</strong> – Aritmetický průměr všech hodnocení sympatie, které daný žák obdržel</li>
        <li><strong>Index náklonnosti</strong> – Aritmetický průměr všech hodnocení sympatie, které daný žák udělil<br /><br /></li>
        <li><var>i (n/t)</var> = Daný index žáka je <var>i</var>; v pořadí má z <var>t</var> žáků <var>n</var>-tou nejnižží hodnotu</li>
    </ul>
</div>

<style>
    th:nth-child(1) {
        min-width: 1.6rem;
    }

    th:nth-child(3), th:nth-child(4), th:nth-child(5) {
        min-width: 9rem;
    }

    .filters.row {
        flex-wrap: wrap;

        .filter.row {
            text-wrap: nowrap;
            margin: 0 1rem 1rem 0;

            span {
                min-width: 6rem;
            }
        }
    }

    .table-help {
        display: flex;
        flex-wrap: wrap;
        align-items: start;
    }
</style>