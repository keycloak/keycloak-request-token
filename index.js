/**
 * @module keycloak-request-token
 */

'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

const tokenUrl = 'protocol/openid-connect/token';

/**
  Requests a new Keycloak Access Token
  @param {string} baseUrl - The baseurl for the Keycloak server - ex: http://localhost:8080/auth,
  @param {object} settings - an object containing the settings
  @param {string} settings.username - The username to login to the keycloak server - ex: admin
  @param {string} settings.password - The password to login to the keycloak server - ex: *****
  @param {string} settings.grant_type - the type of authentication mechanism - ex: password,
  @param {string} settings.client_id - the id of the client that is registered with Keycloak to connect to - ex: admin-cli
  @param {string} settings.client_secret - the service account secret, only used if grant_type = "client_credentials"
  @param {string} settings.realmName - the name of the realm to login to - defaults to 'masterg'
  @returns {Promise} A promise that will resolve with the Access Token String.
  @instance
  @example

  const tokenRequester = require('keycloak-request-token')
  const baseUrl = 'http://127.0.0.1:8080/auth'
  
  // ADMIN
  const settings = {
      username: 'admin',
      password: 'admi',
      grant_type: 'password',
      client_id: 'admin-cli'
  }

  // SERVICE ACCOUNT
  const settings = {
      grant_type: 'client_credentials',
      client_id: 'service_accountid',
      client_secret: 'a200cdf6-ad72-4f6c-af73-5b8e1cc48876'
      realm: 'demo'
  }

  tokenRequester(baseUrl, settings)
    .then((token) => {
      console.log(token)
    }).catch((err) => {
      console.log('err', err)
    })
 */
function getToken (baseUrl, settings) {
  return new Promise((resolve, reject) => {
    settings = settings || {};

    settings.realmName = settings.realmName ? settings.realmName : 'master';

    const options = url.parse(`${baseUrl}/realms/${settings.realmName}/${tokenUrl}`);

    options.headers = {
      'Content-type': 'application/x-www-form-urlencoded'
    };

    options.method = 'POST';

    if (settings.grant_type === 'client_credentials') {
      const base64Auth = Buffer.from(`${settings.client_id}:${settings.client_secret}`)
        .toString('base64');
      options.headers.Authorization = `Basic ${base64Auth}`;
      
      options.data = {
        grant_type: settings.grant_type
      };
    } else {
      options.data = settings;
    }

    const caller = (options.protocol === 'https:') ? https : http;
    const data = [];
    const req = caller.request(options, (res) => {
      res.on('data', (chunk) => {
        data.push(chunk);
      }).on('end', () => {
        try {
          const stringData = Buffer.concat(data).toString();
          // need to look for the 404 since the return value is not really JSON but HTML
          if (res.statusCode === 404) {
            return reject(stringData);
          }

          const parsedData = JSON.parse(stringData);
          if (res.statusCode !== 200) {
            return reject(parsedData);
          }

          const token = parsedData.access_token;
          resolve(token);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(querystring.stringify(options.data));
    req.end();
  });
}

module.exports = getToken;
