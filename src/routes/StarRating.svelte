<script lang="ts">
    let {
        value = $bindable(), error
    }: {
        value: -1 | 0 | 1 | 2 | 3 | 4, error: boolean
    } = $props()

    const id = $props.id()

    const arr = Array(5).fill(0).map((_, i) => i as 0 | 1 | 2 | 3 | 4)
</script>

<div class="star-row">
    {#each arr as i}
        <label class:error onpointerup={() => value = i}>
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

            &.error {
                /*-webkit-text-stroke: 3px red;*/
            }
        }

        &:not(:hover):not(:has(> label > input:checked)) label,
        &:not(:hover) label:has(input:checked) ~ label,
        & label:has(input:hover) ~ label {
            color: white;
            &.error {
                color: red;
            }
        }

        &:not(:hover) label:has(input:focus-visible) {
            color: darkgreen;
        }
    }
</style>