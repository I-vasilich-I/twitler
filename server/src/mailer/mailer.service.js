import nodemailer from 'nodemailer';

class MailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    })
  }

  async sendActivationMail(to, name, link) {
    try {
      await this.transporter.verify();
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `Acaunt activation on Twitler`,
        text: '',
        html: 
          `
          <p>Hey ${ name },</p>
          <p>Please click below to activate your account</p>
          <p>
              <a href="${ link }">Activate</a>
          </p>
          
          <p>If you did not request this email you can safely ignore it.</p>       
          `
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default new MailerService();