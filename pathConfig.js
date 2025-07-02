// I use pathConfig instead of using .sequelizerc file, so I can control my path and code to ES Module

import path from 'path';

// Use path.resolve to set paths
const configPath = path.resolve('config', 'config.js');
const modelsPath = path.resolve('db', 'models');
const seedersPath = path.resolve('db', 'seeders');
const migrationsPath = path.resolve('db', 'migrations');

export default {
  config: configPath,
  'models-path': modelsPath,
  'seeders-path': seedersPath,
  'migrations-path': migrationsPath,
};
