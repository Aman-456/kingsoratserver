const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var handlebars = require("handlebars");
const fs = require("fs");

exports.trimStringFields = (data = {}) => {
  const trimmedData = {};
  for (const key in data) {
    if (typeof data[key] === "string") {
      trimmedData[key] = data[key].trim();
    } else {
      trimmedData[key] = data[key];
    }
  }
  return trimmedData;
};

exports.generateAccessToken = (userId, type) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: type === "game" ? "1d" : "1h",
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "2d",
  });
};

// send Email
exports.readHTMLFileForMail = async ({
  replacements,
  subject,
  success,
  path,
  email,
  res,
}) => {
  return fs.readFile(path, { encoding: "utf-8" }, async function (err, html) {
    if (err) {
      return res.json({
        type: "failure",
        result: "couldn't read html",
      });
    } else {
      const FROM = process.env.EMAIL_ADDRESS;
      var template = handlebars.compile(html);
      var htmlToSend = template(replacements);

      const mailOptions = {
        from: `${FROM}`,
        to: `${email}`,
        subject: subject,
        html: htmlToSend,
      };

      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: `${FROM}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      await transporter.verify();

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          return res.json({ type: "failure", result: "Server Not Responding" });
        } else {
          return res.json({
            type: "success",
            result: success,
          });
        }
      });
    }
  });
};
