import checkMdx from "docusaurus-mdx-checker";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

try {
  const result = await checkMdx({
    cwd: root,
    include: [
      "docs/**/*.{md,mdx}",
      "blog/**/*.{md,mdx}",
      "src/pages/**/*.{md,mdx}",
    ],
    exclude: ["**/node_modules/**"],
  });
  console.log(result);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
