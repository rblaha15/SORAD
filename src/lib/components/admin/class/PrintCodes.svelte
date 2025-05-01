<script lang="ts">
    import type { Student } from "$lib/database";

    const { codes }: { codes: (Student & { password: string })[] } = $props()
</script>

<table>
    <tbody>
    {#each codes as s}
        <tr>
            <td>{s.surname}</td>
            <td>{s.names}</td>
            <td>{s.password}</td>
        </tr>
    {/each}
    </tbody>
</table>

<style>
    table {
        background: red;
        border-collapse: collapse;
        border: 2px solid black;

        td {
            border: 1px solid black;
            padding: 5px;
            text-align: center;
        }
    }
</style>