// Web Worker — runs model loading and inference off the main thread.

import { pipeline, env, type TextGenerationPipeline } from "@huggingface/transformers";

env.useBrowserCache = true;
env.allowLocalModels = false;

let generator: TextGenerationPipeline | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data as {
    type: "load" | "generate";
    payload: Record<string, unknown>;
  };

  if (type === "load") {
    try {
      generator = await pipeline("text-generation", payload.modelId as string, {
        device: payload.device as "webgpu" | "webnn" | "webnn-gpu" | "webnn-npu" | "wasm",
        dtype: payload.dtype as "q4f16" | "q4" | "fp16" | "fp32",
        progress_callback: (info: { status?: string; progress?: number; file?: string }) => {
          // progress is already 0–100
          self.postMessage({
            type: "progress",
            status: info.status,
            progress: info.progress ?? 0,
            file: info.file ?? "",
          });
        },
      });
      self.postMessage({ type: "ready", device: payload.device });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
  }

  if (type === "generate") {
    if (!generator) {
      self.postMessage({ type: "error", message: "Model not loaded" });
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (generator as any)(payload.messages, {
        max_new_tokens: 300,
        temperature: 0.7,
        do_sample: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text: string = (result as any)[0]?.generated_text?.at(-1)?.content ?? "…";
      self.postMessage({ type: "result", text });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
  }
};
