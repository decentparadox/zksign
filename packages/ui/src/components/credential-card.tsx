"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDate } from "../lib/utils";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";

export type CredentialType = "college-id" | "citizenship-card" | "drivers-license" | "vehicle-registration";

interface CredentialCardProps {
  id: string;
  type: CredentialType;
  holderName: string;
  issuerName: string;
  issueDate: string | Date;
  expiryDate: string | Date;
  status?: "active" | "expired" | "revoked";
  onClick?: () => void;
  fields?: Record<string, any>;
}

const credentialTypeLabels: Record<CredentialType, string> = {
  "college-id": "College ID",
  "citizenship-card": "Citizenship Card",
  "drivers-license": "Driver's License",
  "vehicle-registration": "Vehicle Registration",
};

export function CredentialCard({
  id,
  type,
  holderName,
  issuerName,
  issueDate,
  expiryDate,
  status = "active",
  onClick,
  fields,
}: CredentialCardProps) {
  const isExpired = new Date(expiryDate) < new Date();
  const finalStatus = isExpired ? "expired" : status;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        onClick ? "hover:border-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {credentialTypeLabels[type]}
            </CardTitle>
          </div>
          <Badge
            variant={
              finalStatus === "active"
                ? "default"
                : finalStatus === "expired"
                ? "secondary"
                : "destructive"
            }
          >
            {finalStatus}
          </Badge>
        </div>
        <CardDescription>Issued by {issuerName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Holder:</span>
            <span className="text-muted-foreground">{holderName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Issued: {formatDate(issueDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Expires: {formatDate(expiryDate)}
            </span>
          </div>
          {finalStatus === "expired" && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>This credential has expired</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

