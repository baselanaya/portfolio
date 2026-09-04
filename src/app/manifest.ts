import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Basel Anaya — AI Infrastructure",
    short_name: "Basel Anaya",
    description:
      "Maximlabs — AI infrastructure: kernel-level sandboxes, local LLM inference, and the data pipelines between them.",
    start_url: "/",
    display: "browser",
    background_color: "#FAFAF7",
    theme_color: "#FAFAF7",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
