import express from 'express';
import { userTable } from '../db/user-table';

const router = express.Router();

router.post('/users/login', (req, res): void => {
  try {
    const { name }: { name: unknown } = req.body;

    if (typeof name !== 'string') {
      res.status(400).send({
        error: `User name is required.`,
      });
      return;
    }

    if (!userTable.isAvailable(name)) {
      res.status(400).send({
        error: `The name ${name} is already in use.`,
      });
      return;
    }

    const newUser = userTable.add(name);
    res.status(201).send(newUser);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
