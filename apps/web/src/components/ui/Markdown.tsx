import { Fragment, type ReactNode } from "react";

type Block =
  { kind: "h2" | "h3" | "p"; text: string } | { kind: "ul"; items: string[] };

// Our transport guides only use headings, bullet lists, paragraphs and **bold**, so a tiny
// parser is enough and saves shipping a markdown library.
const parse = (source: string) => {
  const blocks: Block[] = [];
  for (const chunk of source.trim().split(/\n{2,}/)) {
    const lines = chunk.split("\n");
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({ kind: "ul", items: lines.map((line) => line.slice(2)) });
    } else if (chunk.startsWith("### ")) {
      blocks.push({ kind: "h3", text: chunk.slice(4) });
    } else if (chunk.startsWith("## ")) {
      blocks.push({ kind: "h2", text: chunk.slice(3) });
    } else {
      blocks.push({ kind: "p", text: lines.join(" ") });
    }
  }
  return blocks;
};

const inline = (text: string): ReactNode =>
  text
    .split(/(\*\*[^*]+\*\*)/)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );

export const Markdown = ({ source }: { source: string }) => (
  <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-secondary sm:text-base">
    {parse(source).map((block, i) => {
      switch (block.kind) {
        case "h2":
          return (
            <h2
              key={i}
              className="mt-4 text-xl font-semibold text-foreground first:mt-0"
            >
              {inline(block.text)}
            </h2>
          );
        case "h3":
          return (
            <h3
              key={i}
              className="mt-2 text-base font-semibold text-foreground"
            >
              {inline(block.text)}
            </h3>
          );
        case "ul":
          return (
            <ul
              key={i}
              className="flex list-disc flex-col gap-1.5 pl-5 marker:text-primary"
            >
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        case "p":
          return <p key={i}>{inline(block.text)}</p>;
      }
    })}
  </div>
);
