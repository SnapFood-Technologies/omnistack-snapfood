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
import { Input } from "@/components/ui/input";

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
  onSync: (batchPage?: number, batchSize?: number) => Promise<any>;
  onSuccess?: () => void;
}

export function SyncModal({ isOpen, onClose, onSync, onSuccess }: SyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchPage, setBatchPage] = useState(1);
  const [batchInput, setBatchInput] = useState("1");
  const BATCH_SIZE = 200;

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      // Use the batch page from input
      const pageNum = parseInt(batchInput, 10) || 1;
      setBatchPage(pageNum);
      
      console.log(`Syncing batch page ${pageNum} with size ${BATCH_SIZE}`);
      const data = await onSync(pageNum, BATCH_SIZE);

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
    setBatchPage(1);
    setBatchInput("1");
    onClose();
  };

  const handleNextBatch = () => {
    const nextPage = batchPage + 1;
    setBatchPage(nextPage);
    setBatchInput(nextPage.toString());
    setResult(null);
    setError(null);
    setIsSyncing(true);
    
    onSync(nextPage, BATCH_SIZE)
      .then(data => {
        if (!data.success) {
          throw new Error(data.message || 'Failed to sync SnapFoodies');
        }
        setResult(data);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(err => {
        console.error('Next batch sync error:', err);
        setError(err.message || 'An unexpected error occurred');
      })
      .finally(() => {
        setIsSyncing(false);
      });
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
              <AlertTitle>Batch Processing - Page {batchPage}</AlertTitle>
              <AlertDescription>
                This operation synchronized up to {BATCH_SIZE} SnapFoodies in batch #{batchPage}. 
                For larger datasets, you can continue with the next batch or choose a specific batch.
              </AlertDescription>
            </Alert>

            {/* Batch selection for next sync */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Batch number"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              This will fetch SnapFoodies from the platform and update your local database.
              The sync processes users in batches of {BATCH_SIZE} at a time.
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="1"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Starting batch number"
                />
              </div>
            </div>
            
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Syncing batch #{batchPage}...</span>
                  <span className="text-muted-foreground">{BATCH_SIZE} users per batch</span>
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                  {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sync Selected Batch
                </Button>
                <Button onClick={handleNextBatch} disabled={isSyncing}>
                  {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Next Batch
                </Button>
              </div>
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