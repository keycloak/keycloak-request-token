## keycloak-request-token

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/keycloak-request-token/badge.svg)](https://coveralls.io/github/bucharest-gold/keycloak-request-token)
[![Build Status](https://travis-ci.org/bucharest-gold/keycloak-request-token.svg?branch=master)](https://travis-ci.org/bucharest-gold/keycloak-request-token)
[![Known Vulnerabilities](https://snyk.io/test/npm/keycloak-request-token/badge.svg)](https://snyk.io/test/npm/keycloak-request-token)
[![dependencies Status](https://david-dm.org/bucharest-gold/keycloak-request-token/status.svg)](https://david-dm.org/bucharest-gold/keycloak-request-token)

[![NPM](https://nodei.co/npm/keycloak-request-token.png)](https://npmjs.org/package/keycloak-request-token)

A simple module to request an Access Token from a Keycloak Server.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0 |
| Build:          | make |
| Documentation:  | https://www.keycloak.org/keycloak-request-token |
| Issue tracker:  | https://github.com/keycloak/keycloak-request-token/issues |
| Engines:        | Node.js 4.x, 6.x, 8.x |

## Installation

    npm install keycloak-request-token -S

## Usage

    'use strict';

    const tokenRequester = require('keycloak-request-token');

    const baseUrl = 'http://127.0.0.1:8080/auth';
    const settings = {
        username: 'admin',
        password: 'admi',
        grant_type: 'password',
        client_id: 'admin-cli'
    };

    tokenRequester(baseUrl, settings)
      .then((token) => {
        console.log(token);
      }).catch((err) => {
        console.log('err', err);
      });

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)

## Reporting security vulnerabilities

If you've found a security vulnerability, please look at the [instructions on how to properly report it](http://www.keycloak.org/security.html)
