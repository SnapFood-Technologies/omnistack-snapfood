// components/admin/snapfoodies/LoginModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: {
    id: string;
    token: string;
  } | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  loginData 
}) => {
  const [copied, setCopied] = useState<{ id: boolean; token: boolean }>({
    id: false,
    token: false
  });

  const handleCopy = (text: string, field: 'id' | 'token') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(prev => ({ ...prev, [field]: true }));
        toast.success(`${field === 'id' ? 'ID' : 'Token'} copied to clipboard`);
        
        setTimeout(() => {
          setCopied(prev => ({ ...prev, [field]: false }));
        }, 2000);
      })
      .catch(error => {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>SnapFood Login Details</DialogTitle>
          <DialogDescription>
            Authentication data for this user
          </DialogDescription>
        </DialogHeader>
        
        {loginData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">User ID</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(loginData.id, 'id')}
                  className="h-8 w-8 p-0"
                >
                  {copied.id ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-secondary p-2 text-white rounded text-xs break-all">
                {loginData.id}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Auth Token</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(loginData.token, 'token')}
                  className="h-8 w-8 p-0"
                >
                  {copied.token ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-secondary text-white p-2 rounded text-xs break-all">
                {loginData.token}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No login data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};