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
      return NextResponse.json(
        { message: 'Category slug query parameter is required' },
        { status: 400 }
      );
    }

    // Find the category
    const category = await productCategory
      .findOne({ slug: categorySlug })
      .select(
        'category photo alt imgTitle description metatitle metadescription slug metakeywords metacanonical metalanguage metaschema otherMeta updatedAt'
      );

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Define priority product titles
    const PRIORITY_PRODUCTS = [
      'Resist Salt | 127-68-4',
      'Metanilic Acid | 121-47-1',
    ];

    // Use aggregation to sort products with custom priority
    const products = await Product.aggregate([
      {
        $match: {
          categories: { $in: [categorySlug] },
          status: 'active',
        },
      },
      {
        $addFields: {
          priority: {
            $cond: [
              { $eq: ['$title', PRIORITY_PRODUCTS[0]] },
              0,
              {
                $cond: [
                  { $eq: ['$title', PRIORITY_PRODUCTS[1]] },
                  1,
                  999, // all others get low priority
                ],
              },
            ],
          },
        },
      },
      { $sort: { priority: 1, title: 1 } }, // sort by priority, then alphabetically
      {
        $project: {
          priority: 0, // remove helper field
        },
      },
    ]);

    return NextResponse.json({
      category,
      products,
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    return NextResponse.json({ message: errorMessage, error }, { status: 500 });
  }
}