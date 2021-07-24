const { Schema, model } = require('mongoose');

const InventorySchema = Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'El item es obligatorio'],
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
    }
});


InventorySchema.methods.toJSON = function() {
    const {__v, _id, ...inventory} = this.toObject();
    inventory.uid = _id;
    return inventory;
}

module.exports = model('Inventory', InventorySchema);
