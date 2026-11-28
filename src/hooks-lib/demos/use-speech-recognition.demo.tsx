"use client";

import React from "react";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";

export function UseSpeechRecognitionDemo() {
  const { isSupported, isListening, transcript, error, start, stop, reset } =
    useSpeechRecognition();

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      {!isSupported ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50">
          SpeechRecognition API is not supported in this browser.
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={isListening ? stop : start}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
            >
              {isListening ? "Stop Listening" : "Start Microphone"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
            >
              Clear
            </button>
          </div>
          <div className="min-h-16 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
            {error ? (
              <span className="text-rose-500">{error}</span>
            ) : (
              <span>{transcript || "Speak into your microphone..."}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
