import { client } from '@/sanity/lib/client';
import dynamic from 'next/dynamic';

const ProductDetails = dynamic(() => import('../../Components/Product/product'));

export default async function ShopListWrapper({ params: { slug } }: { params: { slug: string } }) {
  const combinedQuery = `{
    "product": *[_type == "food" && slug.current == '${slug}'][0],
    "productData": *[_type == "food"]
  }`;

  let product = null;
  let productData = [];

  try {
    const result = await client.fetch(combinedQuery);
    product = result.product;
    productData = result.productData;

    if (!product) {
      throw new Error(`Product with slug '${slug}' not found.`);
    }
  } catch (error) {
    console.error("Error fetching product or products:", error);
    return <div className="text-center text-red-500">Error loading product details.</div>;
  }

  return (
    <div>
      <ProductDetails product={product} productData={productData} />
    </div>
  );
}