import express from 'express';
import cors from 'cors';
import { appendToSheet } from '../services/sheets.js';
import { createCalendarEvent } from '../services/calendar.js';

const router = express.Router();

router.post('/sheets', async (req, res) => {
  const { sheetId, range, data } = req.body;
  try {
    await appendToSheet(sheetId, range, data);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post('/calendar', async (req, res) => {
  const { calendarId, event } = req.body;
  try {
    await createCalendarEvent(calendarId, event);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
