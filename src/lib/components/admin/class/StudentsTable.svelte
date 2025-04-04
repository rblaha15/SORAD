<script lang="ts">
    import {rankedBy, type StudentScore, type StudentScoreWithRanks} from "$lib/data";
    import Table from "$lib/components/Table.svelte";

    const {scores, allScores = scores}: { scores: StudentScore[], allScores?: StudentScore[] } = $props()

    let filter = $state<'all' | 'girls' | 'boys'>('all')
    const filtered = $derived(filter == 'all' ? scores : scores.filter(s => s.is_girl == (filter == 'girls')))
    const allFiltered = $derived(filter == 'all' ? allScores : allScores.filter(s => s.is_girl == (filter == 'girls')))

    const keys = ['influence', 'popularity', 'affection', 'influenceability', 'overall'] as const
    const ranks = $derived(keys.map(key => {
        const nonNull = allFiltered.filter(s => s[key] != undefined);
        return [key, rankedBy(nonNull, s => s[key]!), nonNull.length] as const;
    }))


    const ranked = $derived(filtered.map((s): StudentScoreWithRanks => {
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

<div class="filters">
    <label>
        <input bind:group={filter} type="radio" value="all"/>
        Všichni
    </label>
    <label>
        <input bind:group={filter} type="radio" value="girls"/>
        Pouze dívky
    </label>
    <label>
        <input bind:group={filter} type="radio" value="boys"/>
        Pouze chlapci
    </label>
</div>

<Table columns={{
    s: 'student_number', n: 'surname', i: r => r.influence?.value, p: r => r.popularity?.value,
    a: r => r.affection?.value, b: r => r.influenceability?.value, o: r => r.overall?.value
}} defaultSort={{n: 'ascending'}} items={ranked}>
    {#snippet header(c, o)}
        {#if ranked.length > 1}
            <th class={c.s} onclick={o.s}>#</th>
            <th class="left {c.n}" onclick={o.n}>Jméno a příjmení</th>
        {/if}
        <th class={c.i} onclick={o.i}>Index vlivu</th>
        <th class={c.p} onclick={o.p}>Index obliby</th>
        <th class={c.a} onclick={o.a}>Index náklonosti</th>
        <th class={c.b} onclick={o.b}>Index ovlivnitelnosti</th>
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
        label, input {
            cursor: pointer;
        }
    }
</style>