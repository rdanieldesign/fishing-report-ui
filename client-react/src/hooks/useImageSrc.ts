import { useState, useEffect } from 'react';
import type { IFileUpload } from '../types/fileUpload.types';

// Replaces Angular's ImgSrcPipe (which returned an Observable<string>).
// Returns the resolved image URL: immediately for existing images,
// asynchronously via FileReader for new File objects.
export function useImageSrc(file: IFileUpload): string | null {
  // Initialise synchronously from imageURL so there is no blank-frame flash
  // for existing server images.
  const [src, setSrc] = useState<string | null>(file.imageURL ?? null);

  useEffect(() => {
    if (!file.newFile) return;

    const reader = new FileReader();
    // readAsDataURL is async; update state when the read completes
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file.newFile);
  }, [file.newFile]);

  return src;
}
