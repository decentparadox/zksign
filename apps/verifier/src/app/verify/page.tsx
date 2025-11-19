"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, OnChainVerificationStatus, Button, toast } from "@zksign/ui";
import type { VerificationStatus } from "@zksign/ui";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [proofData, setProofData] = useState<any>(null);
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    // Get proof data from session storage
    const data = sessionStorage.getItem("proof-data");
    if (!data) {
      toast({
        title: "Error",
        description: "No proof data found",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setProofData(parsed);
      verifyOnChain(parsed);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid proof data",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [router]);

  const verifyOnChain = async (data: any) => {
    try {
      // TODO: Implement actual on-chain verification
      // 1. Determine credential type
      // 2. Call appropriate verifier contract
      // 3. Get transaction receipt
      // 4. Check OrbitDB for revocation status

      // Mock verification delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock successful verification
      setStatus("valid");
      setTxHash("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");

      toast({
        title: "Verification Complete",
        description: "Credential verified on-chain",
      });
    } catch (error: any) {
      setStatus("invalid");
      toast({
        title: "Verification Failed",
        description: error.message || "Proof verification failed",
        variant: "destructive",
      });
    }
  };

  if (!proofData) {
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="flex items-center gap-2 text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Scanner
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>On-Chain Verification</CardTitle>
            <CardDescription>
              Verifying credential proof via blockchain
            </CardDescription>
          </CardHeader>
        </Card>

        <OnChainVerificationStatus
          status={status}
          transactionHash={txHash}
          blockExplorerUrl="https://sepolia.etherscan.io"
          credentialType={proofData.credentialType}
          disclosedFields={proofData.disclosedFields}
          predicateResults={
            proofData.predicates?.reduce((acc: any, p: string) => {
              acc[p] = true; // Mock all predicates as valid
              return acc;
            }, {})
          }
          issuer="0x1234...5678" // Mock issuer
        />

        {status === "valid" && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/")}
            >
              Verify Another
            </Button>
            {txHash && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank")
                }
              >
                View on Etherscan
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {status === "invalid" && (
          <Button onClick={() => router.push("/")} className="w-full">
            Try Again
          </Button>
        )}
      </div>
    </main>
  );
}

