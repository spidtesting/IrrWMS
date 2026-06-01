"use client";

import { useEffect, useRef } from "react";

type KeyboardShortcutOptions = {
  enabled?: boolean;
  preventDefault?: boolean;
  allowInInput?: boolean;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: KeyboardShortcutOptions = {},
): void {
  const { enabled = true, preventDefault = true, allowInInput = false } = options;

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const normalizedKeys = keys.map((key) => key.toLowerCase());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!allowInInput && isEditableTarget(event.target)) {
        return;
      }

      const pressed = [
        event.ctrlKey || event.metaKey ? "ctrl" : "",
        event.shiftKey ? "shift" : "",
        event.altKey ? "alt" : "",
        event.key.toLowerCase(),
      ].filter(Boolean);

      const matches =
        pressed.length === normalizedKeys.length &&
        normalizedKeys.every((key, index) => pressed[index] === key);

      if (!matches) {
        return;
      }

      if (preventDefault) {
        event.preventDefault();
      }

      callbackRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [allowInInput, enabled, keys, preventDefault]);
}
