<script lang="ts">
    import type { Student } from "$lib/database";

    const { codes }: { codes: (Student & { password: string })[] } = $props()
    const half = $derived(Math.floor(codes.length / 2))
    const pairs = $derived(codes.slice(0, half).map((_, i) => [codes[i], codes[i + half]] as const))
</script>

<title>Kódy pro přihlášení</title>

<table class="print">
    <tbody>
    {#each pairs as [s1, s2]}
        <tr>
            <td>{s1.surname} {s1.names}</td>
            <td>{s1.password}</td>
            <td>{s2.surname} {s2.names}</td>
            <td>{s2.password}</td>
        </tr>
    {/each}
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
        border: 4px solid var(--foreground-color);

        td {
            border: 2px solid var(--foreground-color);
            padding: 5px;
            text-align: center;
        }
        td:nth-of-type(3) {
            border-left-width: 4px;
        }
    }
</style>