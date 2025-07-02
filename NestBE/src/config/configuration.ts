type ConfigType = {
  port: number;
  database: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  google: {
    clientId?: string;
    clientSecret?: string;
  };
  bcrypt: {
    saltRounds: number;
  };
};

const configuration = (): ConfigType => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/intensity-fitness',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
});

export default configuration;
