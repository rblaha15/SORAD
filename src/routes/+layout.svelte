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

        a {
            color: dodgerblue;
        }

        button, a.btn {
            background: none;
            border: dodgerblue 1px solid;
            border-radius: 0.375rem;
            color: dodgerblue;
            font-size: 1rem;
            padding: .5rem;
            cursor: pointer;
            text-decoration: none;
        }

        button:hover, a.btn:hover {
            background: dodgerblue;
            color: black;
        }

        .grey {
            border-color: grey;
            color: grey;
        }

        .grey:hover {
            background: grey;
            color: black;
        }

        .white {
            border-color: white;
            color: white;
        }

        .white:hover {
            background: white;
            color: black;
        }

        .red {
            border-color: orangered;
            color: orangered;
        }

        .red:hover {
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
            margin: 1rem;
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