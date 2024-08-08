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

async function registration(req, res){
    try{
        const attendee = await Attendee.findOne({
            where: {
                login_token: req.query.token,
            }
        });
        if(attendee){
            const registration = await Registration.findAll({
                where:{
                    'attendee_id': attendee.id,
                }
            } ,{
                include: {
                    model: Ticket,
                    include: {
                        model: Event
                    }
                }
            });
            const registeredEvents = [];
        }else{
            res.status(401).json({ message: "User not logged in" });
        }
    }
    catch(e){
        console.log("Error Retrieving registration" , e);
        res.status(500).json({error: "Internal Server Error"});
    }
}
module.exports = {
    registration: registration,
}