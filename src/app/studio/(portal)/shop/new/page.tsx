import { ProductForm } from "@/components/studio/ProductForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add shop item" };

export default function NewProductPage() {
  return (
    <div>
      <PageHeader
        title="Add shop item"
        intro="Start as a concept. You can make it available once the shop is live."
      />
      <ProductForm />
    </div>
  );
}
