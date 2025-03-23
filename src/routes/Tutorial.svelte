<script lang="ts">
    import StarRating from "./StarRating.svelte";

    const {isGirl, grade}: { isGirl: boolean, grade: number } = $props()

    const a = isGirl ? 'a' : ''
    const i = grade > 4 ? 'te' : 'i'
    const te = grade > 4 ? 'te' : 'š'
    const ete = grade > 4 ? 'ete' : 'i'
</script>

<!--suppress JSUnresolvedReference -->
<div class="tutorial-root">
    {#snippet tutorialRating(min: string, max: string)}
        <div class="tutorial-rating">
            <div class="star-labels">
                <span>{@html min}</span>
                <span>{@html max}</span>
            </div>
            <div class="tutorial-stars">
                <StarRating error={false} value={2}/>
            </div>
            <span class="width-helper">&starf;&starf;&starf;&starf;&starf;&starf;&starf;&starf;</span>
        </div>
    {/snippet}

    <p>Každého spolužáka (a sebe) ohodnotí{te} tím, že si zodpoví{te} na následující dvě otázky a přidělí{te} jim hodnotu 1-5:</p>
    <p><strong>1. Kdo má ve třídě na ostatní jaký vliv? (Jak moc na ně druzí dají)</strong></p>
    {@render tutorialRating(
        'Malý až<br />žádný vliv',
        'Největší<br />vliv',
    )}
    <p><strong>2. Kdo je mi ze třídy sympatický nebo nesympatický? (Jak rád{a} se s nimi vídám)</strong></p>
    {@render tutorialRating(
        'Úplně<br/>nesympatický',
        'Nejvíce<br/>sympatický',
    )}
    <p>Poté prosím vysvětl{ete}, proč js{i} u druhé otázky zvolil{a} právě tuto odpověď (obzvlášť, pokud js{i} zaškrtl{a} 1 nebo 5)</p>
</div>

<style>
    .tutorial-rating {
        width: max-content;

        .star-labels {
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
        }

        .tutorial-stars {
            justify-self: center;
        }

        .width-helper {
            display: block;
            font-size: 2rem;
            visibility: hidden;
            height: 0;
        }
    }
</style>