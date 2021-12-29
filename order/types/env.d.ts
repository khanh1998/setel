declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_HOST: string;
      DATABASE_PORT: number;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_PORT_TEST: number;
      NODE_ENV: 'development' | 'production' | 'test';
      RABBITMQ_URL: string;
      RABBITMQ_QUEUE: string;
      RABBITMQ_DURABLE: boolean;
      DELIVERY_DURATION: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
