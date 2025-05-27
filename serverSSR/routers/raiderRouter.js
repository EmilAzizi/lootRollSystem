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
    req.io.emit('refresh');
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
    req.io.emit('refresh');
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
    req.io.emit('refresh');
    res.send({ message: 'Raider deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to delete raider' });
  }
});

// PATCH: toggle admin status
router.patch('/auth/user/:id/toggle-admin', isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT isAdmin FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send({ message: 'User not found' });

    const currentStatus = rows[0].isAdmin === 'true';
    const newStatus = !currentStatus ? 'true' : 'false';

    await db.execute('UPDATE users SET isAdmin = ? WHERE id = ?', [newStatus, id]);
    req.io.emit('refresh');
    res.send({ message: `Admin status updated to ${newStatus}` });
  } catch (err) {
    res.status(500).send({ error: 'Failed to toggle admin status' });
  }
});


export default router;
