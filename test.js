const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- User --- */
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, default: 'user' },

  // Embedded Cart
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],

  // Embedded Wishlist
  wishlist: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    addedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

/* --- Product --- */
const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: String,
  stock: { type: Number, default: 0 },
  tags: [String],
  sku: { type: String, unique: true },
}, { timestamps: true });

/* --- Order --- */
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: String,
  total: { type: Number, required: true },

  // Embedded items
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
  }],

  // Simple embedded address
  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    country: String,
    zip: String,
  },
}, { timestamps: true });

/* --- Blog Post --- */
const blogPostSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  excerpt: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'draft' },
  featuredImage: String,
}, { timestamps: true });

/* --- Export All Models --- */
module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  BlogPost: mongoose.model('BlogPost', blogPostSchema),
};
