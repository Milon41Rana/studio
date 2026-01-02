'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Your cart is empty',
        description: 'Please add items to your cart before placing an order.',
      });
      return;
    }

    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot place order. User not logged in or database not available.',
      });
      return;
    }
    
    // This now saves to a top-level `orders` collection for easier admin access
    const ordersCollection = collection(firestore, 'orders');
    const newOrderRef = doc(ordersCollection); // Create a reference to get the ID

    const orderData = {
      id: newOrderRef.id,
      userId: user.uid,
      orderDate: serverTimestamp(),
      totalAmount: totalPrice,
      orderItems: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
        imageUrl: item.imageUrl,
      })),
      status: 'Pending'
    };

    // Use the non-blocking function to set the document in the top-level collection
    setDocumentNonBlocking(newOrderRef, orderData);
    
    // Also save to the user's subcollection. This is the part that was missing.
    // We use the same ID for consistency.
    const userOrderRef = doc(firestore, `users/${user.uid}/orders`, newOrderRef.id);
    setDocumentNonBlocking(userOrderRef, orderData);
    
    clearCart();

    toast({
      title: 'Order Placed!',
      description: 'Your order has been successfully placed. Thank you for shopping!',
    });
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex items-center p-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-muted-foreground">৳{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 h-10 text-center"
                />
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePlaceOrder}>
                Place Order (Cash on Delivery)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
