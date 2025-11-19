"use client";

import { useAccount } from "wagmi";
import { WalletConnect, Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@zksign/ui";
import Link from "next/link";
import { CreditCard, UserCheck, FileText, Car } from "lucide-react";

export default function HomePage() {
  const { isConnected, address } = useAccount();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">ZKSign Issuer Portal</h1>
            <p className="text-muted-foreground mt-2">
              Issue verifiable credentials with zero-knowledge proofs
            </p>
          </div>
          <WalletConnect />
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect MetaMask to start issuing credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your wallet address will serve as your issuer identity (DID).
                Make sure you're using an authorized issuer account.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Issuer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Issuer Information</CardTitle>
                <CardDescription>Your issuer DID: {address}</CardDescription>
              </CardHeader>
            </Card>

            {/* Credential Types */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Issue Credentials</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* College ID */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <CardTitle>College ID</CardTitle>
                    </div>
                    <CardDescription>
                      Issue college identification credentials for students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/issue/college-id">
                      <Button className="w-full">Issue College ID</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Citizenship Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-6 w-6 text-primary" />
                      <CardTitle>Citizenship Card</CardTitle>
                    </div>
                    <CardDescription>
                      Issue citizenship identification credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/issue/citizenship-card">
                      <Button className="w-full">Issue Citizenship Card</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Driver's License */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <CardTitle>Driver's License</CardTitle>
                    </div>
                    <CardDescription>
                      Issue driver's license credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/issue/drivers-license">
                      <Button className="w-full">Issue Driver's License</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Vehicle Registration */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Car className="h-6 w-6 text-primary" />
                      <CardTitle>Vehicle Registration</CardTitle>
                    </div>
                    <CardDescription>
                      Issue vehicle registration credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/issue/vehicle-registration">
                      <Button className="w-full">Issue Vehicle Registration</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Credentials */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Credentials</CardTitle>
                <CardDescription>
                  Recently issued credentials will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No credentials issued yet. Start issuing credentials using the forms above.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

