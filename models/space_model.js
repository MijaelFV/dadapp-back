const { Schema, model } = require('mongoose');

const SpaceSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    rows: {
        type: Number,
        required: [true, 'Las filas son obligatorias'],
    },
    columns: {
        type: Number,
        required: [true, 'Las columnas son obligatorias'],
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: true,
    }
});


SpaceSchema.methods.toJSON = function() {
    const {__v, _id, ...space} = this.toObject();
    space.uid = _id;
    return space;
}

module.exports = model('Space', SpaceSchema);
