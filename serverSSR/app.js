import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import cors from 'cors';
import raiderRouter from './routers/raiderRouter.js';


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
    cookie: {secure: false}
}));

app.use(raiderRouter);

const PORT = Number(provess.env.PORT) || 8080;
app.listen(PORT, () => console.log("Server is running on", PORT));