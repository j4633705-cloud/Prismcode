import { useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useToolConfirm } from "../providers/tool-confirm";
import { useKeyboardLayer } from "../providers/keyboard-layer";

export function ToolConfirmBanner() {
  const { pending, respond } = useToolConfirm();
  const { isTopLayer } = useKeyboardLayer();

  const handleKey = useCallback((key: { name: string; preventDefault: () => void }) => {
    if (!pending) return;
    if (!isTopLayer("tool-confirm")) return;

    if (key.name === "y" || key.name === "return" || key.name === "enter") {
      key.preventDefault();
      respond(true);
    } else if (key.name === "n" || key.name === "escape") {
      key.preventDefault();
      respond(false);
    }
  }, [pending, respond, isTopLayer]);

  useKeyboard(handleKey);

  if (!pending) return null;

  const safeInput = typeof pending.input === "object" && pending.input !== null
    ? JSON.stringify(pending.input, null, 1).slice(0, 200)
    : String(pending.input).slice(0, 200);

  return (
    <box
      width="100%"
      backgroundColor="#5a3e00"
      paddingX={1}
      height={3}
      flexDirection="column"
    >
      <box height={1}>
        <text attributes={TextAttributes.BOLD} selectable={false}>
          {" "}Allow {pending.toolName}?
        </text>
      </box>
      <box height={1} overflow="hidden">
        <text selectable={false}>
          {" "}{safeInput}
        </text>
      </box>
      <box height={1}>
        <text selectable={false} attributes={TextAttributes.DIM}>
          {" "}Y = Allow  N = Deny
        </text>
      </box>
    </box>
  );
}
