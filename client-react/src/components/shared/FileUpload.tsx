import { useRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import type { IFileUpload } from '../../types/fileUpload.types';
import { useImageSrc } from '../../hooks/useImageSrc';

// Props mirror a React Hook Form Controller render prop so the parent can wire this
// directly: <Controller render={({ field }) => <FileUpload field={field} />} />
interface FileUploadProps {
  field: ControllerRenderProps<any, any>;
  disabled?: boolean;
}

// Individual item — each image gets its own hook call to resolve src.
// Extracted as a sub-component so the hook is called at the item level, not in a loop.
function ImageItem({
  file,
  onDelete,
}: {
  file: IFileUpload;
  onDelete: () => void;
}) {
  const src = useImageSrc(file);

  return (
    <li className="relative inline-block mr-2 mb-2">
      {src ? (
        <img
          src={src}
          alt="upload preview"
          className="w-24 h-24 object-cover rounded border border-gray-300"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400">
          Loading…
        </div>
      )}

      {/* Overlay delete button — positioned top-right of the image, matching Angular */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full text-xs flex items-center justify-center shadow hover:bg-red-100 leading-none"
        aria-label="Remove image"
      >
        ✕
      </button>
    </li>
  );
}

// FileUpload replaces Angular's ControlValueAccessor component.
// Instead of ControlValueAccessor, this integrates with React Hook Form via
// Controller: the parent passes field.value / field.onChange via the `field` prop.
export function FileUpload({ field, disabled = false }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const files: IFileUpload[] = field.value ?? [];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;

    const newItems: IFileUpload[] = Array.from(selected).map((f) => ({ newFile: f }));
    field.onChange([...files, ...newItems]);

    // Reset input so the same file can be re-selected after deletion
    e.target.value = '';
  }

  function handleDelete(index: number) {
    field.onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <ul className="flex flex-wrap p-0 m-0 list-none">
        {files.map((file, i) => (
          <ImageItem
            // key uses index — stable for a small list of images on a single form
            key={i}
            file={file}
            onDelete={() => handleDelete(i)}
          />
        ))}
      </ul>

      {/* Hidden file input; the visible button triggers it programmatically */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="mt-1 px-3 py-1.5 text-sm border border-blue-600 text-blue-700 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add Image
      </button>
    </div>
  );
}
