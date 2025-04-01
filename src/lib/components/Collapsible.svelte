<script lang="ts">
    import type {Snippet} from "svelte";

    const {
        label,
        children,
        content = children!,
        collapsedInInitially = true,
    }: {
        label: string | Snippet<[{ collapsed: boolean }]>,
        children?: Snippet,
        content?: Snippet,
        collapsedInInitially?: boolean,
    } = $props();

    let collapsed = $state(collapsedInInitially)
    const toggle = () =>
        collapsed = !collapsed;
</script>

<button class="white" onclick={toggle}>
    {#if typeof label == 'string'}{label}{:else}{@render label({collapsed})}{/if}
</button>
<div class={{hidden: collapsed}}>
    {@render content()}
</div>

<style>
    button {
        display: block;
        margin-top: .375rem;
        border: none;

        &::before {
            content: '\025B4';
            font-size: inherit;
            color: inherit;
            margin-right: .375rem;
        }

        &:has(+ .hidden)::before {
            content: '\025BE';
        }
    }
    div.hidden {
        display: none;
    }
</style>