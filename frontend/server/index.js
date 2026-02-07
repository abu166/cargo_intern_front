import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getClientsDb, getStaffDb } from './db.js';
import authRoutes from './routes/auth.js';
import shipmentRoutes from './routes/shipments.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server and Socket.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

// Make io available to routes
app.set('io', io);

app.use(cors());
app.use(express.json());

// Initialize DBs
Promise.all([getClientsDb(), getStaffDb()]).then(() => {
    console.log('Databases initialized');
}).catch(err => {
    console.error('Failed to initialize databases:', err);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on station (for receivers)
    socket.on('join-station', (station) => {
        socket.join(`station:${station}`);
        console.log(`Socket ${socket.id} joined station: ${station}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('WebSocket server ready');
});

export { io };
