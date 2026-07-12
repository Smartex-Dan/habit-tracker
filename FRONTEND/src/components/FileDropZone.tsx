import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FileDropZoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  label?: string;
  /** Pass these straight from useFileUpload() to drive the progress/success states */
  uploading?: boolean;
  progress?: number; // 0-100
}

type VisualState = "idle" | "dragging" | "uploading" | "success";

export function FileDropZone({
  onFileSelected,
  accept = "image/jpeg,image/png,image/webp",
  disabled = false,
  label = "Drag & drop an image, or click to browse",
  uploading = false,
  progress = 0,
}: FileDropZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const wasUploading = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect the uploading -> not-uploading transition (a completed upload)
  // and hold a brief success state before settling back to idle.
  useEffect(() => {
    if (wasUploading.current && !uploading) {
      setShowSuccess(true);
      const timeout = setTimeout(() => setShowSuccess(false), 1600);
      return () => clearTimeout(timeout);
    }
    wasUploading.current = uploading;
  }, [uploading]);

  const visualState: VisualState = uploading
    ? "uploading"
    : showSuccess
    ? "success"
    : isDraggingOver
    ? "dragging"
    : "idle";

  const isBusy = uploading || disabled;

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!isBusy) setIsDraggingOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (isBusy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  const borderColor =
    visualState === "success"
      ? "var(--color-success)"
      : visualState === "dragging"
      ? "var(--color-accent)"
      : "var(--color-primary)";

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isBusy && inputRef.current?.click()}
      role="button"
      tabIndex={isBusy ? -1 : 0}
      animate={{
        borderColor,
        scale: visualState === "dragging" ? 1.02 : 1,
      }}
      transition={{ duration: 0.25 }}
      className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6 cursor-pointer relative overflow-hidden"
      style={{
        background: "var(--color-surface)",
        opacity: disabled && !uploading ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <AnimatePresence mode="wait">
        {visualState === "uploading" ? (
          <motion.div
            key="uploading"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressRing progress={progress} />
          </motion.div>
        ) : visualState === "success" ? (
          <motion.div
            key="success"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <SuccessCheck />
          </motion.div>
        ) : (
          <motion.div
            key={visualState}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: visualState === "dragging" ? 1.15 : 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadIcon />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={visualState}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-center opacity-70"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
        >
          {visualState === "uploading"
            ? `Uploading… ${Math.round(progress)}%`
            : visualState === "success"
            ? "Uploaded!"
            : label}
        </motion.p>
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={isBusy}
        className="hidden"
      />
    </motion.div>
  );
}

function UploadIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle cx="24" cy="24" r={radius} fill="none" stroke="var(--color-background)" strokeWidth="4" />
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
      />
    </svg>
  );
}

function SuccessCheck() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="var(--color-success)"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M12 20l5.5 5.5L28 14"
        stroke="var(--color-success)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.25, ease: "easeOut" }}
      />
    </svg>
  );
}