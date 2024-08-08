const express = require('express');
const router = express.Router();
const eventsController = require('./Controllers/EventsController');
const registrationController = require('./Controllers/RegistrationController');
const attendeesController = require('./Controllers/AttendeesController');

// Events routes
router.get('/events', eventsController.index);
router.get('/organizers/:organizer_slug/events/:event_slug', eventsController.show);
router.post('/organizers/:organizer_slug/events/:event_slug/registration', eventsController.register);
router.get('/registrations', registrationController.registration);

// Attendee routes
router.post('/login', attendeesController.login);
router.post('/logout', attendeesController.logout);
router.all('')

// Export the router
module.exports = router;