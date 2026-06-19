import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type DiffLine = {
  kind: "header" | "ctx" | "add" | "del" | "hunk";
  text: string;
};

function parseDiff(diffText: string): DiffLine[] {
  const lines: DiffLine[] = [];
  for (const raw of diffText.split("\n")) {
    if (raw.startsWith("---") || raw.startsWith("+++")) {
      lines.push({ kind: "header", text: raw });
    } else if (raw.startsWith("@@")) {
      lines.push({ kind: "hunk", text: raw });
    } else if (raw.startsWith("+")) {
      lines.push({ kind: "add", text: raw });
    } else if (raw.startsWith("-")) {
      lines.push({ kind: "del", text: raw });
    } else {
      lines.push({ kind: "ctx", text: raw });
    }
  }
  return lines;
}

function isUnifiedDiff(text: string): boolean {
  return /^--- .+\n\+\+\+ /.test(text.trim());
}

type Props = {
  text: string;
  maxLines?: number;
};

export function DiffViewer({ text, maxLines = 40 }: Props) {
  const { colors } = useTheme();
  const lines = parseDiff(text);
  const truncated = lines.length > maxLines;
  const visible = truncated ? lines.slice(0, maxLines) : lines;

  return (
    <box flexDirection="column" width="100%">
      {visible.map((line, i) => {
        const prefix =
          line.kind === "add" ? "+ " :
          line.kind === "del" ? "- " :
          line.kind === "hunk" ? "  " :
          line.kind === "header" ? "  " : "  ";

        const color =
          line.kind === "add" ? colors.success :
          line.kind === "del" ? colors.error :
          line.kind === "hunk" ? colors.info : undefined;

        const dim = line.kind === "ctx" || line.kind === "header" || line.kind === "hunk";

        return (
          <box key={i} flexDirection="row" width="100%">
            <text
              fg={color}
              attributes={dim ? TextAttributes.DIM : undefined}
            >
              {prefix}{line.kind === "add" || line.kind === "del" ? line.text.slice(1) : line.text}
            </text>
          </box>
        );
      })}
      {truncated && (
        <text fg={colors.dimSeparator} attributes={TextAttributes.DIM}>
          ... {lines.length - maxLines} more lines truncated
        </text>
      )}
    </box>
  );
}

export function detectDiff(text: string): boolean {
  return isUnifiedDiff(text);
}

export { isUnifiedDiff };
