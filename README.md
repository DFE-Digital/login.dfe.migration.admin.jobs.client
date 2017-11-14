# DfE migrations jobs client
[![Build Status](https://travis-ci.org/DFE-Digital/login.dfe.migration.admin.jobs.client.svg?branch=master)](https://travis-ci.org/DFE-Digital/login.dfe.migration.admin.jobs.client)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Client package for sending jobs related to migration admin


## Create client

```javascript
const MigrationAdminJobsClient = require('./../lib');
const client = new MigrationAdminJobsClient({
  connectionString: 'YOUR-REDIS-CONNECTION-STRING',
});
```

## Available methods

### sendInvite

```javascript
const email = 'user-email';
const firstName = 'user-first-name';
const lastName = 'user-last-name';
const services = [
  organisationId: 'org-id',
  serviceId: 'org-id',
  roleId: 'org-id',
];

await client.sendInvite(email, firstName, lastName, services);
```