import { pipeline, env } from "@huggingface/transformers";

// Disable local models since we are running inside browser via CDN fetching
env.allowLocalModels = false;

class PipelineSingleton {
  static task = "automatic-speech-recognition" as const;
  static model = "Xenova/whisper-tiny"; // Switched to multilingual model
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { 
        progress_callback,
        device: "wasm"
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (e: MessageEvent) => {
  const { type, audioData, language } = e.data;

  if (type === "transcribe") {
    try {
      const transcriber = await PipelineSingleton.getInstance((x: any) => {
        self.postMessage({ type: "progress", progress: x });
      });

      const output = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
        language: language || null, // pass explicit language if selected
        task: "transcribe",
        chunk_callback: (chunk: any) => {
          self.postMessage({ type: "chunk", chunk });
        }
      });

      self.postMessage({ type: "done", output });
    } catch (err: any) {
      self.postMessage({ type: "error", error: err.message });
    }
  }
});
