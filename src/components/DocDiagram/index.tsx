import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

type Props = {
  id: string;
  title: string;
  description: string;
  width: string;
  height: string;
};

export default function DocDiagram({
  id,
  title,
  description,
  width,
  height,
}: Props): React.ReactNode {
  const light = useBaseUrl(`/img/diagrams/${id}-light.svg`);
  const dark = useBaseUrl(`/img/diagrams/${id}-dark.svg`);
  const source = useBaseUrl(`/img/diagrams/${id}.mmd`);
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
            minWidth: Math.min(Number(width), 760),
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
            minWidth: Math.min(Number(width), 760),
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
        <strong>{title}.</strong> {description}
      </figcaption>
      <p className="doc-diagram__help">
        Scroll the diagram on narrow screens, or open it for a larger view.{" "}
        <a href={source} download>
          Download Mermaid source
        </a>
        .
      </p>
    </figure>
  );
}
