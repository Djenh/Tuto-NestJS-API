import { join } from "path";

export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  api: {
    key: process.env.API_KEY,
  },
//   port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret : process.env.JWT_SECRET,
  },
  multer: {
    destination : join(process.cwd(), 'src', 'public', 'files')
  }
});