
      
'use client';

import { useState, useMemo, useTransition } from 'react';
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
import { generateProductIdea, type GenerateProductIdeaOutput } from '@/ai/flows/generate-product-idea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';


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
  const [isPending, startTransition] = useTransition();
  const [idea, setIdea] = useState<GenerateProductIdeaOutput | null>(null);
  const [ideaCategory, setIdeaCategory] = useState<string>('');

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

  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories')) : null),
    [firestore]
  );

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(allOrdersQuery);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(allProductsQuery);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(allUsersQuery);
  const { data: categories, isLoading: isLoadingCategories } = useCollection(categoriesQuery);
  
  const pendingOrdersCount = useMemo(() => {
    if (!orders) return 0;
    return orders.filter(order => order.status === 'Pending').length;
  }, [orders]);

  const handleGenerateIdea = () => {
    if (!ideaCategory) {
      toast({
        variant: 'destructive',
        title: 'Category not selected',
        description: 'Please select a category to generate an idea.',
      });
      return;
    }
    startTransition(async () => {
      setIdea(null);
      const result = await generateProductIdea({ category: ideaCategory });
      setIdea(result);
    });
  };

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
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="text-primary" />
                      AI Product Idea Generator
                    </CardTitle>
                    <CardDescription>Stuck for ideas? Let AI suggest a new product for your store.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idea-category">Select Category</Label>
                      <Select onValueChange={setIdeaCategory} value={ideaCategory} disabled={isPending || isLoadingCategories}>
                          <SelectTrigger id="idea-category">
                              <SelectValue placeholder="Choose a category..." />
                          </SelectTrigger>
                          <SelectContent>
                              {categories?.map((cat: any) => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleGenerateIdea} disabled={isPending || !ideaCategory} className="w-full">
                      {isPending ? <Loader2 className="animate-spin" /> : 'Generate Idea'}
                    </Button>
                    {idea && (
                      <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                        <p className="font-semibold">{idea.productName}</p>
                        <p className="text-muted-foreground">{idea.productDescription}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                      <CardTitle>Add New Product</CardTitle>
                      <CardDescription>Fill out the form to add a product. Use the AI generator for inspiration!</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProductUploadForm 
                        onSubmit={handleAddProduct} 
                        key={idea ? idea.productName : 'form'}
                        initialData={idea ? { name: idea.productName, description: idea.productDescription } : undefined}
                      />
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

    