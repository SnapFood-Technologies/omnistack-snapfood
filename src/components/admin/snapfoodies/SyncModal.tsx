// components/admin/snapfoodies/SyncModal.tsx
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
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/new-card";
import { ProgressBar } from "@/components/ui/progress-bar";

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
  const [batchCount, setBatchCount] = useState(1);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setBatchCount(1);

    try {
      const data = await onSync();

      if (!data.success) {
        throw new Error(data.message || 'Failed to sync SnapFoodies');
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
          <DialogTitle>Sync SnapFoodies</DialogTitle>
          <DialogDescription>
            Fetch user data from SnapFood and update your local database.
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
                  {result.errors} SnapFoodies could not be synced
                </AlertDescription>
              </Alert>
            )}

            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Batch Processing</AlertTitle>
              <AlertDescription>
                This operation synchronized the latest 50 SnapFoodies in one batch. 
                For larger datasets, you may need to run the sync multiple times to 
                process all users. Each batch processes a new set of users.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              This will fetch SnapFoodies from the platform and update your local database.
              The sync processes users in batches of 50 at a time.
            </div>
            
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Syncing batch {batchCount}...</span>
                  <span className="text-muted-foreground">50 users per batch</span>
                </div>
                <ProgressBar value={65} className="h-2" />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {result ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => {
                setResult(null);
                setBatchCount(prev => prev + 1);
                handleSync();
              }}>
                Sync Next Batch
              </Button>
            </>
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