/**
 * Configuration PM2 — CIPREL Compétences
 * Démarrage : pm2 start ecosystem.config.js
 */
module.exports = {
  apps: [
    {
      name: 'ciprel-competences',
      cwd: '/var/www/ciprel-competences',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/ciprel-competences.error.log',
      out_file: '/var/log/pm2/ciprel-competences.out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
