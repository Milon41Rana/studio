
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface PaymentSimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  totalAmount: number;
}

export function PaymentSimulationDialog({ isOpen, onClose, onConfirm, totalAmount }: PaymentSimulationDialogProps) {
  const [step, setStep] = useState(1);
  const [accountNumber, setAccountNumber] = useState('');

  const handleConfirm = () => {
    // In a real scenario, you would verify the payment here.
    // For simulation, we'll just proceed.
    onConfirm('bKash');
  };

  const resetAndClose = () => {
    setStep(1);
    setAccountNumber('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
           <div className="flex justify-center mb-2">
            <Image src="https://tds-images.thedailystar.net/sites/default/files/styles/big_202/public/images/2023/07/11/bkash.jpg?itok=3v5E26lR" alt="bKash Logo" width={100} height={100} />
          </div>
          <DialogTitle className="text-center text-xl">bKash Checkout</DialogTitle>
           <DialogDescription className="text-center">
            This is a simulated payment gateway. No real money will be charged.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Payable Amount</p>
            <p className="text-3xl font-bold">৳{totalAmount.toFixed(2)}</p>
          </div>
          
          {step === 1 && (
            <div className="space-y-2">
                <Label htmlFor="bKash-number">Your bKash Account Number</Label>
                <Input 
                    id="bKash-number" 
                    placeholder="e.g. 01xxxxxxxxx" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
                 <Label htmlFor="bKash-pin">Enter PIN</Label>
                <Input id="bKash-pin" type="password" placeholder="••••" />
                <p className="text-xs text-muted-foreground pt-2">For your security, do not share your PIN with anyone. This is a simulation.</p>
            </div>
          )}

        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          {step === 1 ? (
             <Button onClick={() => setStep(2)} disabled={!accountNumber}>Proceed</Button>
          ) : (
             <Button onClick={handleConfirm}>Confirm Payment</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
