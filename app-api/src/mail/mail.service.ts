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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendConfirmationMail(email: string) {
    const baseUrl = process.env.ROOT_URL;
    const token = this.jwtService.sign({ email });
    const url = `${baseUrl}/confirm-email/${token}`;
    const subject = "Confirmation Email";
    const text = `Welcome to the Binary Trees App. To confirm your email address, please click the following link: ${url}`;

    return this.nodemailerTransport.sendMail({
      to: email,
      subject,
      text,
    });
  }
}
