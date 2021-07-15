const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
});


CategorySchema.methods.toJSON = function() {
    const {__v, _id, ...category} = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('Category', CategorySchema);
