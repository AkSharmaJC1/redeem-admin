import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	preview: {
		allowedHosts: [
			'redeemedadmin.jcsoftwaresolution.in',
			'localhost'
		]
	},
	 server: {
    host: true, // listen on all addresses
    port: 6003, // or your preferred port
  }
});
