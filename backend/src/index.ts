import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initSocket } from './socket/socketServer';
import assignmentRoutes from './routes/assignments.routes';
import uploadRoutes from './routes/upload.routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/assignments', assignmentRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
