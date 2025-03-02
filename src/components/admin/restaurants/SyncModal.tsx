// components/restaurants/SyncModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/new-card";

interface SyncResult {
  success: boolean;
  totalVendors: number;
  syncedVendors: number;
  createdVendors: number;
  updatedVendors: number;
  errors: Array<{ id: number; error: string }>;
}

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SyncModal({ isOpen, onClose, onSuccess }: SyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch('/api/restaurants/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to sync restaurants');
      }

      setResult(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sync Restaurants</DialogTitle>
          <DialogDescription>
            Fetch restaurant data from Snapfood and update your database.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result ? (
          <div className="space-y-4">
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Synchronization completed successfully
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.totalVendors}</CardTitle>
                  <CardDescription>Total Restaurants</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.syncedVendors}</CardTitle>
                  <CardDescription>Synced Successfully</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.createdVendors}</CardTitle>
                  <CardDescription>Newly Created</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.updatedVendors}</CardTitle>
                  <CardDescription>Updated</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {result.errors.length > 0 && (
              <Alert>
                <AlertTitle>Errors occurred</AlertTitle>
                <AlertDescription>
                  {result.errors.length} restaurants could not be synced
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            This will fetch all restaurants from Snapfood and update your local database.
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {result ? (
            <Button onClick={handleClose}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSync} disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Sync Now"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}