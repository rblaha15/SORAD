import { type Component, mount } from "svelte";

export const printComponent = <Props extends Record<string, any>>(component: Component<Props>, props: Props) => {
    const w = window.open();
    if (!w) throw new Error("Failed to open print window");
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(e => {
        w.document.head.appendChild(w.document.importNode(e, true));
    });
    mount(component, { props, target: w.document.body })
}