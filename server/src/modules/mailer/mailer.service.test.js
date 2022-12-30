// eslint-disable-next-line import/no-extraneous-dependencies
import {
  jest, describe, it, expect, beforeEach,
} from '@jest/globals';
import service from './mailer.service.js';
import { logger } from '../../logger/index.js';

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    verify: jest.fn().mockResolvedValueOnce('value'),
    sendMail: jest.fn().mockResolvedValueOnce('value'),
  }),
}));

describe('MailerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendActivationMail', () => {
    const verifySpy = jest.spyOn(service.transporter, 'verify');
    const sendMailSpy = jest.spyOn(service.transporter, 'sendMail');
    const to = 'to';
    const name = 'name';
    const link = 'link';

    it('should send mail', async () => {
      verifySpy.mockResolvedValueOnce();
      sendMailSpy.mockResolvedValueOnce();
      await service.sendActivationMail(to, name, link);
      expect(verifySpy).toBeCalled();
      expect(sendMailSpy).toBeCalledWith({
        from: undefined,
        to,
        subject: 'Acaunt activation on Twitler',
        text: '',
        html:
          `
          <p>Hey ${name},</p>
          <p>Please click below to activate your account</p>
          <p>
              <a href="${link}">Activate</a>
          </p>
          
          <p>If you did not request this email you can safely ignore it.</p>       
          `,
      });
    });

    it('should log error', async () => {
      const loggerSpy = jest.spyOn(logger, 'error');
      verifySpy.mockRejectedValueOnce('error');
      await service.sendActivationMail(to, name, link);
      expect(loggerSpy).toBeCalledWith('error');
    });
  });
});
