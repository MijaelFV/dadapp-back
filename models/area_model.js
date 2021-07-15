const { Schema, model } = require('mongoose');

const AreaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    admin: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    spaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Space',
    }],
    objects: [{
        type: Schema.Types.ObjectId,
        ref: 'Object',
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }]
});


AreaSchema.methods.toJSON = function() {
    const {__v, _id, ...area} = this.toObject();
    area.uid = _id;
    return area;
}

module.exports = model('Area', AreaSchema);
