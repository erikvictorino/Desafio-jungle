import { defineConfig } from '@mikro-orm/postgresql';
import 'dotenv/config'

//configurando mikroORM
export default defineConfig({
  //local do banco
  host: process.env.DB_HOST ?? 'localhost',
  //porta que o banco vai usar 
  port: Number(process.env.DB_PORT ?? 5432),
  //credenciais do usuario
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD,
  //nome do banco
  dbName: process.env.DB_NAME ?? 'desafio_jungle',
  //entidades e migrations
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
});