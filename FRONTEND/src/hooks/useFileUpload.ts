import { useState } from "react";
import { supabase } from "../lib/supabase";
import { uploadWithProgress } from "../lib/uploadWithProgress";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

interface UseFileUploadOptions {
  path: string;
  method?: "POST" | "PUT" | "PATCH";
}

export function useFileUpload({ path, method = "POST" }: UseFileUploadOptions) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File, fieldName = "file") {
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated. Please log in.");
      }

      const formData = new FormData();
      formData.append(fieldName, file);

      const result = await uploadWithProgress({
        url: `${API_BASE_URL}${path}`,
        formData,
        accessToken: session.access_token,
        method,
        onProgress: setProgress,
      });

      setUploading(false);
      return result;
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : "Upload failed.");
      throw err;
    }
  }

  return { upload, progress, uploading, error };
}