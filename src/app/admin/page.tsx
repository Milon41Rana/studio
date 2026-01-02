
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductUploadForm, type ProductFormData } from '@/components/admin/ProductUploadForm';
import { OrderManagementTable, type Order } from '@/components/admin/OrderManagementTable';
import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, orderBy, Timestamp, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import withAdminAuth from '@/components/auth/withAdminAuth';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';


interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
}

function AdminPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const allOrdersQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'));
    },
    [firestore]
  );

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(allOrdersQuery);
  
  const pendingOrdersCount = useMemo(() => {
    if (!orders) return 0;
    return orders.filter(order => order.status === 'Pending').length;
  }, [orders]);


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
      title: 'Product Added!',
      description: `${data.name} has been added to the store.`,
    });
  };
  
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout Error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
         <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="orders">
            Order Management
             {pendingOrdersCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingOrdersCount}
              </Badge>
            )}
          </TabsTrigger>
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
