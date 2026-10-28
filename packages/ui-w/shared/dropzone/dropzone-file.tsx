"use client"

import * as React from "react"
import Image from "next/image"

import { IconCloudUpload, IconFile, IconFileTypeCsv, IconTrash } from "@tabler/icons-react"

import { cn } from "@packages/ui-w/lib/utils"

import { getDefaultAcceptedFileTypesLabel } from "@packages/ui-w/helpers/dropzone-file/get-default-accepted-file-types-label"
import { getDefaultFileSizeLabel } from "@packages/ui-w/helpers/dropzone-file/get-default-file-size-label"
import { getDefaultMaxSizeLabel } from "@packages/ui-w/helpers/dropzone-file/get-default-max-size-label"
import { isAcceptedFile } from "@packages/ui-w/helpers/dropzone-file/is-accepted-file"
import { isCSVFile } from "@packages/ui-w/helpers/dropzone-file/is-csv-file"

export interface DroppedFile {
  id: string
  file: File
  preview?: string
}

export interface DropZoneFileProps {
  onFilesChange: (files: DroppedFile[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  acceptedFileTypes?: string[]
  initialFiles?: DroppedFile[]
  dragTitle?: React.ReactNode
  dragDescription?: React.ReactNode
  idleTitle?: React.ReactNode
  idleDescription?: React.ReactNode
  maxSizeLabel?: (maxSize: number) => React.ReactNode
  acceptedFileTypesLabel?: (acceptedFileTypes: string[]) => React.ReactNode
  fileSizeFormatter?: (size: number) => React.ReactNode
  renderError?: (error: string) => React.ReactNode
}

export function DropZoneFile({
  onFilesChange,
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  disabled = false,
  className,
  children,
  acceptedFileTypes = ["*"],
  initialFiles = [],
  dragTitle = "Drop files here",
  dragDescription = "Release to upload your files",
  idleTitle = "Drag & drop files here",
  idleDescription = "or click to browse",
  maxSizeLabel = getDefaultMaxSizeLabel,
  acceptedFileTypesLabel = getDefaultAcceptedFileTypesLabel,
  fileSizeFormatter = getDefaultFileSizeLabel,
  renderError,
}: DropZoneFileProps): React.ReactElement {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<DroppedFile[]>(initialFiles)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setFiles(initialFiles)
  }, [initialFiles])

  const processFiles = React.useCallback(
    (fileList: FileList | File[]) => {
      setError(null)
      const newFiles: DroppedFile[] = []
      const fileArray = Array.from(fileList)

      if (!multiple && fileArray.length > 1) {
        setError("Only one file allowed")
        return
      }

      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      for (const file of fileArray) {
        if (!isAcceptedFile(file, accept)) {
          setError(`File ${file.name} is not an accepted file type`)
          continue
        }

        if (maxSize && file.size > maxSize) {
          setError(`File ${file.name} exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
          continue
        }

        const droppedFile: DroppedFile = {
          id: crypto.randomUUID(),
          file,
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }
        newFiles.push(droppedFile)
      }

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
        setFiles(updatedFiles)
        onFilesChange(updatedFiles)
      }
    },
    [accept, files, maxFiles, maxSize, multiple, onFilesChange],
  )

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (!disabled && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [disabled, processFiles],
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
    },
    [processFiles],
  )

  const removeFile = React.useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      const updatedFiles = files.filter((f) => f.id !== id)
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
    },
    [files, onFilesChange],
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-8 transition-colors duration-200",
          isDragging ? "border-primary bg-primary/5" : "border-input bg-background",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          aria-label="File input"
        />

        {children || (
          <div className="flex flex-col items-center justify-center text-center">
            <IconCloudUpload
              size={40}
              className={cn("text-muted-foreground mb-3", isDragging && "text-primary")}
            />
            <p className="text-foreground text-sm font-medium">
              {isDragging ? dragTitle : idleTitle}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {isDragging ? dragDescription : idleDescription}
            </p>
            {maxSize && (
              <p className="text-muted-foreground mt-2 text-xs">
                {acceptedFileTypesLabel(acceptedFileTypes)} · {maxSizeLabel(maxSize)} per file
              </p>
            )}
          </div>
        )}
      </div>

      {error &&
        (renderError ? (
          renderError(error)
        ) : (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        ))}

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "group relative flex w-full items-center gap-2 rounded-xl p-2 pr-8",
                "bg-zinc-100 dark:bg-zinc-800",
              )}
            >
              {file.preview ? (
                <Image
                  width={40}
                  height={40}
                  src={file.preview}
                  alt={file.file.name}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-700">
                  {isCSVFile(file.file) ? (
                    <IconFileTypeCsv className="text-zinc-500 dark:text-zinc-400" size={20} />
                  ) : (
                    <IconFile className="text-zinc-500 dark:text-zinc-400" size={20} />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium break-all text-zinc-700 dark:text-zinc-300">
                  {file.file.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {fileSizeFormatter(file.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className={cn(
                  "absolute top-1 right-1 cursor-pointer rounded-xl p-1 transition-colors",
                  "text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600",
                  "dark:text-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-300",
                )}
                aria-label={`Remove ${file.file.name}`}
              >
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
