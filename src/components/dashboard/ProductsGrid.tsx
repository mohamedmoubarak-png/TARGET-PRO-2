import { ProductStats } from "../../types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductStats[];
}

export function ProductsGrid({ products }: Props) {
  return (
    <div className="products-grid">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
