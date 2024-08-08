const Attendee = require('../Models/Attendee');
const { Op } = require('sequelize');
const crypto = require('crypto')
async function login(req,res){
    try {
        const attendee = await Attendee.findOne({
            where: {
                registration_code: req.body.registration_code,
                lastname: req.body.last_name,
            }
        });

        if (attendee) {
            const md5Hash = crypto.createHash('md5').update(attendee.username).digest('hex');
            // Update the attendee record with the MD5 hashed token
            await Attendee.update({ login_token: md5Hash }, { where: { id: attendee.id } });
            res.status(200).json({
                firstname: attendee.firstname,
                lastname: attendee.lastname,
                username: attendee.username,
                email: attendee.email,
                token: md5Hash,
            });
        } else {
            res.status(401).json({ message: "Invalid login" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
}
async function logout(req, res){
    try {
        const attendee = await Attendee.findOne({
            where: {
                login_token: req.query.token,
            }
        });
        if(attendee){
            await Attendee.update({
                'login_token': null
            },{
                where: {
                    id: attendee.id
                }
            });
            res.status(200).json({ message: "Logout success" });
        }else{
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
}
module.exports = {
    login: login,
    logout: logout,
}