import mongoose from 'mongoose';

const productDetailSchema = new mongoose.Schema({
  CASNo: { 
    type: String,
    default: ''
  },
  formula: { 
    type: String 
  },
  MW: { 
    type: String 
  },
  synonym: { 
    type: String 
  },
  EINECS: { 
    type: String 
  },
  density: { 
    type: String 
  },
  meltingPoint: { 
    type: String 
  },
  solubility: { 
    type: String 
  },
  appearance: { 
    type: String 
  },
  purity: { 
    type: String 
  },
  application: { 
    type: String 
  },
  packing: { 
    type: String 
  },
  insolubles: { 
    type: String 
  },
  productId: { 
    type: String, 
    ref: 'Product',
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for productId for faster lookups
productDetailSchema.index({ productId: 1 });

// Create a virtual for the product
productDetailSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: 'slug',
  justOne: true
});

const ProductDetail = mongoose.models.ProductDetail || mongoose.model('ProductDetail', productDetailSchema);

export default ProductDetail;
