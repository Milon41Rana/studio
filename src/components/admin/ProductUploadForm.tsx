
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useMemoFirebase, useStorage } from '@/firebase';
import type { Category } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  regularPrice: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  salePrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().min(0, { message: 'Stock cannot be negative.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  imageUrl: z.string().url({ message: 'Please upload an image or enter a valid URL.' }),
  variants: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductUploadFormProps {
  onSubmit: (data: ProductFormData) => void;
}

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ProductUploadForm({ onSubmit }: ProductUploadFormProps) {
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const categoriesCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'categories') : null),
    [firestore]
  );
  const { data: categoriesFromDB, isLoading: isLoadingCategories } = useCollection<Category>(categoriesCollection);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      regularPrice: 0,
      salePrice: undefined,
      stockQuantity: 0,
      category: '',
      imageUrl: '',
      variants: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setImagePreview(null);
    setUploadProgress(null);

    if (!file.type.startsWith('image/')) {
      setFileError('Invalid file type. Please upload an image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (!storage) {
        setFileError('Firebase Storage is not available. Please check your configuration and try again.');
        return;
    }

    setImagePreview(URL.createObjectURL(file));
    
    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}-${file.name}`;
    const fileRef = storageRef(storage, `products/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        
        let errorMessage = 'Image upload failed. Please try again.';
        switch (error.code) {
            case 'storage/unauthorized':
                errorMessage = 'Upload failed: You do not have permission to upload files.';
                break;
            case 'storage/canceled':
                 errorMessage = 'Upload was canceled. Please try again.';
                 break;
            case 'storage/retry-limit-exceeded':
                errorMessage = 'Upload failed: Connection timed out. Please check your network connection.';
                break;
        }

        setFileError(errorMessage);
        setUploadProgress(null);
        setImagePreview(null);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: errorMessage,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          form.setValue('imageUrl', downloadURL, { shouldValidate: true });
          setUploadProgress(null);
          toast({
            title: 'Upload Complete',
            description: 'Image URL has been set.',
          });
        });
      }
    );
  };

  function handleFormSubmit(data: ProductFormData) {
    onSubmit(data);
    form.reset();
    setImagePreview(null);
    setFileError(null);
    toast({
      title: 'Product Added!',
      description: `${data.name} has been added to the store.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Classic Cotton T-Shirt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product in detail..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="regularPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regular Price (৳)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 550" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (৳) (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 499" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              {isLoadingCategories ? (
                 <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCategories}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesFromDB?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variants</FormLabel>
              <FormControl>
                <Input placeholder="e.g. S, M, L, XL" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated values (e.g., Red, Green, Blue).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <FormLabel>Product Image</FormLabel>
            <div className="flex items-center gap-4">
                <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploadProgress !== null}
                />
                <label
                    htmlFor="file-upload"
                    className="flex-shrink-0 cursor-pointer"
                >
                    <Button type="button" variant="outline" asChild disabled={uploadProgress !== null}>
                        <span><UploadCloud className="mr-2 h-4 w-4" /> Upload File</span>
                    </Button>
                </label>
                 <p className="text-sm text-muted-foreground">or provide a URL below</p>
            </div>
             <FormDescription>
                Max file size: {MAX_FILE_SIZE_MB}MB. Direct image uploads are preferred.
            </FormDescription>
             {uploadProgress !== null && <Progress value={uploadProgress} className="w-full" />}
             {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
        </div>

        {imagePreview && (
          <div className="space-y-2">
            <FormLabel>Image Preview</FormLabel>
            <div className="relative w-32 h-32 rounded-md border overflow-hidden">
              <Image src={imagePreview} alt="Image Preview" fill className="object-cover" />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Upload an image or paste a URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || uploadProgress !== null}>
            {form.formState.isSubmitting ? 'Adding...' : (uploadProgress !== null ? 'Uploading...' : 'Add Product')}
        </Button>
      </form>
    </Form>
  );
}
