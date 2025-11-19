"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "./ui/use-toast";

interface QRCodeDisplayProps {
  data: string | object;
  title?: string;
  description?: string;
  size?: number;
}

export function QRCodeDisplay({
  data,
  title = "Scan QR Code",
  description = "Present this QR code to the verifier",
  size = 300,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        const stringData = typeof data === "string" ? data : JSON.stringify(data);
        try {
          await QRCode.toCanvas(canvasRef.current, stringData, {
            width: size,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          
          const url = canvasRef.current.toDataURL();
          setDataUrl(url);
        } catch (error) {
          console.error("Error generating QR code:", error);
          toast({
            title: "Error",
            description: "Failed to generate QR code",
            variant: "destructive",
          });
        }
      }
    };

    generateQR();
  }, [data, size]);

  const handleDownload = () => {
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "credential-qr.png";
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "QR code downloaded",
      });
    }
  };

  const handleCopyData = async () => {
    const stringData = typeof data === "string" ? data : JSON.stringify(data);
    try {
      await navigator.clipboard.writeText(stringData);
      toast({
        title: "Success",
        description: "QR data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleCopyData} variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Copy Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

