
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Delivered';

export interface Order {
  id: string;
  userId: string;
  orderDate: Timestamp;
  totalAmount: number;
  orderItems: OrderItem[];
  status: OrderStatus;
}

interface OrderManagementTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderManagementTable({ orders, isLoading }: OrderManagementTableProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (!firestore || !order.id) return;
    setUpdatingStatus(prev => ({ ...prev, [order.id]: true }));
    
    const topLevelOrderRef = doc(firestore, 'orders', order.id);

    try {
      // Update the top-level order document first.
      await updateDoc(topLevelOrderRef, { status: newStatus });

      // IMPORTANT: Only update the user-specific order if a userId exists on the order.
      // This prevents errors for orders that might not have a corresponding user document.
      if (order.userId) {
        const userOrderRef = doc(firestore, 'users', order.userId, 'orders', order.id);
        // This update is secondary. If it fails, the admin view is still correct.
        // In a production app, you might use a Cloud Function for consistency.
        await updateDoc(userOrderRef, { status: newStatus }).catch(userOrderError => {
            console.warn(`Could not update user-specific order doc for user ${order.userId}:`, userOrderError);
            // We don't throw an error here because the primary (admin) view is updated.
        });
      }

      toast({
        title: "Status Updated",
        description: `Order #${order.id.slice(0, 7)} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the order status in the main orders collection.",
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [order.id]: false }));
    }
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Processing':
        return 'default';
      case 'Delivered':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
           <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No orders found.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer ID</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 7)}...</TableCell>
            <TableCell>{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</TableCell>
            <TableCell>{order.userId ? `${order.userId.slice(0,7)}...` : 'N/A'}</TableCell>
            <TableCell>৳{order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" disabled={updatingStatus[order.id]}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(order, 'Pending')} disabled={order.status === 'Pending'}>
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(order, 'Processing')} disabled={order.status === 'Processing'}>
                    Mark as Processing
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleStatusChange(order, 'Delivered')} disabled={order.status === 'Delivered'}>
                    Mark as Delivered
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

    