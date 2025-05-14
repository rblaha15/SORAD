<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        title,
        content,
        buttons,
    }: {
        title?: Snippet,
        content?: Snippet,
        buttons?: Snippet,
    } = $props();
</script>

<div class="main-content">
    {#if buttons || title}
        <div class="row header">
            {#if title}
                <h1>{@render title?.()}</h1>
            {/if}

            <div class="row buttons">
                {@render buttons?.()}
            </div>
        </div>
    {/if}
    <div class="content column">
        {@render content?.()}
    </div>
</div>

<style>
    .main-content {
        display: flex;
        flex-direction: column;
        padding: 1rem 0;
        gap: 1rem;
        height: calc(100% - 2rem);

        .header, .content {
            padding: 0 1rem;
        }

        .header {
            align-items: start;
            flex-wrap: wrap;
        }

        .buttons {
            margin-left: auto;
        }

        .content {
            flex-grow: 1;
            overflow-y: scroll;
        }
    }
</style>