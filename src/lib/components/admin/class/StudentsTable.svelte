<script lang="ts">
    import type {StudentScore} from "$lib/data";
    import Table from "$lib/components/Table.svelte";

    const {scores}: { scores: StudentScore[] } = $props()
</script>

{#snippet row(score: StudentScore)}
    {#if scores.length > 1}
        <td>{score.student_number}</td>
        <td class="left">
            <a style:color={score.is_girl ? 'orangered' : 'dodgerblue'}
               tabindex="0" href="/admin?class={score.class}&student={score.id}"
            >{score.names} <strong>{score.surname}</strong></a>
        </td>
    {/if}
    <td>{score.influence.toFixed(2).replace('.', ',')}</td>
    <td>{score.popularity.toFixed(2).replace('.', ',')}</td>
    <td>{score.affection.toFixed(2).replace('.', ',')}</td>
    <td>{score.influenceability.toFixed(2).replace('.', ',')}</td>
    <td>{score.overall.toFixed(2).replace('.', ',')}</td>
{/snippet}

<Table columns={{
    s: 'student_number', n: 'surname', i: 'influence', p: 'popularity', a: 'affection', b: 'influenceability', o: 'overall'
}} defaultSort={{n: 'ascending'}} items={scores} {row}>
    {#snippet header(c, o)}
        {#if scores.length > 1}
            <th class={c.s} onclick={o.s}>#</th>
            <th class="left {c.n}" onclick={o.n}>Jméno a příjmení</th>
        {/if}
        <th class={c.i} onclick={o.i}>Index vlivu</th>
        <th class={c.p} onclick={o.p}>Index obliby</th>
        <th class={c.a} onclick={o.a}>Index náklonosti</th>
        <th class={c.b} onclick={o.b}>Index ovlivnitelnosti</th>
        <th class={c.o} onclick={o.o}>Celkové hodnocení</th>
    {/snippet}
</Table>