
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Landmark } from 'lucide-react';

interface PaymentSimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  totalAmount: number;
}

export function PaymentSimulationDialog({ isOpen, onClose, onConfirm, totalAmount }: PaymentSimulationDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState('bKash');

  const paymentMethods = [
    { id: 'bKash', name: 'bKash', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'Nagad', name: 'Nagad', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'Card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'COD', name: 'Cash on Delivery', icon: <Landmark className="h-5 w-5" /> },
  ];

  const handleConfirm = () => {
    if (selectedMethod) {
      onConfirm(selectedMethod);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simulated Payment</DialogTitle>
          <DialogDescription>
            This is a simulated payment gateway. No real transaction will occur.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">Total Payable Amount</p>
            <p className="text-3xl font-bold">৳{totalAmount.toFixed(2)}</p>
          </div>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedMethod === method.id ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  {method.icon}
                  <span>{method.name}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
