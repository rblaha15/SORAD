import { type Component, mount } from "svelte";

export const printComponent = <Props extends Record<string, any>>(component: Component<Props>, props: Props) => {
    const w = window.open(window.location.href);
    if (!w) throw new Error("Failed to open print window");
    setTimeout(() => {
        w.document.body.innerHTML = '';
        mount(component, { props, target: w.document.body })
    }, 100);
}