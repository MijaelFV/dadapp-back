const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
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
});


ItemSchema.methods.toJSON = function() {
    const {__v, _id, ...item} = this.toObject();
    item.uid = _id;
    return item;
}

module.exports = model('Item', ItemSchema);
