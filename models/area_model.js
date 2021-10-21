const { Schema, model } = require('mongoose');
const shortid = require('shortid');

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
    }],
    inviteCode: {
        type: String,
        default: shortid.generate
    }
});


AreaSchema.methods.toJSON = function() {
    const {__v, _id, ...area} = this.toObject();
    area.uid = _id;
    return area;
}

module.exports = model('Area', AreaSchema);
