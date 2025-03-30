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

<button onclick={toggle}>
    {#if typeof label == 'string'}{label}{:else}{@render label({collapsed})}{/if}
</button>
<div style:display={collapsed ? 'none' : 'block'}>
    {@render content()}
</div>