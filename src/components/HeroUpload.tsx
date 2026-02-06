import { useCallback } from 'react'
import ThemeToggle from './ThemeToggle'

interface HeroUploadProps {
  onFilesUpload: (files: File[]) => void
  loading: boolean
  error: string | null
}

export default function HeroUpload({ onFilesUpload, loading, error }: HeroUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
      if (files.length > 0) {
        onFilesUpload(files)
      }
    },
    [onFilesUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) {
        onFilesUpload(files)
      }
    },
    [onFilesUpload]
  )

  return (
    <div className="hero min-h-screen bg-base-200 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Payslip Analyzer</h1>
          <p className="py-6">
            Upload your ADP payslip PDFs to get a clear breakdown of your earnings, deductions, and
            where your money goes. Upload multiple payslips to see trends over time.
          </p>

          <div
            className="border-2 border-dashed border-base-300 rounded-box p-10 bg-base-100 cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Analyzing payslips...</p>
              </div>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-4 text-base-content/70">
                  Drag and drop your PDFs here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs mt-4"
                />
              </>
            )}
          </div>

          {error && (
            <div className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-base-content/50 mt-6">
            Your data stays private - all processing happens in your browser.
          </p>
        </div>
      </div>
    </div>
  )
}
