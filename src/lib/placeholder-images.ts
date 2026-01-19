import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// The JSON file has a top-level key "placeholderImages" which contains the array.
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
