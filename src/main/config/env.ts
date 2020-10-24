export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-ts',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
  defaultSalt: Number(process.env.DEFAULT_SALT) || 12
};
