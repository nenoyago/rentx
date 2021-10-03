import fs from 'fs';
import { injectable } from 'tsyringe';

import nodemailer, { Transporter } from 'nodemailer';
import { SES } from 'aws-sdk';
import handlebars from 'handlebars';

import { IMailProvider } from '../IMailProvider';

@injectable()
class SESPMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: 'RentX <developer.neno@gmail.com>',
      subject,
      html: templateHTML,
    });
  }
}

export { SESPMailProvider };
