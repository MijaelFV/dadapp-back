const { Schema, model } = require('mongoose');

const ObjectSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    description: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Darle una categoria es obligatorio'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});


ObjectSchema.methods.toJSON = function() {
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
}

module.exports = model('Object', ObjectSchema);
