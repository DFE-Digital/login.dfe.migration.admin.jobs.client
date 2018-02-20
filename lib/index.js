const kue = require('kue');

const send = async (type, data, connectionString) => {
  return new Promise((resolve, reject) => {
    const queue = kue.createQueue({
      redis: connectionString
    });
    queue.create(type, data)
      .save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      });
  });
};

class MigrationAdminJobsClient {
  constructor({connectionString}) {
    this.connectionString = connectionString;
  }

  async sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt, tokenSerialNumber, ktsId) {
    const data = {
      email,
      firstName,
      lastName,
      services,
      oldCredentials: {
        username: oldUsername,
        password: oldPassword,
        salt: oldSalt,
        tokenSerialNumber,
        ktsId,
      },
    };
    await send('migrationinvite_v1', data, this.connectionString);
  }
}

module.exports = MigrationAdminJobsClient;