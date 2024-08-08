const Event = require('../Models/Event');
const Organizer = require('../Models/Organizer');
const Channel = require('../Models/Channel');
const Room = require('../Models/Room');
const Session = require('../Models/Session');
const Ticket = require('../Models/Ticket');
const Registration = require('../Models/Registration');
const SessionRegistration = require('../Models/SessionRegistration');

const moment = require('moment');
const { Op } = require('sequelize');
const Attendee = require("../Models/Attendee");
async function index(req, res){
    try{
        const events = await Event.findAll({
            include: {
              model:  Organizer,
                as: 'organizer',
            },
            where:{
                date: {
                    [Op.gt]: new Date(),
                }
            }
        });
        const formattedEvents = events.map(event => ({
            id: event.id,
            name: event.name,
            slug: event.slug,
            date: event.date,
            organizer: {
                id: event.organizer.id,
                name: event.organizer.name,
                slug: event.organizer.slug
            }
        }));
        res.json({events:formattedEvents});
    }catch(e){
        console.log("Error Retrieving events" , e);
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function show(req, res){
    try{
        const organizer_slug = req.params.organizer_slug;
        const event_slug = req.params.event_slug;
        const event = await Event.findOne({
            where: {
                slug: event_slug
            },
            include: [
                {
                    model: Channel,
                    include:[
                        {
                            model: Room,
                            include:[
                                {
                                    model: Session,
                                }
                            ]
                        }
                    ],
                },
                {
                    model: Ticket,
                }
            ]
        });

        const transformEvent = {
            id: event.id,
            name: event.name,
            slug: event.slug,
            date: event.date,
            channels: [],
            tickets: [],
        };
        event.Channels.forEach(channel => {
            const transformedChannel = {
                id: channel.id,
                name: channel.name,
                rooms: []
            };

            // Transform rooms
            channel.Rooms.forEach(room => {
                const transformedRoom = {
                    id: room.id,
                    name: room.name,
                    sessions: []
                };

                // Transform sessions
                room.Sessions.forEach(session => {
                    const transformedSession = {
                        id: session.id,
                        title: session.title,
                        description: session.description,
                        speaker: session.speaker,
                        start: moment(session.start).format('YYYY-MM-DD HH:mm:ss'),
                        end: moment(session.end).format('YYYY-MM-DD HH:mm:ss'),
                        type: session.type,
                        cost: session.cost || null // If cost is null, set to null
                    };
                    transformedRoom.sessions.push(transformedSession);
                });

                transformedChannel.rooms.push(transformedRoom);
            });

            transformEvent.channels.push(transformedChannel);
        });

        // Transform tickets
        for (const ticket of event.Tickets) {
            const description = ticket.special_validity ? JSON.parse(ticket.special_validity) : null;

            const isAvailable = async () => {
                if (description) {
                    if (description.type == 'date') {
                        return moment(description.date).isAfter(moment());
                    } else {
                        const registrationCount = await Registration.count({ where: { ticket_id: ticket.id } });
                        return registrationCount < description.amount;
                    }
                }
                return true;
            };

            const availability = await isAvailable(); // Wait for availability check to complete

            const transformedTicket = {
                id: ticket.id,
                name: ticket.name,
                description: description
                    ? description.type === 'date'
                        ? `Available until ${new Date(description.date).toLocaleDateString()}`
                        : `${description.amount} tickets available`
                    : null,
                cost: parseFloat(ticket.cost),
                available: availability, // Store the result of availability check
            };

            transformEvent.tickets.push(transformedTicket);
        }
        res.json({transformEvent});
        const organizer = await Organizer.findOne({
            where: {
                slug: organizer_slug
            },
        });
        // check for organizer existence
        if(!organizer){
            res.status(404).json({message: "Organizer Not Found"});
        }

        // check whether the event was created by the organizer
        if(event.organizer_id !== organizer.id){
            res.status(404).json({message: "Event Not Found"});
        }


    }catch(e){
        console.log("Error Retrieving Event's Details" , e);
        res.status(500).json({error: "Internal Server Error"});
    }
}
async function register(req,res){
    try {
        const organizer_slug = req.params.organizer_slug;
        const event_slug = req.params.event_slug;
        const ticket_id = req.body.ticket_id;
        const session_ids = req.body.session_ids;
        const attendee = await Attendee.findOne({
            where: {
                login_token: req.query.token,
            }
        });
        if(attendee){
        //     check whether the event is exist
            const isEventExist = await Event.findOne({
                where:{
                    slug: event_slug,
                }
            });
            if(!isEventExist){
                res.status(404).json({'messsage': 'Event Not Found'});
            }
            //     check whether the event is exist
            const isOrganizerValid = await Organizer.findOne({
                where:{
                    'id': isEventExist.organizer_id,
                    'slug': organizer_slug,
                }
            });

            if(!isOrganizerValid){
                res.status(404).json({'message': 'Organizer Not Found'});
            }
            if(!isEventExist){
                res.status(404).json({'message': 'Event Not Found'});
            }
        //     check whether user already registered
            const isRegistered = await Registration.findOne({
                where:{
                    ticket_id: ticket_id,
                    attendee_id: attendee.id,
                }
            });
            if(isRegistered){
                res.status(401).json({'message': 'User already registered'});
            }

        //     check whether the ticket is available
            const ticket = await Ticket.findOne({
                where:{
                    id: ticket_id,
                    event_id: isEventExist.id,
                }
            });
            if(!ticket){
                res.status(401).json({'message': 'Ticket Id not valid'});
            }
            const description = ticket.special_validity ? JSON.parse(ticket.special_validity) : null;
            const isAvailable = async () => {
                if (description) {
                    if (description.type == 'date') {
                        return moment(description.date).isAfter(moment());
                    } else {
                        const registrationCount = await Registration.count({ where: { ticket_id: ticket.id } });
                        return registrationCount < description.amount;
                    }
                }
                return true;
            };
            const availability = await isAvailable();
            if(!availability){
                res.status(401).json({'message': 'Ticket is no longer available'});
            }
        //     add data to registration
            const registration =   await Registration.create({
                'attendee_id': attendee.id,
                'ticket_id': ticket_id,
                'registration_time': moment().format('YYYY-MM-DD HH:mm:ss'),
            });
            const registrationId = registration.id;
        //     add data to session registration
            if(session_ids.length > 0){
                for(const id of session_ids){
                    await SessionRegistration.create({
                        registration_id: registrationId ,
                        session_id: id,
                    });
                }
            }
            res.status(200).json({message: 'Registration successful'});
        }else{
            res.status(401).json({ message: "User not logged in" });
        }
    } catch (error) {
        console.error("Error during event registration:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
}
module.exports = {
    index : index,
    show: show,
    register: register,
};