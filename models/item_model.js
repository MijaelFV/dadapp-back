const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    image: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    description: {
        type: String,
        default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Darle una categoria es obligatorio'],
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space',
        required: [true, 'El espacio es obligatorio'],
    },
    column: {
        type: Number,
        required: [true, 'La columna es obligatoria'],
    },
    row: {
        type: Number,
        required: [true, 'La fila es obligatoria'],
    },
    takedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    takedDate: {
        type: Date,
        default: null,
    },
    expiryDate: {
        type: Date,
        default: null
    },
    quantity: {
        type: Number,
        default: null
    }
});

ItemSchema.methods.toJSON = function() {
    const {__v, _id, image, ...item} = this.toObject();
    item.uid = _id;
    return item;
}

module.exports = model('Item', ItemSchema);
