<script lang="ts">
    let {
        value = $bindable(), error, type
    }: {
        value: number, error: boolean, type: 'influence' | 'sympathy'
    } = $props()

    const id = $props.id()

    const arr = Array(5).fill(0).map((_, i) => 5 - i as number)
</script>

<div class="star-row">
    {#each arr as i}
        <label class:error class={type} onpointerup={() => value = i}>
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
            width: 0;
            position: absolute;
        }

        label {
            text-decoration: none;
            font-size: 2rem;
            color: gold;
            cursor: pointer;
            user-select: none;

            &:has(> input:focus-visible) {
                color: darkgreen !important;
            }
        }

        &:not(:hover):not(:has(> label > input:checked)) label,
        &:not(:hover) label:has(input:checked) ~ label,
        & label:has(input:hover) ~ label {
            color: white;
            &.influence {
                color: var(--influence-color);
            }
            &.sympathy {
                color: var(--sympathy-color);
            }
            &.error {
                color: var(--red-color);
            }
        }
    }
</style>