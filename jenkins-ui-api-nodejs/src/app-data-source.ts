import { JobDetailsEntity } from './job-details.entity';
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    entities: [
      JobDetailsEntity,
    ],
  })
  
  AppDataSource.initialize();

  module.exports = {
    AppDataSource
  }