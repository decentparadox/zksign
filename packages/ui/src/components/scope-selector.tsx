"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export interface FieldOption {
  name: string;
  label: string;
  value: any;
  sensitive?: boolean;
}

export interface PredicateOption {
  id: string;
  label: string;
  description?: string;
}

interface ScopeSelectorProps {
  fields: FieldOption[];
  predicates?: PredicateOption[];
  onGenerateProof: (selectedFields: string[], selectedPredicates: string[]) => void;
  isGenerating?: boolean;
}

export function ScopeSelector({
  fields,
  predicates = [],
  onGenerateProof,
  isGenerating = false,
}: ScopeSelectorProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [selectedPredicates, setSelectedPredicates] = useState<Set<string>>(new Set());

  const toggleField = (fieldName: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldName)) {
      newSelected.delete(fieldName);
    } else {
      newSelected.add(fieldName);
    }
    setSelectedFields(newSelected);
  };

  const togglePredicate = (predicateId: string) => {
    const newSelected = new Set(selectedPredicates);
    if (newSelected.has(predicateId)) {
      newSelected.delete(predicateId);
    } else {
      newSelected.add(predicateId);
    }
    setSelectedPredicates(newSelected);
  };

  const handleGenerateProof = () => {
    onGenerateProof(Array.from(selectedFields), Array.from(selectedPredicates));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Fields to Disclose</CardTitle>
          <CardDescription>
            Choose which credential fields to reveal to the verifier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={selectedFields.has(field.name)}
                  onCheckedChange={() => toggleField(field.name)}
                />
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div>
                    <div>{field.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedFields.has(field.name)
                        ? `Will reveal: ${field.value}`
                        : "Hidden"}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {predicates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Predicates to Prove</CardTitle>
            <CardDescription>
              Choose statements to prove without revealing underlying values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predicates.map((predicate) => (
                <div key={predicate.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={predicate.id}
                    checked={selectedPredicates.has(predicate.id)}
                    onCheckedChange={() => togglePredicate(predicate.id)}
                  />
                  <Label
                    htmlFor={predicate.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <div>
                      <div>{predicate.label}</div>
                      {predicate.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {predicate.description}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleGenerateProof}
          disabled={isGenerating || (selectedFields.size === 0 && selectedPredicates.size === 0)}
          size="lg"
        >
          {isGenerating ? "Generating Proof..." : "Generate ZK Proof"}
        </Button>
      </div>
    </div>
  );
}

