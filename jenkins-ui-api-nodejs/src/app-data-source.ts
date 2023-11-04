import { JobDetailsEntity } from './job-details.entity';
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "postgres",
  synchronize: process.env.DB_SYNCHRONIZE === "true", // Be cautious with this in production!
  logging: process.env.DB_LOGGING === "true",
  entities: [JobDetailsEntity],
});
  
AppDataSource.initialize();

module.exports = {
  AppDataSource
}