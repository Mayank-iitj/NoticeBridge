"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Camera, FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function Uploader({ onUpload, isProcessing }: { onUpload: (data: { images?: string[], text?: string }) => void, isProcessing: boolean }) {
  const [pasteMode, setPasteMode] = useState(false);
  const [text, setText] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    // For images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        onUpload({ images: [base64] });
      };
      reader.readAsDataURL(file);
    } 
    // PDF handling
    else if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfjsLib = await import("pdfjs-dist");
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
          
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray as any).promise;
          const numPages = pdf.numPages;
          let fullText = "";
          const images = [];

          for (let i = 1; i <= Math.min(numPages, 3); i++) { // limit to 3 pages for demo
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
            
            // Render to image
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            if (context) {
              await page.render({ canvasContext: context, viewport } as any).promise;
              images.push(canvas.toDataURL("image/jpeg").split(",")[1]);
            }
          }
          
          onUpload({ text: fullText, images });
        } catch (e) {
          console.error("PDF parsing error", e);
          alert("Failed to parse PDF. Please try a photo or text.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    disabled: isProcessing
  });

  if (pasteMode) {
    return (
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-300">
        <Textarea 
          className="min-h-[200px] mb-4 font-sans text-lg" 
          placeholder="Paste the text of your notice here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setPasteMode(false)} disabled={isProcessing}>Cancel</Button>
          <Button 
            onClick={() => onUpload({ text })} 
            disabled={!text.trim() || isProcessing}
            className="font-inter font-bold"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Analyze Text
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/50"} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} capture="environment" />
        <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-sans mb-2">Drag and drop a photo or PDF</p>
        <p className="text-sm text-muted-foreground">or click to take a photo / browse</p>
      </div>
      
      <div className="flex gap-4 justify-center items-center">
        <div className="h-px bg-border flex-1" />
        <span className="text-sm text-muted-foreground font-inter">OR</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <Button variant="outline" size="lg" className="w-full font-inter" onClick={() => setPasteMode(true)} disabled={isProcessing}>
        <FileText className="w-5 h-5 mr-2" /> Paste Text Manually
      </Button>
    </div>
  );
}
