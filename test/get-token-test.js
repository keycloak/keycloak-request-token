'use strict';

const test = require('tape');
const keycloakTokenRequest = require('../index');

test('keycloakTokenRequest should return a promise containing the access token', (t) => {
  const baseUrl = 'http://127.0.0.1:8080/auth';
  const settings = {
    username: 'admin',
    password: 'admin',
    grant_type: 'password',
    client_id: 'admin-cli'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  t.equal(kca instanceof Promise, true, 'should return a Promise');
  kca.then((accessToken) => {
    t.end();
  });
});

test('keycloakTokenRequest failed login, wrong user creds', (t) => {
  const baseUrl = 'http://127.0.0.1:8080/auth';
  const settings = {
    username: 'admin',
    password: 'wrong',
    grant_type: 'password',
    client_id: 'admin-cli'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  kca.catch((err) => {
    t.equal(err.error_description, 'Invalid user credentials', 'error description should be invalid credentials');
    t.equal(err.error, 'invalid_grant', 'error invalid_grant');
    t.end();
  });
});

test('keycloakTokenRequest wrong baseURL', (t) => {
  const baseUrl = 'http://127.0.0.1:8080/notauth';
  const settings = {
    username: 'admin',
    password: 'admin',
    grant_type: 'password',
    client_id: 'admin-cli'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  kca.catch((err) => {
    t.equal(err, '<html><head><title>Error</title></head><body>404 - Not Found</body></html>', 'should return the 404 html code');
    t.end();
  });
});

test('keycloakTokenRequest wrong url - connection refused', (t) => {
  const baseUrl = 'http://127.0.0.1:9080/auth';
  const settings = {
    username: 'admin',
    password: 'admin',
    grant_type: 'password',
    client_id: 'admin-cli'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  kca.catch((err) => {
    t.equal(err.code, 'ECONNREFUSED', 'should have a connection refused error code');
    t.end();
  });
});

test('keycloakTokenRequest - service account - should return a promise containing the access token', (t) => {
  const baseUrl = 'http://127.0.0.1:9080/auth';
  const settings = {
    grant_type: 'client_credentials',
    client_id: 'service_accountid',
    client_secret: '28912097-138a-45e9-b2c2-d1faf4c0a86a',
    realmName: 'demo'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  t.equal(kca instanceof Promise, true, 'should return a Promise');
  kca.then((accessToken) => {
    console.log(accessToken);
    t.end();
  });
});

test('keycloakTokenRequest - service account - failed login, wrong user creds', (t) => {
  const baseUrl = 'http://127.0.0.1:9080/auth';
  const settings = {
    grant_type: 'client_credentials',
    client_id: 'service_accountid',
    client_secret: '28910197-138a-45e9-b2c2-d1faf4c0a86r',
    realmName: 'demo'
  };

  let kca = keycloakTokenRequest(baseUrl, settings);

  kca.catch((err) => {
    t.equal(err.error_description, 'Invalid client secret', 'error description should be invalid client secret');
    t.equal(err.error, 'unauthorized_client', 'error unauthorized_client');
    t.end();
  });
});
