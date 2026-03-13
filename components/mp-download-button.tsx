"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/components/language-provider"
import { isMiniProgram } from "@/lib/wechat-mp"
import { copyTextToClipboard } from "@/lib/mp-download"

interface MpDownloadButtonProps {
  blob: Blob | null
  filename: string
  disabled?: boolean
  variant?: "default" | "outline"
  className?: string
}

export function MpDownloadButton({ blob, filename, disabled, variant = "outline", className }: MpDownloadButtonProps) {
  const { language } = useLanguage()
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const isInMiniProgram = isMiniProgram()
  const zh = language === "zh"

  const handleDownload = () => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    setBlobUrl(url)

    if (isInMiniProgram) {
      // 在小程序中，复制当前页面链接
      copyTextToClipboard(window.location.href).then(copied => {
        if (copied) {
          toast.success(zh ? "链接已复制，请到浏览器打开下载" : "Link copied. Open in browser to download.")
        } else {
          toast.error(zh ? "复制失败，请手动复制链接" : "Copy failed. Please copy link manually.")
        }
      })
    } else {
      // 在浏览器中，直接下载
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleCopyLink = async () => {
    if (!blobUrl) return

    const copied = await copyTextToClipboard(window.location.href)
    if (copied) {
      toast.success(zh ? "链接已复制" : "Link copied")
    } else {
      toast.error(zh ? "复制失败" : "Copy failed")
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        onClick={handleDownload}
        disabled={disabled || !blob}
        className={className}
      >
        {isInMiniProgram ? (
          <>
            <Copy className="w-4 h-4 mr-2" />
            {zh ? "复制下载链接" : "Copy Link"}
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {zh ? "下载" : "Download"}
          </>
        )}
      </Button>

      {isInMiniProgram && blobUrl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="text-xs"
        >
          <Copy className="w-3 h-3 mr-1" />
          {zh ? "再次复制" : "Copy Again"}
        </Button>
      )}
    </div>
  )
}
