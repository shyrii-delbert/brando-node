declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      SECRET_ID: string;
      SECRET_KEY: string;
      BUCKET_REGION: string;
      IMAGES_BUCKET_NAME: string;
    };
  };
}

export { }
