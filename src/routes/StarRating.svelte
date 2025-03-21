<script lang="ts">
    let {
        value = $bindable(),
        id
    }: {
        value: number | undefined,
        id: string
    } = $props()
</script>

<div class="star-row">
    {#each Array(5) as _, i}
        <label>
            <input
                    type="radio"
                    value={i}
                    name="star-rating-{id}"
                    bind:group={value}
            >
            &starf;
        </label>
    {/each}
</div>

<style>
    .star-row {
        padding: 0 1rem;
        margin: 0;
        display: flex;

        input {
            display: none;
        }

        label {
            text-decoration: none;
            font-size: 2rem;
            color: gold;
        }
    }

    .star-row:not(:hover):not(:has(> label > input:checked)) label,
    .star-row:not(:hover) label:has(input:checked) ~ label,
    .star-row label:has(input:hover) ~ label {
        color: white;
    }

    .star-row:not(:hover) label:has(input:focus-visible) {
        color: darkgreen;
    }
</style>