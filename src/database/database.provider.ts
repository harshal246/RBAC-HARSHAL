import { createPool } from 'mysql2/promise';

export const databaseProviders = [
  {
    provide: 'MYSQL_POOL',
    useFactory: async () => {
      return createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
      });
    },
  },
];