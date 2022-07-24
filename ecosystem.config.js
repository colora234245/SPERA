module.exports = {
  apps: [
    {
      name: "Welcome",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Welcome"
    },
    {
      name: "Mainframe",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Voucher"
    },
    {
      name: "Requirements",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Requirements"
    },
    {
      name: "Statistics",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Statistics"
    },
    {
      name: "Security_I",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_I"
    },
    {
      name: "Security_II",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_II"
    },
    {
      name: "Security_III",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_III"
    },
    {
      name: "Security_IV",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_IV"
    },
    {
      name: "Distributors",
      namespace: "ramal",
      script: 'main.ramal',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Distributors"
    },
  ]
};