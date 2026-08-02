import fs from "node:fs";

const file = "apps/admin/src/app/globals.css";
const content = fs.readFileSync(file, "utf8");

const before = `@import "tailwindcss";
@source "../../../../packages/ui/src";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Theme preset styles: these override CSS variables based on the selected data-theme-preset */
@import "../styles/presets/brutalist.css";
@import "../styles/presets/soft-pop.css";
@import "../styles/presets/tangerine.css";
`;

const after = `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "../styles/presets/brutalist.css";
@import "../styles/presets/soft-pop.css";
@import "../styles/presets/tangerine.css";

@source "../../../../packages/ui/src";
`;

if (content.includes(after)) {
  process.exit(0);
}

if (!content.includes(before)) {
  throw new Error("Expected globals.css import block was not found");
}

fs.writeFileSync(file, content.replace(before, after));
