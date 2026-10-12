import { defineConfig } from '@mikro-orm/postgresql';
import 'dotenv/config';
export default defineConfig({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME ?? 'desafio_jungle',
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    migrations: {
        path: './dist/migrations',
        pathTs: './src/migrations',
        glob: '!(*.d).{js,ts}',
    },
});
//# sourceMappingURL=mikro-orm.config.js.map