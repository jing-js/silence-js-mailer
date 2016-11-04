const nodemailer = require('nodemailer');

class Mailer {
  constructor(config) {
    this.logger = config.logger;
    this._user = config.user;
    this._mailer = nodemailer.createTransport({
      host: config.host,
      port: config.port || 465,
      secure: config.secure !== false,
      auth: {
        user: config.user,
        pass: config.password
      },
      pool: config.pool !== false,
      maxConnections: config.maxConnections || 5,
      maxMessages: config.maxMessages || 100,
      rateLimit: config.rateLimit === false ? false : (config.rateLimit || 1000)
    });
  }
  close() {
    this._mailer.close();
    return Promise.resolve();
  }
  send(options) {
    return new Promise((resolve, reject) => {
      this._mailer.sendMail(options, (err, info) => {
        if (err) {
          this.logger.error('Mailer error', err);
          resolve(false);
        } else {
          this.logger.debug('Mailer sent:', info.response);
          resolve(true);
        }
      });
    })
  }
  sendText(fromName, to, subject, text) {
    return this.send({
      from: {
        name: fromName,
        address: this._user
      },
      to,
      subject,
      text
    });
  }
  sendHTML(fromName, to, subject, html) {
    return this.send({
      from: {
        name: fromName,
        address: this._user
      },
      to,
      subject,
      html
    });
  }
}

module.exports = Mailer;
