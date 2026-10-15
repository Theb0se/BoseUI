import type { PulseComponentMeta } from "../../types/component";

export const SqlDataGridMeta: PulseComponentMeta = {
  title: "SQL Data Grid",
  description:
    "Supabase and Neon inspired keyboard-navigable micro data table with SQL column type badges (UUID, VARCHAR, BOOLEAN, TIMESTAMPTZ, JSONB), double-click inline cell editing, and SQL INSERT export.",
  tagline: "Keyboard-navigable database table with SQL types and inline cell editing.",
  category: "Cards",
  badges: ["New", "DevTools", "Database", "SQL"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "sql data grid",
    "supabase table",
    "database viewer",
    "inline cell editor",
    "sql export",
    "data table",
  ],
  features: [
    "SQL schema column header types with dedicated color badges.",
    "Click or double-click to edit any cell inline with Enter/Esc shortcuts.",
    "Instant table row search and substring filtering.",
    "One-click SQL INSERT statement export.",
  ],
  accessibility: [
    "Full semantic HTML table markup.",
    "Keyboard accessible cell editing with focus lock and key handlers.",
  ],
  props: [
    {
      name: "tableName",
      type: "string",
      default: '"public.users"',
      description: "Database table schema name displayed in header.",
    },
    {
      name: "columns",
      type: "SqlColumn[]",
      description: "Array of column schemas with types.",
    },
    {
      name: "initialRows",
      type: "SqlRow[]",
      description: "Initial dataset rows.",
    },
  ],
  usageCode: `import { SqlDataGrid } from "@/components/ui/SqlDataGrid";

export function Example() {
  return (
    <SqlDataGrid
      tableName="public.users"
    />
  );
}`,
};

export default SqlDataGridMeta;
