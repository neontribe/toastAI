var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ToastAI');

var ToastsSchema = new mongoose.Schema({
  rating: Number,
  toastiness: Number]
});

mongoose.model('Toasts', ToastsSchema);