import { defineConfig } from "cypress";
import webpack from "@cypress/webpack-preprocessor";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: {
          resolve: {
            alias: {
              "@": require("path").resolve(__dirname, "../../src"),
            },
          },
        },
      };
      on("file:preprocessor", webpack(options));
    },
    supportFile: false,
    specPattern: "**/*.test.{ts,tsx}",
  },
});
