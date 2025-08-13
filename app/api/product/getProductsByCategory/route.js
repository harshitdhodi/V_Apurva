import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import productCategory from '@/lib/models/ProductCategory';

// Connect to the database
await connectDB();

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const categorySlug = searchParams.get('categorySlug');
      console.log('Category Slug:', categorySlug);
      
      if (!categorySlug) {
        return NextResponse.json({ message: 'Category slug query parameter is required' }, { status: 400 });
      }
  
      // Find the category by its slug and include only specific fields
      const category = await productCategory.findOne({ slug: categorySlug }).select('category photo alt imgTitle description metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
  
      if (!category) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
      }
      
      // Find all products that belong to the category
      const products = await Product.find({
        categories: { $in: categorySlug },
      }).select('_id title photo alt imgTitle slug url');

      // console.log("Fetched Products", products)
  
      // Return the category and products in the response
      return NextResponse.json({
        category, // Include category details in the response
        products,
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      let errorMessage = 'Server error';
      if (error.name === 'CastError') {
        errorMessage = 'Invalid query parameter format';
      }
      return NextResponse.json({ message: errorMessage, error }, { status: 500 });
    }
}