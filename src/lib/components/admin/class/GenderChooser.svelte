<script lang="ts">
    let {
        filter = $bindable(), showGirls = true, showBoys = true,
    }: {
        filter: string, showGirls?: boolean, showBoys?: boolean,
    } = $props()
</script>


<div class="filters btn-group">
    <label class="btn neutral toggle">
        <input bind:group={filter} type="radio" value="all" />
        Všichni
    </label>
    {#if showGirls}
        <label class="btn toggle" style="--btn-color: var(--girl-color)">
            <input bind:group={filter} type="radio" value="girls" />
            Pouze dívky
        </label>
    {/if}
    {#if showBoys}
        <label class="btn toggle" style="--btn-color: var(--boy-color)">
            <input bind:group={filter} type="radio" value="boys" />
            Pouze chlapci
        </label>
    {/if}
</div>

<style>
    .filters {
        margin: .75rem 0;

        label, input {
            cursor: pointer;
        }
    }
</style>