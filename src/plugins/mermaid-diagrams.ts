import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Root } from "mdast";
import type { Transformer } from "unified";

type Node = { type: string; lang?: string; value?: string; children?: Node[] };
type Diagram = {
  title: string;
  description: string;
  light: { width: number; height: number };
};

/** Render authored Mermaid fences as static, theme-aware figures in MDX. */
export default function remarkMermaidDiagrams(): Transformer<Root> {
  const manifest = JSON.parse(
    fs.readFileSync(path.resolve("assets/diagrams/manifest.json"), "utf8"),
  ) as Record<string, Diagram>;
  return (tree) => {
    const visit = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === "code" && child.lang === "mermaid") {
          const source = child.value!.trim() + "\n";
          const id = crypto
            .createHash("sha256")
            .update(source)
            .digest("hex")
            .slice(0, 16);
          const diagram = manifest[id];
          if (!diagram)
            throw new Error(
              "Unrendered Mermaid diagram: run npm run diagrams:render",
            );
          return {
            type: "mdxJsxFlowElement",
            name: "DocDiagram",
            attributes: Object.entries({
              id,
              title: diagram.title,
              description: diagram.description,
              width: String(diagram.light.width),
              height: String(diagram.light.height),
            }).map(([name, value]) => ({
              type: "mdxJsxAttribute",
              name,
              value,
            })),
            children: [],
          } as Node;
        }
        visit(child);
        return child;
      });
    };
    visit(tree as unknown as Node);
  };
}
