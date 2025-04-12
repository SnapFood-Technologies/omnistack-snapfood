"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSnapFoodBlogs } from "@/hooks/useSnapFoodBlogs";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number;
  onSuccess?: () => void;
}

export function SendNotificationModal({
  isOpen,
  onClose,
  blogId,
  onSuccess
}: SendNotificationModalProps) {
  const { toast } = useToast();
  const { sendNotification } = useSnapFoodBlogs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationTitleEn, setNotificationTitleEn] = useState("");
  const [targetUserId, setTargetUserId] = useState<string>("");
  
  const handleSubmit = async () => {
    if (!notificationTitle || !notificationTitleEn) {
      toast({
        title: "Error",
        description: "Please fill in both notification titles",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await sendNotification(blogId, {
        notification_title: notificationTitle,
        notification_title_en: notificationTitleEn,
        target_user_id: targetUserId ? parseInt(targetUserId) : undefined
      });
      
      if (result) {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNotificationTitle("");
    setNotificationTitleEn("");
    setTargetUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Send Notification</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Send a push notification for this blog post
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-title">Notification Title</Label>
            <Input
              id="notification-title"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Enter notification title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-title-en">Notification Title (English)</Label>
            <Input
              id="notification-title-en"
              value={notificationTitleEn}
              onChange={(e) => setNotificationTitleEn(e.target.value)}
              placeholder="Enter notification title (English)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-user-id">Target User ID (Optional)</Label>
            <Input
              id="target-user-id"
              type="number"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Leave empty to send to all users"
            />
            <p className="text-xs text-muted-foreground">
              If provided, notification will only be sent to this specific user
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!notificationTitle || !notificationTitleEn || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}