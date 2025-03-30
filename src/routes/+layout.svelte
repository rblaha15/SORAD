<script lang="ts">
    import type {Snippet} from "svelte";

    const {children}: {
        children?: Snippet;
    } = $props();
</script>

<div class="root">
    {@render children?.()}
</div>

<!--suppress CssUnusedSymbol -->
<style>
    .root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    :global {
        * {
            font-size: 1rem;
            text-size-adjust: 100%;
            line-height: 1.5;
        }


        button, a.btn {
            background: none;
            border: deepskyblue 1px solid;
            border-radius: 0.375rem;
            color: deepskyblue;
            font-size: 1rem;
            padding: .5rem;
            cursor: pointer;
            text-decoration: none;
        }

        button:hover {
            background: deepskyblue;
            color: black;
        }

        button.grey {
            border-color: grey;
            color: grey;
        }

        button.grey:hover {
            background: grey;
            color: black;
        }

        button.red {
            border-color: orangered;
            color: orangered;
        }

        button.red:hover {
            background: orangered;
            color: black;
        }

        input {
            background: none;
            border: #3b4245 1px solid;
            border-radius: .375rem;
            color: inherit;
            font-size: 1rem;
            padding: .375rem .75rem;
        }

        .loader {
            width: 32px;
            height: 32px;
            border: 3px solid orangered;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        hr {
            margin: 1rem 0;
            border: 0;
            border-top: 1px solid;
            opacity: .25;
        }

        h1 {
            font-size: 1.75rem;
        }
    }
</style>