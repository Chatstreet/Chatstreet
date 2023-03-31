// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    settings: {
      "vetur.useWorkspaceDependencies": true,
      "vetur.experimental.templateInterpolationService": true
    },
    projects: [
      './apps/chatstreet-frontend',
      {
        root: './apps/chatstreet-frontend',
        package: './apps/chatstreet-frontend/package.json',
        tsconfig: './apps/chatstreet-frontend/tsconfig.json',
        globalComponents: [
          './apps/chatstreet-frontend/src/components/**/*.vue'
        ]
      }
    ]
  }