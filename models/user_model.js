const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La password es obligatoria']
    },
    image: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
});

UserSchema.plugin(mongoosePaginate)

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);
