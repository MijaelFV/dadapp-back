const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    image: {
        type: String,
    },
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
    active: {
        type: Boolean,
        default: true,
        required: [true, 'Tener un estado es obligatorio']
    }
});


ItemSchema.methods.toJSON = function() {
    const {__v, _id, ...item} = this.toObject();
    item.uid = _id;
    return item;
}

module.exports = model('Item', ItemSchema);
