module.exports = {
  apps: [
    {
      name: "proxy",
      script: "./dist/proxy.js",
      interpreter: "node",
      autorestart: true,
      max_memory_restart: "100M",
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "status",
      script: "./dist/src/servers/status/server.js",
      interpreter: "node",
      autorestart: true,
      max_memory_restart: "100M",
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "api",
      script: "./dist/src/servers/api/server.js",
      interpreter: "node",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "cdn",
      script: "./dist/src/servers/cdn/server.js",
      interpreter: "node",
      autorestart: true,
      max_memory_restart: "150M",
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "main",
      script: "./dist/src/servers/main/server.js",
      interpreter: "node",
      autorestart: true,
      max_memory_restart: "150M",
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    }
  ],
};