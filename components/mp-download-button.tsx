"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/components/language-provider"
import { isMiniProgram } from "@/lib/wechat-mp"
import { copyTextToClipboard } from "@/lib/mp-download"

interface MpDownloadButtonProps {
  blob: Blob | Promise<Blob> | null
  filename: string
  disabled?: boolean
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function MpDownloadButton({ blob, filename, disabled, variant = "outline", size, className }: MpDownloadButtonProps) {
  const { language } = useLanguage()
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const isInMiniProgram = isMiniProgram()
  const zh = language === "zh"

  const handleDownload = async () => {
    if (!blob) return

    const resolvedBlob = blob instanceof Promise ? await blob : blob
    const url = URL.createObjectURL(resolvedBlob)
    setBlobUrl(url)

    if (isInMiniProgram) {
      // 在小程序中，复制当前页面链接
      copyTextToClipboard(window.location.href).then(copied => {
        if (copied) {
          toast.success(zh ? "���接已复制，请到浏览器打开下载" : "Link copied. Open in browser to download.")
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
    <Button
      variant={variant}
      size={size}
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
  )
}
