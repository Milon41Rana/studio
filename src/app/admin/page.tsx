"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductUploadForm, type ProductFormData } from '@/components/admin/ProductUploadForm';
import { OrderManagementTable } from '@/components/admin/OrderManagementTable';

// Dummy data as per request
const initialOrders = [
  { id: 'ORD001', total: 2500, status: 'Delivered' },
  { id: 'ORD002', total: 1500, status: 'Pending' },
  { id: 'ORD003', total: 3200, status: 'Delivered' },
  { id: 'ORD004', total: 820, status: 'Pending' },
  { id: 'ORD005', total: 550, status: 'Delivered' },
];

export default function AdminPage() {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [orders, setOrders] = useState(initialOrders);

  const handleAddProduct = (data: ProductFormData) => {
    setProducts((prev) => [...prev, data]);
    // In a real app, this would also update dummyData or a global state
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
               <OrderManagementTable orders={orders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
