import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.js';
import { fileURLToPath } from 'url';

// Get the current file URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const sequelize = new Sequelize(
  dbConfig.database, 
  dbConfig.username, 
  dbConfig.password, 
  {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  logging: console.log // Enable logging for debugging
  
});


// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Stack Trace:', error.stack);
    console.error('Original Error:', error.original);
  }
})();

const db = {};

// Read files from the current directory
const modelFiles = fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 && 
    file !== path.basename(__filename) && 
    file.slice(-3) === '.js'
  ));

const importModels = async () => {
  for (const file of modelFiles) {
    const modelPath = path.join(__dirname, file);
    const model = (await import(modelPath)).default(sequelize, DataTypes);
    db[model.name] = model;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

await importModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
