interface UploadWithProgressOptions {
  url: string;
  formData: FormData;
  accessToken: string;
  method?: "POST" | "PUT" | "PATCH";
  onProgress?: (percent: number) => void;
}

export function uploadWithProgress<T = unknown>({
  url,
  formData,
  accessToken,
  method = "POST",
  onProgress,
}: UploadWithProgressOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    // Deliberately NOT setting Content-Type — the browser sets the correct
    // multipart/form-data boundary automatically when sending a FormData
    // body. Setting it manually breaks the boundary and the upload fails.

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(xhr.response ? JSON.parse(xhr.response) : (undefined as T));
        } catch {
          resolve(undefined as T);
        }
      } else {
        let detail = `Upload failed with status ${xhr.status}`;
        try {
          const parsed = JSON.parse(xhr.response);
          detail = parsed?.detail || detail;
        } catch {
          // response wasn't JSON; keep the generic message
        }
        reject(new Error(detail));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));

    xhr.send(formData);
  });
}