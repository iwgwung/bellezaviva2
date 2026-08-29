import { calendar } from './google.js';

export const createCalendarEvent = async (calendarId, event) => {
  return await calendar.events.insert({
    calendarId: calendarId,
    requestBody: event,
  });
};
