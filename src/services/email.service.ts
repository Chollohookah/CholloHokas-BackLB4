// inside src/services/email.service.ts
import {bind, BindingScope} from '@loopback/core';
import {AES} from 'crypto-js';
import {createTransport} from 'nodemailer';
import {EmailTemplate, NodeMailer, User} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
  /**
   * If using gmail see https://nodemailer.com/usage/using-gmail/
   */
  private static async setupTransporter() {
    return createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWD_MAIL,
      },
    });
  }
  async sendResetPasswordMail(user: User): Promise<NodeMailer> {
    const transporter = await EmailService.setupTransporter();
    /**
     * &pass=${Utils.universalBtoa(
        this.returnEncriptedPass(user),
      )}
     */
    const emailTemplate = new EmailTemplate({
      to: user.username,
      subject: '[CholloHookah] Petición de reinicio',
      html: `
      <div>
          <p>Hola hookero,</p>
          <p style="color: red;">Hemos recibido una petición para reiniciar tu contraseña</p>
          <p>Para reiniciar tu contraseña haz click en link de abajo</p>
          <a href="${this.returnActualURL()}/login?loadViewId=4&resetKey=${
        user.resetKey
      }">Reinicia tu contraseña</a>
          <p>Si usted no ha solicitado este cambio ignore el correo o cambie la contraseña para asegurarse.</p>
          <p>Gracias</p>
          <p>Equipo de CholloHookah.com</p>
      </div>
      `,
    });
    return transporter.sendMail(emailTemplate);
  }

  private returnActualURL() {
    if (process.env.PRODUCTION_ENABLED === 'true') {
      return `https://${process.env.WEBAPP_PRODUCTION_URL}`;
    } else {
      return `http://${process.env.WEBAPP_URL}:${process.env.WEBAPP_PORT}`;
    }
  }

  private returnEncriptedPass(user: User) {
    return AES.encrypt(user.pass, process.env.AES_KEY as any).toString();
  }
}
