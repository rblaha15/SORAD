<script lang="ts">
    import type {RatingWithStudents} from "$lib/data";
    import Table from "$lib/components/Table.svelte";

    const {ratings}: { ratings: RatingWithStudents[] } = $props()
    const bySameStudent = new Set(ratings.map(r => r.by.id)).size == 1
    const aboutSameStudent = new Set(ratings.map(r => r.about.id)).size == 1
</script>

{#snippet header()}
    {#if !bySameStudent}
        <th class="left">Hodnotící</th>
    {/if}
    {#if !aboutSameStudent}
        <th class="left">Hodnocený</th>
    {/if}
    <th>Vnímaný vliv</th>
    <th>Sympatie</th>
    <th>Vysvětlení sympatií</th>
{/snippet}

{#snippet row(rating: RatingWithStudents)}
    {#if !bySameStudent}
        <td class="left">
            <a style:color={rating.by.is_girl ? 'orangered' : 'dodgerblue'}
               tabindex="0" href="/admin?class={rating.by.class}&student={rating.by.id}"
            >{rating.by.names} <strong>{rating.by.surname}</strong></a>
        </td>
    {/if}
    {#if !aboutSameStudent}
        <td class="left">
            <a style:color={rating.about.is_girl ? 'orangered' : 'dodgerblue'}
               tabindex="0" href="/admin?class={rating.about.class}&student={rating.about.id}"
            >{rating.about.names} <strong>{rating.about.surname}</strong></a>
        </td>
    {/if}
    <td>{rating.influence.toFixed(2).replace('.', ',')}</td>
    <td>{rating.sympathy.toFixed(2).replace('.', ',')}</td>
    <td>{rating.reasoning}</td>
{/snippet}

<Table items={ratings} {header} {row} />