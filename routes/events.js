const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const {isLoggedIn} = require('../middleware');

router.get('/events',events.renderEvents);
router.get('/event/new',isLoggedIn,events.createEvent)
router.get('/event/:id',events.renderEvent);

module.exports = router;