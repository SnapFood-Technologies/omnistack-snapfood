// components/admin/snapfood-users/SyncModal.tsx
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
  message: string;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  errorDetails?: Array<{userId: string, error: string}>;
}

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: () => Promise<any>;
  onSuccess?: () => void;
}

export function SyncModal({ isOpen, onClose, onSync, onSuccess }: SyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const data = await onSync();

      if (!data.success) {
        throw new Error(data.message || 'Failed to sync users');
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
          <DialogTitle>Sync SnapFood Users</DialogTitle>
          <DialogDescription>
            Fetch user data from SnapFood and update your database.
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
                {result.message}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.created}</CardTitle>
                  <CardDescription>Newly Created</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.updated}</CardTitle>
                  <CardDescription>Updated</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.skipped}</CardTitle>
                  <CardDescription>Skipped</CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{result.errors}</CardTitle>
                  <CardDescription>Errors</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {result.errorDetails && result.errorDetails.length > 0 && (
              <Alert>
                <AlertTitle>Errors occurred</AlertTitle>
                <AlertDescription>
                  {result.errors} users could not be synced
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            This will fetch all users from SnapFood and update your local database.
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