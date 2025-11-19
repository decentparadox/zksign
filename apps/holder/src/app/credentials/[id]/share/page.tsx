"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, ScopeSelector, QRCodeDisplay, Button, toast } from "@zksign/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { FieldOption, PredicateOption } from "@zksign/ui";

export default function ShareCredentialPage() {
  const params = useParams();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  // Mock credential fields (College ID example)
  const fields: FieldOption[] = [
    { name: "fullName", label: "Full Name", value: "John Doe" },
    { name: "institutionName", label: "Institution", value: "MIT" },
    { name: "program", label: "Program", value: "Computer Science" },
    { name: "yearOfStudy", label: "Year", value: "3" },
    { name: "studentStatus", label: "Status", value: "Active" },
  ];

  const predicates: PredicateOption[] = [
    { id: "age_over_18", label: "Age >= 18", description: "Prove you are 18 or older" },
    { id: "year_valid", label: "Year 1-4", description: "Prove year of study is valid" },
    { id: "status_active", label: "Active Status", description: "Prove student status is active" },
  ];

  const handleGenerateProof = async (selectedFields: string[], selectedPredicates: string[]) => {
    setIsGenerating(true);

    try {
      // TODO: Implement actual proof generation
      // 1. Load credential from storage
      // 2. Generate ZK proof using @zksign/zk-circuits
      // 3. Format proof for QR code
      // 4. Create QR data

      const mockProofData = {
        proof: "0x...", // Mock proof
        publicInputs: ["..."], // Mock public inputs
        credentialType: "college-id",
        disclosedFields: selectedFields.reduce((acc, field) => {
          const f = fields.find(f => f.name === field);
          if (f) acc[field] = f.value;
          return acc;
        }, {} as Record<string, any>),
        predicates: selectedPredicates,
        verifierContractAddress: "0x...", // Contract address
      };

      // Generate QR code data
      const qrDataString = JSON.stringify(mockProofData);
      setQrData(qrDataString);

      toast({
        title: "Success",
        description: "ZK proof generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate proof",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href={`/credentials/${params.id}`} className="flex items-center gap-2 text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Credential
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Share Credential</CardTitle>
            <CardDescription>
              Select which fields to disclose and predicates to prove
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!qrData ? (
              <ScopeSelector
                fields={fields}
                predicates={predicates}
                onGenerateProof={handleGenerateProof}
                isGenerating={isGenerating}
              />
            ) : (
              <div className="space-y-6">
                <QRCodeDisplay
                  data={qrData}
                  title="Scan to Verify"
                  description="Present this QR code to the verifier"
                />
                <Button
                  variant="outline"
                  onClick={() => setQrData(null)}
                  className="w-full"
                >
                  Generate New Proof
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

