// const {google} = require('googleapis');
const { OAuth2Client } = require("google-auth-library");
const config = require('./config');

const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

// const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];

module.exports = oauth2Client;
