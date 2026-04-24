module.exports = {
  apps: [
    {
      name: "proxy",
      script: "./proxy.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "100M",
      watch: [
        "./proxy.ts",
        "./src/**/*"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "status",
      script: "./src/servers/status/server.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "100M",
      watch: true,
      watch: [
        "./src/**/*"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "api",
      script: "./src/servers/api/server.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "500M",
      watch: true,
      watch: [
        "./src/**/*"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "cdn",
      script: "./src/servers/cdn/server.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "150M",
      watch: true,
      watch: [
        "./src/**/*"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    },
    {
      name: "main",
      script: "./src/servers/main/server.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "150M",
      watch: true,
      watch: [
        "./src/**/*"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    }
  ]
};