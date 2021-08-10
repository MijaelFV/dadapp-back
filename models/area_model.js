const { Schema, model } = require('mongoose');

const AreaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
});


AreaSchema.methods.toJSON = function() {
    const {__v, _id, ...area} = this.toObject();
    area.uid = _id;
    return area;
}

module.exports = model('Area', AreaSchema);
