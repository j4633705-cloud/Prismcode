import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";

type PendingConfirmation = {
  toolName: string;
  input: unknown;
  resolve: (confirmed: boolean) => void;
};

type ToolConfirmContextValue = {
  pending: PendingConfirmation | null;
  confirmTool: (toolName: string, input: unknown) => Promise<boolean>;
  respond: (confirmed: boolean) => void;
};

const ToolConfirmContext = createContext<ToolConfirmContextValue | null>(null);

export function useToolConfirm(): ToolConfirmContextValue {
  const value = useContext(ToolConfirmContext);
  if (!value) {
    throw new Error("useToolConfirm must be used within a ToolConfirmProvider");
  }
  return value;
}

const DESTRUCTIVE_TOOLS = new Set(["bash", "writeFile", "editFile", "gitCommit"]);

export function isDestructiveTool(toolName: string): boolean {
  return DESTRUCTIVE_TOOLS.has(toolName);
}

type ToolConfirmProviderProps = {
  children: ReactNode;
};

export function ToolConfirmProvider({ children }: ToolConfirmProviderProps) {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);

  const confirmTool = useCallback(async (toolName: string, input: unknown): Promise<boolean> => {
    if (!isDestructiveTool(toolName)) return true;
    if (process.env.PRISMCODE_AUTO === "1") return true;

    return new Promise<boolean>((resolve) => {
      const entry: PendingConfirmation = { toolName, input, resolve };
      pendingRef.current = entry;
      setPending(entry);
    });
  }, []);

  const respond = useCallback((confirmed: boolean) => {
    const entry = pendingRef.current;
    if (!entry) return;
    pendingRef.current = null;
    setPending(null);
    entry.resolve(confirmed);
  }, []);

  return (
    <ToolConfirmContext.Provider value={{ pending, confirmTool, respond }}>
      {children}
    </ToolConfirmContext.Provider>
  );
}
