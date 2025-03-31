<script lang="ts">
    import type {StudentScore} from "$lib/data";
    import Table from "$lib/components/Table.svelte";

    const {scores}: { scores: StudentScore[] } = $props()
</script>

{#snippet header()}
    {#if scores.length > 1}
        <th class="left">Jméno a příjmení</th>
    {/if}
    <th>Index vlivu</th>
    <th>Index obliby</th>
    <th>Index náklonosti</th>
    <th>Index ovlivnitelnosti</th>
    <th>Celkové hodnocení</th>
{/snippet}

{#snippet row(score: StudentScore)}
    {#if scores.length > 1}
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

<Table items={scores} {header} {row} />