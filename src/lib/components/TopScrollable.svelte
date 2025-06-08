<div class="A">
    <div class="B">
        <div class="C">
            <slot />
        </div>
    </div>
</div>


<style>
    .B, .C {
        transform: rotateX(180deg);
    }
    .B {
        overflow-x: auto;
    }
    .A {
        overflow-y: visible;
    }
</style>