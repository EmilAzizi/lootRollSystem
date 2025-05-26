import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import cors from 'cors';
import raiderRouter from './routers/raiderRouter.js';
import authRouter from './routers/authRouter.js';

const app = express();

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

// Mount routers
app.use(raiderRouter);
app.use(authRouter);

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log("Server is running on", PORT));
