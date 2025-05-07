<script lang="ts">
    import type {Snippet} from "svelte";

    let {
        label,
        children,
        content = children!,
        open = false,
    }: {
        label: string,
        children?: Snippet,
        content?: Snippet,
        open?: boolean,
    } = $props();

</script>

<details bind:open>
    <summary>{label}</summary>
    {@render content?.()}
</details>

<style>
    details {
        border: 1px solid var(--grey-color);
        border-radius: .75rem;
        margin-top: 1rem;

        summary {
            font-weight: bold;
            padding: 1rem;
            cursor: pointer;
        }
    }

    details[open] {
        padding: 1rem;

        summary {
            border-bottom: 1px solid var(--grey-color);
            margin: -1rem -1rem 1rem;
        }
    }
</style>