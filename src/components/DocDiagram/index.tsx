import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

type Props = {
  id: string;
  title: string;
  description: string;
  width: string;
  height: string;
  lightHash: string;
  darkHash: string;
};

export default function DocDiagram({
  id,
  title,
  description,
  width,
  height,
  lightHash,
  darkHash,
}: Props): React.ReactNode {
  const light = useBaseUrl(`/img/diagrams/${id}-light.svg?v=${lightHash}`);
  const dark = useBaseUrl(`/img/diagrams/${id}-dark.svg?v=${darkHash}`);
  const source = useBaseUrl(`/img/diagrams/${id}.mmd`);
  // Keep SVG labels at least 14px when a wide diagram needs horizontal scrolling.
  const minimumWidth = Math.min(
    Number(width),
    Math.max(760, Math.round(Number(width) * 0.875)),
  );
  return (
    <figure className="doc-diagram">
      <div
        className="doc-diagram__viewport"
        role="region"
        aria-label={title}
        tabIndex={0}
      >
        <a
          className="doc-diagram__image doc-diagram__light"
          href={light}
          style={{
            minWidth: minimumWidth,
            maxWidth: Number(width),
            marginInline: "auto",
          }}
        >
          <img
            src={light}
            alt={title}
            width={width}
            height={height}
            loading="lazy"
          />
        </a>
        <a
          className="doc-diagram__image doc-diagram__dark"
          href={dark}
          style={{
            minWidth: minimumWidth,
            maxWidth: Number(width),
            marginInline: "auto",
          }}
        >
          <img
            src={dark}
            alt={title}
            width={width}
            height={height}
            loading="lazy"
          />
        </a>
      </div>
      <figcaption>
        <p>
          <strong>{title}.</strong> {description}
        </p>
      </figcaption>
      <div className="doc-diagram__help">
        Scroll horizontally when needed, or open the diagram for a larger view.{" "}
        <a href={source} download>
          Download Mermaid source
        </a>
        .
      </div>
    </figure>
  );
}
