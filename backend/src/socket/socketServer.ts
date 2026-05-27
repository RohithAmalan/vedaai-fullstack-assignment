import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

let io: SocketServer;

export const initSocket = (server: HttpServer): SocketServer => {
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(o => o.trim());

  io = new SocketServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('subscribe:job', (jobId: string) => {
      socket.join(`job:${jobId}`);
    });

    socket.on('unsubscribe:job', (jobId: string) => {
      socket.leave(`job:${jobId}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const emitToJob = (jobId: string, event: string, data: unknown): void => {
  getIO().to(`job:${jobId}`).emit(event, data);
};
