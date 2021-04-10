'use strict';

const schema = require('./admins-schema');
const Model = require('./mongo-model');

class Admin extends Model {
    constructor() {
        super(schema);
    }
    
}

module.exports = new Admin();