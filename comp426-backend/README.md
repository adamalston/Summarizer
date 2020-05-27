# Backend Server

This directory is home to a simple backend server that uses [Express](https://www.npmjs.com/package/express) and [data-store](https://www.npmjs.com/package/data-store) to act as a restful API.

## Setup / Installation

 1. Open a new shell in the root directory of this directory
 2. Run `npm install`
 3. Start the server with one of the following commands

```bash
npm run dev-live-reload
npm run dev-static
npm run prod
```

- *dev-live-reload* runs the server with full logging and will quick restart everytime a file is changed.
- *dev-static* runs the server with full logging but without quick reload.
- *prod* runs the server with limited logging.

## Structure

### Data

The server is separated into two main directories. The first thing to understand is how the data is stored.

The server uses an NPM module called [data-store](https://www.npmjs.com/package/data-store) to maintain a simple object-store. Datastores are automatically created and exported by the `DataStore.js` file.

For example, the `public.json` file holds all the data that is public to any user that access the server. When the server loads, `DataStore` will export this as an object called `publicStore`. This can then be imported from anywhere else in the project. This object is a store object from the data-store NPM module. 

### Routes

We implemented a full custom route to the API utilizing no pre-built methods. We created it in response to CORS errors. A side-effect of this custom route is that it improves the security across our app.