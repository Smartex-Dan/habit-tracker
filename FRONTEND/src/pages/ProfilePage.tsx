import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useFileUpload } from "../hooks/useFileUpload";
import { ProgressBar } from "../components/ProgressBar";
import { FileDropZone } from "../components/FileDropZone";

interface AvatarUploadResponse {
  avatar_url: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const { upload, progress, uploading, error } = useFileUpload({
    path: "/profile/avatar",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFileSelected(file: File) {
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const result = (await upload(file)) as AvatarUploadResponse;
      setAvatarUrl(result.avatar_url);
    } catch {
      // error state is already captured by useFileUpload's `error`
    }
  }

  const displayedImage = avatarUrl || previewUrl;

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ background: "var(--color-background)", color: "var(--color-text)" }}
    >
      <h1
        className="text-2xl font-semibold mb-1"
        style={{ fontFamily: "var(--font-headline)" }}
      >
        Profile
      </h1>
      <p className="text-sm opacity-60 mb-8">{user?.email}</p>

      <div className="max-w-sm space-y-4">
        {displayedImage && (
          <div
            className="w-32 h-32 rounded-full overflow-hidden mx-auto"
            style={{ background: "var(--color-surface)" }}
          >
            <img src={displayedImage} alt="Profile avatar" className="w-full h-full object-cover" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!uploading ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <FileDropZone
                onFileSelected={handleFileSelected}
                label={
                  displayedImage
                    ? "Drag & drop a new photo, or click to browse"
                    : "Drag & drop your profile photo, or click to browse"
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="py-6"
            >
              <ProgressBar percent={progress} label="Uploading avatar" />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}