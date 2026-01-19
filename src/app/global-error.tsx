
      
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-lg text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">
                Oops! Something Went Wrong
              </CardTitle>
              <CardDescription>
                We've encountered an unexpected issue. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If the problem persists, please contact our support team.
              </p>
              <Button
                onClick={
                  // Attempt to recover by trying to re-render the segment
                  () => reset()
                }
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}

    