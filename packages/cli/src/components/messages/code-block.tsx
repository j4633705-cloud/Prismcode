import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language }: Props) {
  const { colors } = useTheme();
  const lines = code.split("\n");
  const maxLines = 30;
  const truncated = lines.length > maxLines;
  const visible = truncated ? lines.slice(0, maxLines) : lines;
  const lineNumWidth = String(visible.length).length;

  return (
    <box flexDirection="column" width="100%">
      {language && (
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>{language}</text>
      )}
      {visible.map((line, i) => (
        <box key={i} flexDirection="row" width="100%">
          <text
            fg={colors.dimSeparator}
            attributes={TextAttributes.DIM}
          >
            {String(i + 1).padStart(lineNumWidth)} {line || " "}
          </text>
        </box>
      ))}
      {truncated && (
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          ... {lines.length - maxLines} more lines
        </text>
      )}
    </box>
  );
}
