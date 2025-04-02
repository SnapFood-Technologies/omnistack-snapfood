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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CopyIcon, CheckIcon, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useSnapFoodUsers } from "@/hooks/useSnapFoodUsers";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: {
    id: string;
    token: string;
  } | null;
  currentUser?: any; // Add the user prop to receive the current user
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  loginData,
  currentUser
}) => {
  const [copied, setCopied] = useState<{ id: boolean; token: boolean }>({
    id: false,
    token: false
  });
  
  // Only show choice when no login data is available yet
  const [showChoice, setShowChoice] = useState(!loginData);
  const [loginMethod, setLoginMethod] = useState<"email" | "snapfoodId">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get login function and the currently selected user
  const { loginAsUser, selectedUser } = useSnapFoodUsers();

  // No need to update hook's selectedUser - we'll use the currentUser or the hook's selectedUser

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
  
  // Handle login with the selected method
  const handleLogin = async () => {
    // Use either the currentUser passed as prop or selectedUser from the hook
    const userToLogin = currentUser || selectedUser;
    
    if (!userToLogin) {
      toast.error("No user selected");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create login payload based on selected method
      const loginPayload = loginMethod === "email"
        ? { email: userToLogin.email }
        : { external_ids: { snapFoodId: userToLogin.external_ids?.snapFoodId } };
        
      if ((loginMethod === "email" && !userToLogin.email) || 
          (loginMethod === "snapfoodId" && !userToLogin.external_ids?.snapFoodId)) {
        toast.error(`Selected user doesn't have ${loginMethod === "email" ? "an email" : "a SnapFood ID"}`);
        setIsSubmitting(false);
        return;
      }
      
      const result = await loginAsUser(loginPayload);
      
      if (result) {
        toast.success("Login successful");
        setShowChoice(false);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset state when modal is closed
  const handleDialogClose = () => {
    setLoginMethod("email");
    setShowChoice(!loginData);
    onClose();
  };

  // Determine which user to display information for
  const displayUser = currentUser || selectedUser;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>SnapFood Login</DialogTitle>
          <DialogDescription>
            {showChoice 
              ? "Choose login method" 
              : "Authentication data for this user"}
          </DialogDescription>
        </DialogHeader>
        
        {loginData && !showChoice ? (
          // Display login results
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
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowChoice(true)}>
                Try Different Method
              </Button>
            </div>
          </div>
        ) : (
          // Display login method choice
          <div className="space-y-4 py-2">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select Login Method</h3>
              <RadioGroup 
                value={loginMethod} 
                onValueChange={(value) => setLoginMethod(value as "email" | "snapfoodId")}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="login-email-option" />
                  <Label htmlFor="login-email-option">Login with Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="snapfoodId" id="login-snapfood-option" />
                  <Label htmlFor="login-snapfood-option">Login with SnapFood ID</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Display the method that will be used */}
            <div className="bg-muted p-3 rounded text-sm">
              <p className="font-medium">Using {loginMethod === "email" ? "Email" : "SnapFood ID"}:</p>
              <p className="mt-1 break-all">
                {displayUser ? (
                  loginMethod === "email" 
                    ? (displayUser.email || "No email available") 
                    : (displayUser.external_ids?.snapFoodId || "No SnapFood ID available")
                ) : (
                  "No user selected"
                )}
              </p>
            </div>
            
            <Button 
              onClick={handleLogin} 
              className="w-full mt-4" 
              disabled={isSubmitting || !displayUser || 
                        (loginMethod === "email" && !displayUser?.email) || 
                        (loginMethod === "snapfoodId" && !displayUser?.external_ids?.snapFoodId)}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login as User"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};