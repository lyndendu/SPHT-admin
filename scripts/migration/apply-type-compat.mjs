import fs from "node:fs";

function replaceExact(file, before, after) {
  const content = fs.readFileSync(file, "utf8");

  if (content.includes(after)) {
    return;
  }

  if (!content.includes(before)) {
    throw new Error(`Expected source text was not found in ${file}`);
  }

  fs.writeFileSync(file, content.replace(before, after));
}

replaceExact(
  "apps/admin/src/app/(main)/dashboard/(legacy)/default-v1/_components/chart-area-interactive.tsx",
  "return new Date(value).toLocaleDateString(\"en-US\", {",
  "return new Date(String(value)).toLocaleDateString(\"en-US\", {",
);

replaceExact(
  "apps/admin/src/app/(main)/dashboard/default/_components/performance-overview.tsx",
  "labelFormatter={(value) => format(parseISO(value), \"d MMMM yyyy\")}",
  "labelFormatter={(value) => format(parseISO(String(value)), \"d MMMM yyyy\")}",
);

replaceExact(
  "apps/admin/src/app/(main)/dashboard/ecommerce/_components/store-traffic.tsx",
  '<ChartLegend align="right" verticalAlign="top" className="justify-end" content={<ChartLegendContent />} />',
  '<ChartLegend align="right" verticalAlign="top" content={<ChartLegendContent className="justify-end" />} />',
);
