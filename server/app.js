import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import syncRoutes from './routes/sync.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sync', syncRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
