"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TermsAcceptModal() {
  const { refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const updated = await AuthService.acceptTerms();
      if (!updated) {
        setError("Failed to accept. Please try again.");
        setSubmitting(false);
        return;
      }
      await refreshUser();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Please review and accept the Terms of Service to continue.
        </p>
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4 hover:no-underline"
        >
          View Terms of Service
        </a>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <DialogFooter>
          <Button onClick={handleAccept} disabled={submitting}>
            {submitting ? "Accepting…" : "I agree"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
