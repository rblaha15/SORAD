<script lang="ts">
    import type {Snippet} from "svelte";

    const {
        title,
        content,
        buttons,
        footer,
    }: {
        title?: Snippet,
        content?: Snippet,
        buttons?: Snippet,
        footer?: Snippet,
    } = $props();
</script>

<h1 class="title">{@render title?.()}</h1>
{#if buttons}
    <div class="row buttons">
        {@render buttons()}
    </div>
{/if}
{#if content}
    <div class="content">
        {@render content()}
    </div>
{/if}
{#if footer}
    <div class="footer">
        {@render footer()}
    </div>
{/if}

<style>
    .title {
        text-align: center;
        margin: 0;
        padding: 1rem 1rem 0;
    }

    .buttons {
        background: black;
        padding: 0 1rem 1rem;

        :global {
            button, a.btn {
                margin-left: .5rem;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }

    .content {
        flex-grow: 1;
        padding: 0 1rem 1rem;
        overflow-y: scroll;
    }
    .footer {
        padding: 0 1rem 1rem;
    }
</style>