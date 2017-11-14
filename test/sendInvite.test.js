jest.mock('kue');

const connectionString = 'connection-string';
const email = 'user.one@unit.test';
const firstName = 'user';
const lastName = 'one';
const services = [];
const oldUsername = 'fsdjkhsf';
const oldPassword = 'sfuinw';
const oldSalt = 'fwfnejwnkf';

describe('when sending an invitation job', () => {
  let createQueue;
  let queueCreate;
  let jobSave;
  let client;

  beforeEach(() => {
    jobSave = jest.fn().mockImplementation((done) => {
      done();
    });

    queueCreate = jest.fn().mockImplementation(() => {
      return {
        save: jobSave,
      };
    });

    createQueue = jest.fn().mockImplementation(() => {
      return {
        create: queueCreate
      };
    });

    require('kue').createQueue = createQueue;

    const MigrationAdminJobsClient = require('./../lib');
    client = new MigrationAdminJobsClient({
      connectionString,
    });
  });

  it('then it should queue to the configured endpoint', async () => {
    await client.sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt);

    expect(createQueue.mock.calls.length).toBe(1);
    expect(createQueue.mock.calls[0][0].redis).toBe('connection-string');
  });

  it('then it should create a migationinvite_v1 job', async () => {
    await client.sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt);

    expect(queueCreate.mock.calls.length).toBe(1);
    expect(queueCreate.mock.calls[0][0]).toBe('migationinvite_v1');
  });

  it('then it should create the job with supplied data', async () => {
    await client.sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt);

    expect(queueCreate.mock.calls[0][1]).toMatchObject({
      email,
      firstName,
      lastName,
      services,
      oldCredentials: {
      username: oldUsername,
        password: oldPassword,
        salt: oldSalt,
    },
    });
  });

  it('then it should save the job', async () => {
    await client.sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt);

    expect(jobSave.mock.calls.length).toBe(1);
  });

  it('then throw error if save fails', async () => {
    jobSave.mockImplementation((done) => {
      done(new Error('some error'));
    });

    try {
      await client.sendInvite(email, firstName, lastName, services, oldUsername, oldPassword, oldSalt);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('some error');
    }
  });
});
