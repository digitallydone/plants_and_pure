import { getProductById } from "@/app/actions/product";
import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const productData = await getProductById(id);

  if (!productData) {
    return notFound();
  }

  return (
    <div>
      <ProductForm product={productData} />
    </div>
  );
}
