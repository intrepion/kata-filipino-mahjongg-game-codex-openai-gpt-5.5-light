module.exports = {
  testDir: "./test/browser",
  use: {
    baseURL: "http://127.0.0.1:8765",
  },
  webServer: {
    command: "python3 -m http.server 8765 --bind 127.0.0.1",
    reuseExistingServer: true,
    url: "http://127.0.0.1:8765/index.html",
  },
};
