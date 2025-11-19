"use client";

import { useAccount } from "wagmi";
import { WalletConnect, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, CredentialCard } from "@zksign/ui";
import Link from "next/link";
import { Plus, Wallet } from "lucide-react";

export default function HomePage() {
  const { isConnected, address } = useAccount();

  // Mock credentials for demonstration
  const mockCredentials = [
    {
      id: "cred-1",
      type: "college-id" as const,
      holderName: "John Doe",
      issuerName: "MIT",
      issueDate: new Date("2024-01-01"),
      expiryDate: new Date("2028-01-01"),
      status: "active" as const,
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">ZKSign Holder Wallet</h1>
            <p className="text-muted-foreground mt-2">
              Your self-sovereign identity wallet
            </p>
          </div>
          <WalletConnect />
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect MetaMask to access your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your wallet address serves as your decentralized identity (DID).
                Connect to view and manage your credentials.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Holder DID */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <CardTitle>Your Holder DID</CardTitle>
                </div>
                <CardDescription>{address}</CardDescription>
              </CardHeader>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/import">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Import Credential
                </Button>
              </Link>
            </div>

            {/* Credentials */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">My Credentials</h2>
              {mockCredentials.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No credentials yet. Import a credential to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {mockCredentials.map((cred) => (
                    <Link key={cred.id} href={`/credentials/${cred.id}`}>
                      <CredentialCard {...cred} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

