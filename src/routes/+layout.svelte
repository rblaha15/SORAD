<script lang="ts">
    import type {Snippet} from "svelte";

    const {children}: {
        children?: Snippet;
    } = $props();
</script>

<div class="root">
    {@render children?.()}
</div>

<style>
    :global {
        * {
            font-size: 1rem;
            text-size-adjust: 100%;
            font-weight: 400;
            line-height: 1.5;
        }


        button {
            background: none;
            border: deepskyblue 1px solid;
            border-radius: 0.375rem;
            color: deepskyblue;
            font-size: 1rem;
            padding: .5rem;
            cursor: pointer;
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
            border: 5px solid orangered;
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
    }
</style>