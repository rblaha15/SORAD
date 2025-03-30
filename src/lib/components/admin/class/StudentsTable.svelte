<script lang="ts">
    import type {StudentScore} from "$lib/data";

    const {scores, classId}: { scores: StudentScore[], classId: number } = $props()
</script>

<div class="table-wrapper">
    <table>
        <thead>
        <tr>
            {#if scores.length > 1}
                <th>Jméno a příjmení</th>
            {/if}
            <th>Index vlivu</th>
            <th>Index obliby</th>
            <th>Index náklonosti</th>
            <th>Index ovlivnitelnosti</th>
            <th>Celkové hodnocení</th>
        </tr>
        </thead>
        <tbody>
        {#each scores as score}
            <tr>
                {#if scores.length > 1}
                    <td>
                        <a style:color={score.is_girl ? 'orangered' : 'dodgerblue'}
                           tabindex="0" href="/admin?class={classId}&student={score.id}"
                        >{score.names} <strong>{score.surname}</strong></a>
                    </td>
                {/if}
                <td>{score.influence.toFixed(2).replace('.', ',')}</td>
                <td>{score.popularity.toFixed(2).replace('.', ',')}</td>
                <td>{score.affection.toFixed(2).replace('.', ',')}</td>
                <td>{score.influenceability.toFixed(2).replace('.', ',')}</td>
                <td>{score.overall.toFixed(2).replace('.', ',')}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

<style>
    .table-wrapper {
        overflow-x: auto;

        table {
            width: 100%;
            border-spacing: .375rem;

            tr {
                td, th {
                    white-space: nowrap;
                    text-align: center;

                    &:first-child {
                        text-align: left;
                    }
                }
            }
        }
    }
</style>