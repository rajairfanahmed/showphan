"use client";

import React, { useState, useRef, useCallback } from "react";
import { getCoverImageUrl } from "@/lib/storage/urls";

interface CoverImageUploaderProps {
  coverImageKey: string | null;
  onUploadSuccess: (key: string) => void;
  onRemoveCover: () => void;
  disabled?: boolean;
}

export function CoverImageUploader({
  coverImageKey,
  onUploadSuccess,
  onRemoveCover,
  disabled = false,
}: CoverImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const coverUrl = coverImageKey ? getCoverImageUrl(coverImageKey) : null;

  // Cancel in-flight upload
  const handleCancelUpload = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setWarningMessage("Upload canceled.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Process and upload file
  const processAndUploadFile = useCallback(
    async (file: File) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Only JPG, PNG, and WebP images are accepted.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setWarningMessage(null);

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = async () => {
        if (img.width < 1000) {
          setWarningMessage("Image width is under 1000px. High-DPI screens may look soft.");
        }

        // Resize & compress to WebP (16:9 standard, max width 1600px)
        const canvas = document.createElement("canvas");
        const maxW = 1600;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setIsUploading(false);
              return;
            }

            try {
              // 1. Get Presigned PUT URL
              const presignRes = await fetch("/api/uploads/cover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mimeType: "image/webp",
                  fileSize: blob.size,
                }),
              });

              if (!presignRes.ok) {
                const err = await presignRes.json();
                alert(err.error?.message || "Failed to initialize image upload.");
                setIsUploading(false);
                return;
              }

              const { uploadUrl, key } = await presignRes.json();

              // 2. Direct upload via XHR with progress tracking and abort support
              const xhr = new XMLHttpRequest();
              xhrRef.current = xhr;

              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
                  setUploadProgress(percent);
                }
              };

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  setUploadProgress(100);
                  setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                    onUploadSuccess(key);
                  }, 250);
                } else {
                  alert(`Upload failed with status code ${xhr.status}.`);
                  setIsUploading(false);
                  setUploadProgress(0);
                }
                xhrRef.current = null;
              };

              xhr.onerror = () => {
                alert("Network error during image transfer.");
                setIsUploading(false);
                setUploadProgress(0);
                xhrRef.current = null;
              };

              xhr.onabort = () => {
                setIsUploading(false);
                setUploadProgress(0);
                xhrRef.current = null;
              };

              xhr.open("PUT", uploadUrl, true);
              xhr.setRequestHeader("Content-Type", "image/webp");
              xhr.send(blob);
            } catch (err) {
              console.error("Upload error", err);
              setIsUploading(false);
              setUploadProgress(0);
            }
          },
          "image/webp",
          0.85
        );
      };

      reader.readAsDataURL(file);
    },
    [onUploadSuccess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  // SVG Circular Ring calculation
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - uploadProgress / 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[var(--foreground)]">
          16:9 Cover Image <span className="text-[#0052ff]">*</span>
        </label>
        <span className="text-xs text-[var(--foreground-muted)]">
          Recommended: 1600 × 900 (WebP, PNG, or JPG)
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative aspect-video w-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-[var(--card)] flex flex-col items-center justify-center ${
          isDragging
            ? "border-[#0052ff] bg-blue-500/5 scale-[1.005]"
            : "border-[var(--border)] hover:border-blue-500/50"
        }`}
      >
        {/* State A: Upload In-Flight with Animated Circular Progress & Cancel Button */}
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 animate-fade-in z-20">
            {/* Circular Progress Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Animated Value Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  className="stroke-[#0052ff] transition-all duration-150 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Numerical % Text Inside Circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-lg font-black font-mono text-[var(--foreground)] tracking-tight">
                  {uploadProgress}%
                </span>
                <span className="text-[10px] uppercase font-bold text-[#0052ff] tracking-wider">
                  uploading
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] font-medium">
              Optimizing to WebP & streaming to Cloudflare R2...
            </p>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancelUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel Upload</span>
            </button>
          </div>
        ) : coverUrl ? (
          /* State B: Verified Cover Image Present */
          <div className="relative w-full h-full group">
            <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
            
            {/* Floating Top-Right Overlay Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-black/90 active:scale-95 transition-all cursor-pointer shadow-lg">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Replace</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  disabled={disabled}
                  onChange={(e) => e.target.files?.[0] && processAndUploadFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={onRemoveCover}
                disabled={disabled}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:text-red-400 hover:bg-black/90 active:scale-95 transition-all cursor-pointer shadow-lg"
                title="Remove cover image"
                aria-label="Remove cover image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* State C: Empty Dropzone State */
          <label className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-[#0052ff] border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#0052ff] transition-colors">
              Click to upload or drag & drop 16:9 Cover
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Optimized for clean presentation without text overlays
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              disabled={disabled}
              onChange={(e) => e.target.files?.[0] && processAndUploadFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        )}
      </div>

      {warningMessage && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium animate-fade-in flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{warningMessage}</span>
        </p>
      )}
    </div>
  );
}
