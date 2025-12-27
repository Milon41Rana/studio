'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
}

interface Order {
  id: string;
  orderDate: Timestamp;
  totalAmount: number;
  orderItems: OrderItem[];
  status: string;
}

export default function OrdersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const ordersQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc')) : null),
    [firestore, user]
  );
  
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">You haven't placed any orders. Let's change that!</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id.slice(0, 7)}</CardTitle>
              <CardDescription>
                Placed on: {new Date(order.orderDate.seconds * 1000).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                     <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
               <p><span className="font-semibold">Status:</span> {order.status}</p>
               <p className="text-lg font-bold">Total: ৳{order.totalAmount.toFixed(2)}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
