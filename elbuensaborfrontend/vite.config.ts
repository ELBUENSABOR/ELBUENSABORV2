import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const allowedHosts = [
  "6342-2803-9800-9843-7bb4-c89e-1fd1-6fc2-1fd7.ngrok-free.app",
  ".up.railway.app",
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "6342-2803-9800-9843-7bb4-c89e-1fd1-6fc2-1fd7.ngrok-free.app",
      "frontend-sandbox-dc89.up.railway.app",
    ],
  },
});
