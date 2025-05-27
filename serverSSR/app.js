import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import cors from 'cors';
import raiderRouter from './routers/raiderRouter.js';
import authRouter from './routers/authRouter.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Make io available in routes via req.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routers
app.use(raiderRouter);
app.use(authRouter);

// Socket.IO listeners
io.on('connection', socket => {
    console.log('Socket connected:', socket.id);

    socket.on('update', () => {
        socket.broadcast.emit('refresh');
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

// Use server.listen, not app.listen
const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
