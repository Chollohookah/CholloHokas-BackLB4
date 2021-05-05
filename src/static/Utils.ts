import {HttpErrors} from '@loopback/rest';

export class Utils {
  public static validateEmail(email: string): boolean {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email,
    );
  }

  public static async validateKeyPassword(
    pass: string,
    resetKey: string,
  ): Promise<{pass: string; resetKey: string}> {
    if (!pass || pass.length < 8) {
      throw new HttpErrors.UnprocessableEntity(
        'Contraseña debe tener minimo 8 caracteres',
      );
    }

    if (resetKey.length === 0 || resetKey.trim() === '') {
      throw new HttpErrors.UnprocessableEntity('La resetkey es obligatoria!');
    }

    return {pass, resetKey};
  }

  public static universalBtoa = (str: string) => {
    try {
      return btoa(str);
    } catch (err) {
      return Buffer.from(str).toString('base64');
    }
  };

  public static universalAtob = (b64Encoded: string) => {
    try {
      return atob(b64Encoded);
    } catch (err) {
      return Buffer.from(b64Encoded, 'base64').toString();
    }
  };
}
