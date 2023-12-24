const dotenv = require("dotenv");
dotenv.config();

module.exports.KEYS = {
  //   email send
  EMAIL_VERIFICATION: "./templates/emailverification.html",
  EMAIL_VERIFIED: "./templates/emailverified.html",
  SEND_OTP: "./templates/sendOTP.html",
  //  URLS
  HOST: process.env.HOST,
  URL_LOCAL: process.env.URL_LOCAL,
  URL_PRODUCTION: process.env.URL_PRODUCTION,

  //   db
  DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
  DATABASE_URL_LOCAL: process.env.DATABASE_URL_LOCAL,

  //   Host
  HOST: process.env.HOST,
};

const HOST = this.KEYS.HOST;
const URL_LOCAL = this.KEYS.URL_LOCAL;
const URL_PRODUCTION = this.KEYS.URL_PRODUCTION;

exports.URL = HOST === "LOCAL" ? URL_PRODUCTION : URL_LOCAL;
