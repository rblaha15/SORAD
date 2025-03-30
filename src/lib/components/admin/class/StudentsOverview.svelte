<script lang="ts">
    import type {StudentScore} from "$lib/data";

    const {scores, classId}: { scores: StudentScore[], classId: number } = $props()
</script>

<div class="grid">
    <span>Jméno a příjmení</span>
    <span>Oblíbenost</span>
    <span>Vliv</span>
    {#each scores as score}
        <span><a href="/admin?class={classId}&student={score.id}">{score.names} <strong>{score.surname}</strong></a></span>
        <span>{score.liking.toFixed(2).replace('.', ',')}</span>
        <span>{score.popularity.toFixed(2).replace('.', ',')}</span>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: max-content 0fr 0fr;
        grid-column-gap: 1rem;
        grid-row-gap: 1rem;
        margin: 1rem 0;
        :not(:nth-child(3n + 1)) {
            text-align: center;
        }
    }
</style>