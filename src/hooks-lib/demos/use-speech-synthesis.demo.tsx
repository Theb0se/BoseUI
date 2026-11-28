"use client";

import React, { useState } from "react";
import { useSpeechSynthesis } from "../hooks/use-speech-synthesis";

export function UseSpeechSynthesisDemo() {
  const { isSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();
  const [text, setText] = useState("Hello! This is BoseUI speech synthesis.");

  return (
    <div className="w-full max-w-md space-y-3">
      {!isSupported ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50">
          SpeechSynthesis API is not supported in this browser.
        </div>
      ) : (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => speak(text)}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
            >
              {isSpeaking ? "Speaking..." : "Speak Text"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
            >
              Stop
            </button>
          </div>
        </>
      )}
    </div>
  );
}
