import { defineConfig } from "vite"
import vinext from "vinext"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  clearScreen: false,
  server: {
    port: 36001,
    strictPort: true,
  },
  plugins: [
    vinext(),
    cloudflare({
      inspectorPort: 36101,
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
})
