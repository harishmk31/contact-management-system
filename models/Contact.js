const mongoose = require('mongoose');

// Regular expressions for validation
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: [true, 'contactId is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'phone is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return phoneRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid 10-digit phone number. Phone must be exactly 10 digits.`,
      },
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
