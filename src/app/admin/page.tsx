
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductUploadForm, type ProductFormData } from '@/components/admin/ProductUploadForm';
import { OrderManagementTable, type Order } from '@/components/admin/OrderManagementTable';
import { ProductListTable, type Product } from '@/components/admin/ProductListTable';
import { CustomerListTable, type UserProfile } from '@/components/admin/CustomerListTable';
import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, orderBy, Timestamp, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import withAdminAuth from '@/components/auth/withAdminAuth';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


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
  
  const allProductsQuery = useMemoFirebase(
    () => {
        if (!firestore) return null;
        return query(collection(firestore, 'products'), orderBy('title', 'asc'));
    },
    [firestore]
  );
  
  const allUsersQuery = useMemoFirebase(
    () => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), orderBy('firstName', 'asc'));
    },
    [firestore]
  );

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(allOrdersQuery);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(allProductsQuery);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(allUsersQuery);
  
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
      description: data.description,
      regularPrice: data.regularPrice,
      salePrice: data.salePrice,
      stockQuantity: data.stockQuantity,
      variants: data.variants,
      categoryId: data.category,
      imageUrl: data.imageUrl,
      imageHint: 'custom product',
      isActive: true, // Default to active
    };
    
    setDocumentNonBlocking(newDocRef, productData);
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
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="products">Product Management</TabsTrigger>
          <TabsTrigger value="orders">
            Order Management
             {pendingOrdersCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingOrdersCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                      <CardTitle>Add New Product</CardTitle>
                      <CardDescription>Fill out the form to add a product.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProductUploadForm onSubmit={handleAddProduct} />
                    </CardContent>
                  </Card>
              </div>
               <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                      <CardTitle>Product List</CardTitle>
                      <CardDescription>Manage product status and details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ProductListTable products={products || []} isLoading={isLoadingProducts} />
                    </CardContent>
                  </Card>
              </div>
          </div>
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
        <TabsContent value="customers" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Customer Accounts</CardTitle>
              <CardDescription>View all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
               <CustomerListTable users={users || []} isLoading={isLoadingUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(AdminPage);
