'use strict';

class Model {
    
    constructor(schema) {
        this.schema = schema;
    }
    // crud operations
    create(record) {
        let newRecord = new this.schema(record);
        return newRecord.save();
    }
    
    get(_id) {
        let obj = _id ? { _id } : {};
        return this.schema.find(obj);
    }

    update(_id, record) {
        return this.schema.findByIdAndUpdate(_id, record);
    }

    delete(_id) {
        return this.schema.findByIdAndDelete(_id);
    }
}

module.exports = Model;
