
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { doc } from 'firebase/firestore';
import { useFirestore } from "@/firebase";
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface ProductListTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductListTable({ products, isLoading }: ProductListTableProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleStatusChange = (product: Product, newStatus: boolean) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', product.id);
    updateDocumentNonBlocking(productRef, { isActive: newStatus });
    toast({
      title: "Status Updated",
      description: `${product.title} is now ${newStatus ? 'Active' : 'Inactive'}.`,
    });
  };

  const openDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const handleDeleteProduct = () => {
    if (!firestore || !productToDelete) return;
    const productRef = doc(firestore, 'products', productToDelete.id);
    deleteDocumentNonBlocking(productRef);
    toast({
      variant: "destructive",
      title: "Product Deleted",
      description: `${productToDelete.title} has been removed from the store.`,
    });
    setProductToDelete(null);
    setIsAlertOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No products found.</p>;
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                       <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                    </div>
                    <div className="font-medium">{product.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={(newStatus) => handleStatusChange(product, newStatus)}
                    aria-label="Product status"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirm(product)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Add Product type if not already globally available
export type { Product };
