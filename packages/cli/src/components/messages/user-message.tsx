import { Mode, type ModeType } from "@prismcode/shared";
import { EmptyBorder } from "../border";
import { useTheme } from "../../providers/theme";
import type { ImageAttachment } from "../../hooks/use-chat";

type Props = {
  message: string;
  mode: ModeType;
  images?: ImageAttachment[];
};

export function UserMessage({ message, mode, images }: Props) {
  const { colors } = useTheme();

  return (
    <box width="100%" alignItems="center">
      <box
        border={["left"]}
        borderColor={mode === Mode.PLAN ? colors.planMode : colors.primary}        width="100%"
        customBorderChars={{
          ...EmptyBorder,
          vertical: "┃",
          bottomLeft: "╹",
        }}
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width="100%"
        >
          <box flexDirection="column" width="100%">
            {images && images.length > 0 && (
              <box flexDirection="row" gap={1} paddingBottom={1}>
                {images.map((img, i) => (
                  <text key={i} fg={colors.info}>
                    {`[IMG] ${img.path}`}
                  </text>
                ))}
              </box>
            )}
            <text>{message}</text>
          </box>
        </box>
      </box>
    </box>
  );
};

