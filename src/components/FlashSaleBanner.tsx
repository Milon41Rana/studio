
      
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const bannerImage = PlaceHolderImages.find(img => img.id === 'flash-sale-banner');

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="w-full relative rounded-lg overflow-hidden shadow-lg mb-8">
      {bannerImage && (
        <Image
          src={bannerImage.imageUrl}
          alt={bannerImage.description}
          fill
          className="object-cover"
          data-ai-hint={bannerImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 p-6 md:p-12 flex flex-col items-center justify-center text-center text-white h-[300px] md:h-[400px]">
        <h1 className="text-4xl md:text-6xl font-extrabold font-headline mb-2 drop-shadow-md">
          Flash Sale!
        </h1>
        <p className="text-lg md:text-xl mb-6 drop-shadow">Unbeatable prices for a limited time.</p>
        <div className="flex items-center gap-4 bg-background/20 backdrop-blur-sm p-4 rounded-lg shadow-xl">
          <p className="text-sm uppercase font-semibold">Ends in:</p>
          <div className="flex gap-2 text-2xl font-mono font-bold">
            <span className="bg-primary/80 text-primary-foreground px-2 py-1 rounded-md">{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-primary/80 text-primary-foreground px-2 py-1 rounded-md">{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-primary/80 text-primary-foreground px-2 py-1 rounded-md">{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

    