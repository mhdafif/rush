import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { WordState } from "../hooks/useTypingEngine";
import useTypingStore from "../store/typing/typingStore";
import { TypingArena } from "./TypingArena";

const baseProps = {
  words: ["hello", "world"],
  wordStates: ["active", "pending"] as WordState[],
  currentInput: "he",
  currentIndex: 0,
  lockedInputs: {},
  handleKeyDown: () => {},
};

describe("TypingArena live keyboard", () => {
  it("shows typed keys on the live keyboard while running", () => {
    useTypingStore.getState().setState("isPaused", false);
    const { container } = render(
      <TypingArena {...baseProps} phase="running" />
    );

    expect(screen.getByLabelText("live typing keyboard")).toBeInTheDocument();
    expect(
      container.querySelector('[data-key="h"][data-active="true"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-key="e"][data-active="true"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-key="a"][data-active="true"]')
    ).not.toBeInTheDocument();
  });

  it("fades the live typing keyboard out outside the running phase", () => {
    useTypingStore.getState().setState("isPaused", false);
    render(<TypingArena {...baseProps} phase="idle" />);

    const keyboard = screen.getByTestId("live-keyboard-wrap");
    expect(keyboard.className).toContain("opacity-0");
  });

  it("dims the live typing keyboard with the same pause transition timing", () => {
    useTypingStore.getState().setState("isPaused", true);
    render(<TypingArena {...baseProps} phase="running" />);

    const keyboard = screen.getByTestId("live-keyboard-wrap");
    expect(keyboard.className).toContain("transition-opacity");
    expect(keyboard.className).toContain("duration-300");
    expect(keyboard.className).toContain("opacity-10");
  });

  it("marks wrong live typed keys as red", () => {
    useTypingStore.getState().setState("isPaused", false);
    const { container } = render(
      <TypingArena {...baseProps} currentInput="ha" phase="running" />
    );

    expect(
      container.querySelector('[data-key="h"][data-tone="active"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-key="a"][data-tone="wrong"]')
    ).toBeInTheDocument();
  });
});
