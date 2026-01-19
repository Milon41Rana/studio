import data from './placeholder-images.json';

// Correctly destructure the nested array
const { placeholderImages: images } = data;

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Assign the destructured and renamed variable
export const PlaceHolderImages: ImagePlaceholder[] = images;
