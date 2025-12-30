'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductUploadForm, type ProductFormData } from '@/components/admin/ProductUploadForm';
import { OrderManagementTable } from '@/components/admin/OrderManagementTable';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import withAdminAuth from '@/components/auth/withAdminAuth';


interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string;
  orderDate: Timestamp;
  totalAmount: number;
  orderItems: OrderItem[];
  status: string;
}

function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const allOrdersQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'));
    },
    [firestore]
  );

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(allOrdersQuery);


  const handleAddProduct = (data: ProductFormData) => {
    if (!firestore) return;
    const productsCollection = collection(firestore, 'products');
    const newDocRef = doc(productsCollection);
    
    const productData = {
      id: newDocRef.id,
      title: data.name,
      description: 'A default product description.',
      price: data.price,
      categoryId: data.category,
      imageUrl: data.imageUrl,
      imageHint: 'custom product'
    };
    
    setDocumentNonBlocking(newDocRef, productData);

    toast({
      title: 'Product Submitted',
      description: `${data.name} is being added to the database.`,
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductUploadForm onSubmit={handleAddProduct} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage customer orders.</CardDescription>
            </CardHeader>
            <CardContent>
               <OrderManagementTable orders={orders || []} isLoading={isLoadingOrders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(AdminPage);
