// import mongoose, the library that will help us define the schema and model.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema- a blueprint that defines the structure and properties of a document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'], 
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    favorites: [
      {
        recipeId: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          default: '',
        },
      },
    ],
  }, {
    // 'timestamps: true' tells Mongoose to automatically add two fields to each document:- createdAt and updatedAt
    timestamps: true,
  });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;