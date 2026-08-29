import { sheets } from './google.js';

export const appendToSheet = async (sheetId, range, data) => {
  return await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: range,
    valueInputOption: 'RAW',
    requestBody: { values: [data] },
  });
};
