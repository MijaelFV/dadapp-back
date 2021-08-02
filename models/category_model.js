const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: [true, 'El Área es obligatorio'],
    },
});


CategorySchema.methods.toJSON = function() {
    const {__v, _id, ...category} = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('Category', CategorySchema);
