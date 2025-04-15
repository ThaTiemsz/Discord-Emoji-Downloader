import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, type Plugin } from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss() as Plugin[],
    ],
})
