import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailService {
  private nodemailerTransport: Mail;

  constructor(private jwtService: JwtService) {
    this.nodemailerTransport = createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });
  }

  sendConfirmationMail(userEmail: string) {
    const baseUrl = "http://localhost:3000";
    const token = this.jwtService.sign({ userEmail });
    const url = `${baseUrl}?token=${token}`;
    const subject = "Confirmation Email";
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.nodemailerTransport.sendMail({
      to: userEmail,
      subject,
      text,
    });
  }
}
