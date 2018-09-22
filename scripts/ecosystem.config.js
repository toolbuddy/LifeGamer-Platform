module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'LifeGamer-Platform',
      script: 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'development'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'imslab',
      host: 'pd2b.imslab.org',
      ref: 'origin/master',
      repo: 'git@github.com:pd2-ncku/LifeGamer-Platform.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && npm run build && pm2 reload scripts/ecosystem.config.js --env production'
    },
    development: {
      user: 'gitlab-runner',
      host: 'hmkrl.com',
      ref: 'origin/dev',
      repo: 'git@github.com:pd2-ncku/LifeGamer-Platform.git',
      path: '/var/www/development',
      'post-deploy': 'npm install && npm run build && pm2 reload scripts/ecosystem.config.js --env development',
      env: {
        NODE_ENV: 'development'
      }
    }
  }
}
