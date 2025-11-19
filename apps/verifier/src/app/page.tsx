"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, QRScanner, Button, toast } from "@zksign/ui";
import { ShieldCheck } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (data: string) => {
    try {
      // Parse QR code data
      const proofData = JSON.parse(data);
      
      toast({
        title: "QR Code Scanned",
        description: "Verifying proof on-chain...",
      });

      // Store proof data in session storage for verification page
      sessionStorage.setItem("proof-data", data);

      // Navigate to verification page
      router.push("/verify");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Invalid QR code data",
        variant: "destructive",
      });
    }
  };

  const handleError = (error: string) => {
    toast({
      title: "Scanner Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">ZKSign Verifier</h1>
          <p className="text-muted-foreground">
            Verify credentials with zero-knowledge proofs on-chain
          </p>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Privacy-preserving credential verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Scan the holder's QR code containing the ZK proof</li>
              <li>The proof is verified on-chain via smart contracts</li>
              <li>You only see the disclosed fields, nothing more</li>
              <li>Predicate results confirm statements (e.g., age >= 18)</li>
              <li>Blockchain receipt proves verification occurred</li>
            </ol>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Privacy Guarantee</p>
              <p className="text-xs text-muted-foreground mt-1">
                You will never see undisclosed credential fields. The holder maintains complete control over their personal information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner */}
        <QRScanner onScan={handleScan} onError={handleError} />

        {/* Manual Input Option */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Verification</CardTitle>
            <CardDescription>
              Already have the proof data? Verify it directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/verify/manual")}
            >
              Enter Proof Data Manually
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

