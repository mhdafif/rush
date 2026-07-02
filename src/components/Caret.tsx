import type { CaretStyle } from "../store/settings/ISettingsStore";

interface CaretProps {
  style?: CaretStyle;
}

export function Caret({ style = "line" }: CaretProps) {
  if (style === "underline") {
    return (
      <span
        className="caret-underline mx-px inline-block align-baseline"
        style={{
          width: "0.6em",
          height: 2,
          verticalAlign: "baseline",
          marginBottom: -2,
        }}
      />
    );
  }
  // line (default)
  return (
    <span
      className="caret-line mx-px inline-block align-middle"
      style={{ width: 2, height: "1.2em", verticalAlign: "middle" }}
    />
  );
}
