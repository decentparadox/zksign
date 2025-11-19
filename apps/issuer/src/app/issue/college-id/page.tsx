"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Button, toast } from "@zksign/ui";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IssueCollegeIDPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    studentId: "",
    institutionName: "",
    program: "",
    yearOfStudy: "",
    studentStatus: "active",
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 4).toISOString().split('T')[0],
    photoHash: "",
    holderPublicKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual credential issuance
      // 1. Generate credential ID
      // 2. Compute Poseidon commitment
      // 3. Sign with issuer key (MetaMask)
      // 4. Store in OrbitDB
      // 5. Register on-chain via CredentialRegistry

      toast({
        title: "Success",
        description: `College ID issued for ${formData.fullName}`,
      });

      // Navigate back
      setTimeout(() => router.push("/"), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to issue credential",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your wallet to issue credentials</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="flex items-center gap-2 text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Issue College ID</CardTitle>
            <CardDescription>
              Create a verifiable college identification credential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="program">Program *</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="yearOfStudy">Year of Study *</Label>
                  <Input
                    id="yearOfStudy"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="studentStatus">Student Status *</Label>
                  <select
                    id="studentStatus"
                    value={formData.studentStatus}
                    onChange={(e) => setFormData({ ...formData, studentStatus: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="photoHash">Photo Hash</Label>
                  <Input
                    id="photoHash"
                    value={formData.photoHash}
                    onChange={(e) => setFormData({ ...formData, photoHash: e.target.value })}
                    placeholder="IPFS hash or SHA256"
                  />
                </div>

                <div>
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="holderPublicKey">Holder Public Key (Address) *</Label>
                  <Input
                    id="holderPublicKey"
                    value={formData.holderPublicKey}
                    onChange={(e) => setFormData({ ...formData, holderPublicKey: e.target.value })}
                    placeholder="0x..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The wallet address of the credential holder
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Issuing..." : "Issue Credential"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

