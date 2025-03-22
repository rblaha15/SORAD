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
        <label onpointerup={() => value = i}>
            <input type="radio" value={i} name="star-rating-{id}" bind:group={value}>
            &starf;
        </label>
    {/each}
</div>

<style>
    .star-row {
        display: flex;
        margin: -.25rem 0;

        input {
            display: none;
            margin: 0;
        }

        label {
            text-decoration: none;
            font-size: 2rem;
            color: gold;
            cursor: pointer;
            user-select: none;
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