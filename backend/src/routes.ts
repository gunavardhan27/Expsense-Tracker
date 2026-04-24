import { Router } from 'express';
import { service } from './service';
import { HttpStatus, LogLevel } from './enums';
import { log } from './utils';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const expense = await service.createExpense(req.body);
    res.status(HttpStatus.Created).json({ data: expense });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.startsWith('400:')) {
        res.status(HttpStatus.BadRequest).json({ error: error.message.split('400:')[1] });
      } else if (error.message.startsWith('422:')) {
        res.status(HttpStatus.UnprocessableEntity).json({ error: error.message.split('422:')[1] });
      } else {
        log(LogLevel.Error, 'Unexpected error in POST /expenses', { error: error.message });
        res.status(HttpStatus.InternalServerError).json({ error: 'Internal server error' });
      }
    } else {
      log(LogLevel.Error, 'Unknown error in POST /expenses');
      res.status(HttpStatus.InternalServerError).json({ error: 'Internal server error' });
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, sort } = req.query;
    const query: { category?: string; sort?: string } = {};
    if (typeof category === 'string') query.category = category;
    if (typeof sort === 'string') query.sort = sort;
    const result = await service.listExpenses(query);
    res.status(HttpStatus.OK).json({ data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      log(LogLevel.Error, 'Unexpected error in GET /expenses', { error: error.message });
    }
    res.status(HttpStatus.InternalServerError).json({ error: 'Internal server error' });
  }
});

export default router;
