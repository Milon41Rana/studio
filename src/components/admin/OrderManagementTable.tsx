"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";

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
  status: 'Pending' | 'Delivered';
}

interface OrderManagementTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderManagementTable({ orders, isLoading }: OrderManagementTableProps) {
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
          <TableHead className="text-right">Total Amount</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 7)}...</TableCell>
            <TableCell>{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</TableCell>
            <TableCell>{order.userId.slice(0,7)}...</TableCell>
            <TableCell className="text-right">৳{order.totalAmount.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                {order.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
