import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

const CartItem = ({
  keyIndex,
  product,
}: {
  keyIndex: number;
  product: Product;
}) => {
  const image = product?.images[0];

  const { removeItem } = useCart();

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {typeof image !== "string" && image?.url ? (
              <Image
                src={image?.url}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {product.category
                ? `${product.category.name} ${product.category.parent.name} `
                : "No Category"}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product?._id, keyIndex)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
