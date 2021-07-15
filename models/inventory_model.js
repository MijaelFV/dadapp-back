const { Schema, model } = require('mongoose');

const InventorySchema = Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'El objeto es obligatorio'],
    },
    location: {
        type: String,
        required: [true, 'La ubicacion es obligatoria'],
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space',
        required: [true, 'El espacio es obligatorio'],
    }
});


InventorySchema.methods.toJSON = function() {
    const {__v, _id, ...inventory} = this.toObject();
    inventory.uid = _id;
    return inventory;
}

module.exports = model('Inventory', InventorySchema);
