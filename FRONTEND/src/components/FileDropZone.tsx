import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FileDropZoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  label?: string;
}

export function FileDropZone({
  onFileSelected,
  accept = "image/jpeg,image/png,image/webp",
  disabled = false,
  label = "Drag & drop an image, or click to browse",
}: FileDropZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDraggingOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      animate={{
        borderColor: isDraggingOver ? "var(--color-accent)" : "var(--color-primary)",
        scale: isDraggingOver ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6 cursor-pointer"
      style={{
        background: "var(--color-surface)",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDraggingOver ? "dragging" : "idle"}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: isDraggingOver ? 1.15 : 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <UploadIcon />
        </motion.div>
      </AnimatePresence>

      <p
        className="text-sm text-center opacity-70"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
      >
        {label}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />
    </motion.div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}