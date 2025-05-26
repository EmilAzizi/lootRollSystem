import { Router } from 'express';
import db from '../database/connectionToDatabase.js';
import { isAuthenticated } from '../util/authMiddleware.js';

const router = Router();

// Middleware: only allow admins (officers)
function isAdmin(req, res, next) {
  if (req.session?.user?.isAdmin === 'true' || req.session?.user?.isAdmin === true) {
    return next();
  }
  return res.status(403).send({ message: 'Forbidden: Admins only' });
}

// GET all raiders (non-admin users)
router.get('/auth/raiders', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const [raiders] = await db.execute('SELECT * FROM users');
    res.send(raiders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch raiders' });
  }
});

// PATCH: increment loot count
router.patch('/auth/user/:id/increment-loot', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE users SET amountofLoot = amountofLoot + 1 WHERE id = ?', [id]);
    res.send({ message: 'Loot incremented' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to increment loot' });
  }
});

// PATCH: change raider rank
router.patch('/auth/user/:id/rank', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { newRank } = req.body;
  try {
    await db.execute('UPDATE users SET userrank = ? WHERE id = ?', [newRank, id]);
    res.send({ message: 'Rank updated' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to update rank' });
  }
});

// DELETE: remove a raider
router.delete('/auth/user/:id', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.send({ message: 'Raider deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to delete raider' });
  }
});

export default router;
