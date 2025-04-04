<div class="outer">
    <div class="inner">
        <slot />
    </div>
</div>


<style>
    .outer, .inner {
        transform: rotateX(180deg);
    }
    .outer {
        overflow-x: auto;
    }
</style>