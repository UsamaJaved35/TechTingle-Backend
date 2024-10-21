const mongoose = require("mongoose")
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  firstName:{
    type: String,
    required: true,
    minLength:3,
    maxLength:20
  },
  lastName:{
    type: String,
    required: true,
    minLength:3,
    maxLength:20
  },
  password:{
    type: String,
    required: true,
    minLength:6
  },
  age:{
    type: Number,
    required: true,
    min: 12
  },
  about:{
    type: String,
    minLength:10,
    maxLength:50
  },
  gender:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['male', 'female','other'].indexOf(v) !== -1
      },
      message: 'Gender must be male or female'
    }
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate:{
      validator: function(v){
        return validator.isEmail(v)
      },
      message: 'Email is not valid'
    }
  },
  photoUrl:{
    type: String,
    default: "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg",
    validate: {
      validator: function(v) {
        return validator.isURL(v);
      },
      message: 'Photo URL is not valid'
    }
  },
  skills: {
    type: [String],
    validate: [
      {
        validator: function(v) {
          return v.length <= 20;
        },
        message: 'Skills must be less than or equal to 20'
      },
      {
        validator: function(v) {
          return v.length >= 3;
        },
        message: 'Skills must be greater than or equal to 3'
      }
    ]
  },
  connections: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
    validate: {
      validator: function (connections) {
        // Check if the array contains only unique ObjectIds
        const uniqueConnections = [...new Set(connections.map(id => id.toString()))];
        return uniqueConnections.length === connections.length;
      },
      message: 'Connections array contains duplicate entries',
    }
  }  
},{
  timestamps: true
});
userSchema.index({ firstName: 1, lastName: -1 })

userSchema.methods.getJWT = function () {
  return jwt.sign({id: this._id}, "secret", {expiresIn: "7d"});
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model('User', userSchema);


module.exports = {UserModel};