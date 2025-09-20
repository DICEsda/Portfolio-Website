const express = require('express');
const axios = require('axios');
const { Low, JSONFile } = require('lowdb');
require('dotenv').config();
const router = express.Router();

const db = new Low(new JSONFile('food-log.json'));
db.data ||= { logs: [] };

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// POST /log-food
router.post('/log-food', async (req, res) => {
  await db.read();
  const entry = { ...req.body, timestamp: new Date().toISOString() };
  db.data.logs.push(entry);
  await db.write();
  res.json({ message: 'Food entry logged', entry });
});

// GET /daily-summary?date=YYYY-MM-DD
router.get('/daily-summary', async (req, res) => {
  await db.read();
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const logs = db.data.logs.filter(l => l.timestamp.startsWith(date));
  const summary = logs.reduce((acc, l) => {
    acc.calories += l.nutrition?.nf_calories || 0;
    acc.protein += l.nutrition?.nf_protein || 0;
    acc.carbs += l.nutrition?.nf_total_carbohydrate || 0;
    acc.fat += l.nutrition?.nf_total_fat || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  res.json({ date, summary });
});

// GET /food-history?date=YYYY-MM-DD
router.get('/food-history', async (req, res) => {
  await db.read();
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const logs = db.data.logs.filter(l => l.timestamp.startsWith(date));
  res.json({ date, logs });
});

// POST /search-food { query }
router.post('/search-food', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query },
      { headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json',
      }}
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Nutritionix search failed', details: err.message });
  }
});

// POST /barcode-food { barcode }
router.post('/barcode-food', async (req, res) => {
  const { barcode } = req.body;
  try {
    const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item?upc=${barcode}`,
      { headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
      }}
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Nutritionix barcode lookup failed', details: err.message });
  }
});

module.exports = router; 