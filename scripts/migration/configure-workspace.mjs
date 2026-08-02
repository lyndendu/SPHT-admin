import fs from "node:fs";
import path from "node:path";

const sourceRepository = process.env.SOURCE_REPOSITORY ?? "arhamkhnz/next-shadcn-admin-dashboard";
const sourceCommit = process.env.SOURCE_COMMIT ?? "4727cc7533d46e44b401cac34a38da8566ae9677";

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function writeText(file, content) {
  ensureParent(file);
  fs.writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  writeText(file, JSON.stringify(value, null, 2));
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function packageExports(directory) {
  const entries = walk(directory)
    .filter((file) => /\.(?:tsx?|jsx?)$/.test(file))
    .map((file) => {
      const relative = path.relative(directory, file).replaceAll(path.sep, "/");
      const withoutExtension = relative.replace(/\.(?:tsx?|jsx?)$/, "");
      const key = withoutExtension === "index" ? "." : `./${withoutExtension}`;
      return [key, `./src/${relative}`];
    })
    .sort(([left], [right]) => left.localeCompare(right));

  return Object.fromEntries(entries);
}

const codeFiles = [
  ...walk("apps/admin/src"),
  ...walk("packages/ui/src"),
  ...walk("packages/hooks/src"),
  ...walk("packages/utils/src"),
].filter((file) => /\.(?:[cm]?[jt]sx?)$/.test(file));

const replacements = [
  ["@/components/ui/", "@spht/ui/"],
  ["@/hooks/use-lg", "@spht/hooks/use-lg"],
  ["@/hooks/use-mobile", "@spht/hooks/use-mobile"],
  ["@/lib/utils", "@spht/utils"],
];

for (const file of codeFiles) {
  let content = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
}

const adminPackage = readJson("apps/admin/package.json");
const originalDependencies = { ...adminPackage.dependencies };
adminPackage.name = "@spht/admin";
adminPackage.scripts.typecheck = "tsc --noEmit";
adminPackage.dependencies = {
  "@spht/hooks": "workspace:*",
  "@spht/ui": "workspace:*",
  "@spht/utils": "workspace:*",
  ...adminPackage.dependencies,
};
writeJson("apps/admin/package.json", adminPackage);

writeJson("packages/ui/package.json", {
  name: "@spht/ui",
  version: "0.0.0",
  private: true,
  type: "module",
  sideEffects: false,
  exports: packageExports("packages/ui/src"),
  dependencies: {
    "@spht/hooks": "workspace:*",
    "@spht/utils": "workspace:*",
    ...originalDependencies,
  },
});

writeJson("packages/hooks/package.json", {
  name: "@spht/hooks",
  version: "0.0.0",
  private: true,
  type: "module",
  sideEffects: false,
  exports: packageExports("packages/hooks/src"),
  dependencies: {
    react: originalDependencies.react,
  },
});

writeJson("packages/utils/package.json", {
  name: "@spht/utils",
  version: "0.0.0",
  private: true,
  type: "module",
  sideEffects: false,
  exports: {
    ".": "./src/index.ts",
  },
  dependencies: {
    clsx: originalDependencies.clsx,
    "tailwind-merge": originalDependencies["tailwind-merge"],
  },
});

writeJson("packages/typescript-config/package.json", {
  name: "@spht/typescript-config",
  version: "0.0.0",
  private: true,
  files: ["base.json", "nextjs.json"],
});

writeJson("packages/typescript-config/base.json", {
  $schema: "https://json.schemastore.org/tsconfig",
  compilerOptions: {
    allowJs: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    module: "ESNext",
    moduleResolution: "Bundler",
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: "ES2017",
  },
});

writeJson("packages/typescript-config/nextjs.json", {
  $schema: "https://json.schemastore.org/tsconfig",
  extends: "./base.json",
  compilerOptions: {
    incremental: true,
    isolatedModules: true,
    jsx: "react-jsx",
    lib: ["dom", "dom.iterable", "esnext"],
    noEmit: true,
    plugins: [{ name: "next" }],
  },
});

writeJson("packages/biome-config/package.json", {
  name: "@spht/biome-config",
  version: "0.0.0",
  private: true,
  files: ["biome.json"],
});

writeJson("packages/biome-config/biome.json", {
  $schema: "https://biomejs.dev/schemas/2.5.6/schema.json",
  formatter: {
    enabled: true,
    indentStyle: "space",
    indentWidth: 2,
    lineEnding: "lf",
    lineWidth: 120,
  },
  linter: {
    enabled: true,
    rules: {
      preset: "recommended",
    },
  },
});

const adminTsconfig = readJson("apps/admin/tsconfig.json");
adminTsconfig.extends = "../../packages/typescript-config/nextjs.json";
writeJson("apps/admin/tsconfig.json", adminTsconfig);

const components = readJson("apps/admin/components.json");
components.aliases = {
  ...components.aliases,
  ui: "@spht/ui",
  hooks: "@spht/hooks",
  utils: "@spht/utils",
};
writeJson("apps/admin/components.json", components);

writeText(
  "apps/admin/next.config.mjs",
  `import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@spht/hooks", "@spht/ui", "@spht/utils"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
`,
);

const globalCssPath = "apps/admin/src/app/globals.css";
let globalCss = fs.readFileSync(globalCssPath, "utf8");
const uiSource = '@source "../../../../packages/ui/src";';
if (!globalCss.includes(uiSource)) {
  globalCss = globalCss.replace('@import "tailwindcss";', `@import "tailwindcss";\n${uiSource}`);
  fs.writeFileSync(globalCssPath, globalCss);
}

writeJson("package.json", {
  name: "spht-admin-workspace",
  version: "0.1.0",
  private: true,
  packageManager: "pnpm@10.14.0",
  scripts: {
    dev: "turbo dev --filter=@spht/admin",
    build: "turbo build",
    start: "pnpm --filter @spht/admin start",
    lint: "turbo lint",
    format: "turbo format",
    check: "turbo check",
    typecheck: "turbo typecheck",
  },
  devDependencies: {
    "@biomejs/biome": "^2.5.6",
    turbo: "^2.5.8",
    typescript: "^5.9.3",
  },
});

writeText(
  "pnpm-workspace.yaml",
  `packages:
  - apps/*
  - packages/*
`,
);

writeJson("turbo.json", {
  $schema: "https://turbo.build/schema.json",
  tasks: {
    dev: { cache: false, persistent: true },
    build: {
      dependsOn: ["^build"],
      outputs: [".next/**", "!.next/cache/**", "dist/**"],
    },
    lint: { dependsOn: ["^lint"] },
    format: { cache: false },
    check: { dependsOn: ["^check"] },
    typecheck: {
      dependsOn: ["^typecheck"],
      outputs: [".next/cache/tsconfig.tsbuildinfo"],
    },
  },
});

writeText(
  ".npmrc",
  `auto-install-peers=true
strict-peer-dependencies=false
`,
);

writeText(
  ".gitignore",
  `node_modules/
.turbo/
.next/
dist/
out/
coverage/
*.tsbuildinfo
.DS_Store
.env
.env.*
!.env.example
`,
);

writeText(
  "README.md",
  `# SPHT Admin Workspace

This repository contains the administration frontend workspace for the SPHT system.

## Structure

- \`apps/admin\` — complete Next.js admin dashboard application.
- \`packages/ui\` — reusable shadcn UI primitives.
- \`packages/hooks\` — reusable responsive React hooks.
- \`packages/utils\` — shared TypeScript utilities.
- \`packages/typescript-config\` — shared TypeScript configuration.
- \`packages/biome-config\` — shared Biome defaults.

## Commands

\`\`\`bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
\`\`\`

## Upstream attribution

The initial admin interface is based on \`${sourceRepository}\`, imported from commit \`${sourceCommit}\`. The upstream MIT license is preserved at \`apps/admin/LICENSE\`.
`,
);

writeText(
  "docs/migration/upstream-source.md",
  `# Upstream source snapshot

- Repository: \`${sourceRepository}\`
- Commit: \`${sourceCommit}\`
- Imported application path: \`apps/admin\`

## Relocated shared paths

| Upstream path | Workspace path |
| --- | --- |
| \`src/components/ui/**\` | \`packages/ui/src/**\` |
| \`src/hooks/**\` | \`packages/hooks/src/**\` |
| \`src/lib/utils.ts\` | \`packages/utils/src/index.ts\` |

All other tracked upstream files remain under \`apps/admin\`.
`,
);
