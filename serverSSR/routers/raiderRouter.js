import { Router } from 'express';
import db from '../database/connectionToDatabase.js';
import { isAuthenticated } from '../util/authMiddleware.js';

const router = Router();

// Middleware: only allow admins (officers)
function isAdmin(req, res, next) {
  if (req.session?.user?.isAdmin === 'true') {
    return next();
  }
  return res.status(403).send({ message: 'Forbidden: Admins only' });
}

// GET all raiders
router.get('/auth/raiders', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const raiders = await db.all('SELECT * FROM users WHERE isAdmin = "false"');
    res.send(raiders);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch raiders' });
  }
});

// PATCH: increment loot count
router.patch('/auth/user/:id/increment-loot', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run(`UPDATE users SET amountofLoot = amountofLoot + 1 WHERE id = ?`, [id]);
    res.send({ message: 'Loot incremented' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to increment loot' });
  }
});

// PATCH: change rank
router.patch('/auth/user/:id/rank', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { newRank } = req.body;
  try {
    await db.run(`UPDATE users SET rank = ? WHERE id = ?`, [newRank, id]);
    res.send({ message: 'Rank updated' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update rank' });
  }
});

// DELETE: remove a raider
router.delete('/auth/user/:id', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run(`DELETE FROM users WHERE id = ?`, [id]);
    res.send({ message: 'Raider deleted' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete raider' });
  }
});

export default router;
