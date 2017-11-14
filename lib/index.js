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

  async sendInvite(email, firstName, lastName, services) {
    await send('migationinvite_v1', {email, firstName, lastName, services}, this.connectionString);
  }
}

module.exports = MigrationAdminJobsClient;