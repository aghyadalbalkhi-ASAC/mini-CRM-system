'use strict';

const schema = require('./orders-schema');
const Model = require('./mongo-model');

class Order extends Model {
    constructor() {
        super(schema);
    }
    
}

module.exports = new Order();