const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb+srv://rogers:1234@cluster0.kmacb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(url);

// Database Name
const dbName = 'users';

module.exports = {client, dbName};