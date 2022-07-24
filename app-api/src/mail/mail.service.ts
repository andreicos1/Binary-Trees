import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MailService {
  private nodemailerTransport: Mail;
  private templatesDirectory: string;

  constructor(private jwtService: JwtService) {
    this.nodemailerTransport = createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    this.templatesDirectory = path.join(__dirname, "./templates");
  }

  generateTemplate(fileName: string, replacements: any) {
    const filePath = path.join(this.templatesDirectory, fileName);
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    return template(replacements);
  }

  sendConfirmationMail(email: string) {
    const baseUrl = process.env.ROOT_URL;
    const token = this.jwtService.sign({ email });
    const url = `${baseUrl}/confirm-email/${token}`;

    const subject = "Confirmation Email";
    const html = this.generateTemplate("/confirmationEmail.html", { url });

    return this.nodemailerTransport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });
  }

  sendPasswordResetEmail(email: string) {
    const token = this.jwtService.sign({ email });
    const baseUrl = process.env.ROOT_URL;
    const url = `${baseUrl}/reset-password/${token}`;

    const subject = "Reset your Password";
    const html = this.generateTemplate("/resetPassword.html", { url });

    return this.nodemailerTransport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });
  }
}
