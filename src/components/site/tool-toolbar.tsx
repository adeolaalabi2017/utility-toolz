"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * The tool page owns one toolbar; tools send Share, Export and similar
 * actions into it so they sit in the same place on every tool.
 * undefined: not on a tool page. null: the page is still mounting.
 */
export const ToolToolbarContext = createContext<HTMLElement | null | undefined>(undefined);

export const useInToolPage = () => useContext(ToolToolbarContext) !== undefined;

export function ToolbarPortal({ children }: { children: ReactNode }) {
  const slot = useContext(ToolToolbarContext);
  if (slot === undefined) return <>{children}</>;
  return slot ? createPortal(children, slot) : null;
}
