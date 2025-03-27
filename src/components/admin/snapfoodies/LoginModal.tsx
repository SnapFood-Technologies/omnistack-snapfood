// components/admin/snapfoodies/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    userId: string;
    token: string;
  } | null;
}

export function LoginModal({ isOpen, onClose, userData }: LoginModalProps) {
  const [copied, setCopied] = useState<{ userId: boolean; token: boolean }>({
    userId: false,
    token: false
  });

  const handleCopy = (text: string, field: 'userId' | 'token') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied({ ...copied, [field]: true });
        toast.success(`${field === 'userId' ? 'User ID' : 'Token'} copied to clipboard`);
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied({ ...copied, [field]: false });
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Authentication Data</DialogTitle>
          <DialogDescription>
            Authentication details for impersonating this user
          </DialogDescription>
        </DialogHeader>
        
        {userData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">User ID</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(userData.userId, 'userId')}
                  className="h-8 w-8 p-0"
                >
                  {copied.userId ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
              <div className="bg-muted p-2 rounded text-xs break-all">
                {userData.userId}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Auth Token</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(userData.token, 'token')}
                  className="h-8 w-8 p-0"
                >
                  {copied.token ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
              <div className="bg-muted p-2 rounded text-xs break-all">
                {userData.token}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No authentication data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}