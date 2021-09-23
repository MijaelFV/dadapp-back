const { Schema, model } = require('mongoose');

const InventoryLogSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Especificar el usuario del movimiento es obligatorio'],
    },
    type: {
        type: String,
        required: [true, 'El tipo de movimiento es obligatorio'],
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
    },
    itemName: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    column: {
        type: Number,
    },
    row: {
        type: Number,
    },
    space: {
        type: Schema.Types.ObjectId,
        ref: 'Space',
        required: [true, 'El espacio es obligatorio'],
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: [true, 'El area es obligatoria'],
    },
    time: {
        type: Date,
        default: Date.now
    }
});


InventoryLogSchema.methods.toJSON = function() {
    const {__v, _id, ...inventoryLog} = this.toObject();
    inventoryLog.uid = _id;
    return inventoryLog;
}

module.exports = model('InventoryLog', InventoryLogSchema);
