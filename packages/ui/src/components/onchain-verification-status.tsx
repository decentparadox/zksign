"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export type VerificationStatus = "pending" | "verifying" | "valid" | "invalid";

interface OnChainVerificationStatusProps {
  status: VerificationStatus;
  transactionHash?: string;
  blockExplorerUrl?: string;
  credentialType?: string;
  disclosedFields?: Record<string, any>;
  predicateResults?: Record<string, boolean>;
  issuer?: string;
}

export function OnChainVerificationStatus({
  status,
  transactionHash,
  blockExplorerUrl,
  credentialType,
  disclosedFields,
  predicateResults,
  issuer,
}: OnChainVerificationStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
      case "verifying":
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />;
      case "valid":
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case "invalid":
        return <XCircle className="h-12 w-12 text-destructive" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Awaiting Verification";
      case "verifying":
        return "Verifying On-Chain...";
      case "valid":
        return "Verification Successful";
      case "invalid":
        return "Verification Failed";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "valid":
        return <Badge variant="default">✓ Valid</Badge>;
      case "invalid":
        return <Badge variant="destructive">✗ Invalid</Badge>;
      default:
        return <Badge variant="secondary">Verifying...</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Verification Result</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>On-chain ZK proof verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2 py-4">
          {getStatusIcon()}
          <h3 className="text-xl font-semibold">{getStatusText()}</h3>
        </div>

        {credentialType && (
          <div>
            <h4 className="font-medium mb-2">Credential Type</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {credentialType.replace(/-/g, " ")}
            </p>
          </div>
        )}

        {issuer && (
          <div>
            <h4 className="font-medium mb-2">Issuer</h4>
            <p className="text-sm text-muted-foreground font-mono">{issuer}</p>
          </div>
        )}

        {disclosedFields && Object.keys(disclosedFields).length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Disclosed Fields</h4>
            <div className="space-y-2">
              {Object.entries(disclosedFields).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {predicateResults && Object.keys(predicateResults).length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Predicate Verification</h4>
            <div className="space-y-2">
              {Object.entries(predicateResults).map(([predicate, result]) => (
                <div key={predicate} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{predicate}</span>
                  {result ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {transactionHash && blockExplorerUrl && (
          <div>
            <h4 className="font-medium mb-2">Transaction</h4>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(`${blockExplorerUrl}/tx/${transactionHash}`, "_blank")}
            >
              View on Block Explorer
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

