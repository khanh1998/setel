declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      RABBITMQ_URL: string;
      RABBITMQ_QUEUE: string;
      RABBITMQ_DURABLE: boolean;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
