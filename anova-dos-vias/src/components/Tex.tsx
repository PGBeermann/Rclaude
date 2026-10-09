import katex from "katex";
import "katex/dist/katex.min.css";
import "./tex.css";
import React, { useMemo } from "react";

export const Tex: React.FC<{
  tex: string;
  display?: boolean;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ tex, display = false, size = 34, color, style }) => {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "ignore" }),
    [tex, display],
  );
  return (
    <span
      style={{ fontSize: size, color, display: display ? "block" : "inline-block", ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
