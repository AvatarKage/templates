module.exports = {
  apps: [
    {
      name: "proxy",
      script: "./proxy.ts",
      interpreter: "node",
      node_args: "--import tsx",
      autorestart: true,
      max_memory_restart: "1G",
      watch: [
        "./proxy.ts",
        "./src/classes",
        "./src/config",
        "./src/helpers",
        "./src/middlewares",
        "./src/modules"
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
      max_memory_restart: "1G",
      watch: [
        "./src/servers/status",
        "./src/classes",
        "./src/config",
        "./src/helpers",
        "./src/middlewares",
        "./src/modules"
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
      max_memory_restart: "1G",
      watch: [
        "./src/servers/api",
        "./src/classes",
        "./src/config",
        "./src/helpers",
        "./src/middlewares",
        "./src/modules"
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
      max_memory_restart: "1G",
      watch: [
        "./src/servers/cdn",
        "./src/classes",
        "./src/config",
        "./src/helpers",
        "./src/middlewares",
        "./src/modules"
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
      max_memory_restart: "1G",
      watch: ["./src"],
      watch: [
        "./src/servers/main",
        "./src/classes",
        "./src/config",
        "./src/helpers",
        "./src/middlewares",
        "./src/modules"
      ],
      env: {
        NODE_OPTIONS: "--no-warnings",
        FORCE_COLOR: "1"
      }
    }
  ]
};