import { type Component, mount, unmount } from "svelte";

export const printComponent = <Props extends Record<string, any>>(component: Component<Props>, props: Props) => {
    const w = window.open(undefined, undefined, "popup=yes");
    if (!w) throw new Error("Failed to open print window");
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(e => {
        w.document.head.appendChild(w.document.importNode(e, true));
    });
    const mounted = mount(component, { props, target: w.document.body })
    w.onafterprint = async () => {
        await unmount(mounted)
        w.close();
    };
    setTimeout(() => w.print(), 100);
}