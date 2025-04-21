import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { EMAIL_PASS, EMAIL_USER } from "../config/env";
import handlebars from "handlebars";

export const sendMail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: { [key: string]: string }
) => {
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465, // SSL port
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Read and compile the email template
  const templatePath = path.join(
    __dirname,
    "../templates",
    `${templateName}.html`
  );
  const source = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(source);
  const html = compiledTemplate(replacements);

  const mailOptions = {
    from: `"2DO" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;
