import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../database/connectionToDatabase.js';

const router = Router();

// POST: Login route
router.post('/auth/login', async (req, res) => {
	const { username, password } = req.body;
	const [userRow] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
	const user = userRow[0];

	if (!user) return res.status(401).send({ message: 'Invalid username' });

    console.log('Login attempt:', { password, user });
	const match = await bcrypt.compare(password, user.userPassword);
	if (!match) return res.status(401).send({ message: 'Invalid password' });

	req.session.user = user;
	res.send({ message: 'Login successful' });
});

// GET: Check session
router.get('/auth/me', (req, res) => {
	if (req.session?.user) {
		res.send({ user: req.session.user });
	} else {
		res.status(401).send({ error: 'Not authenticated' });
	}
});

// POST: Logout
router.post('/auth/logout', (req, res) => {
	req.session.destroy(() => {
		res.send({ message: 'Logged out' });
	});
});

export default router;
