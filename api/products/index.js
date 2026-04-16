import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    }

    if (req.method === 'POST') {
      const product = new Product(req.body);
      await product.save();
      return res.status(201).json(product);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
