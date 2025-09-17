
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ContactForm from "./ContactForm";

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactFormDialog = ({ open, onOpenChange }: ContactFormDialogProps) => {
  const handleSuccess = () => {
    // Close the dialog after successful submission (with a small delay for better UX)
    setTimeout(() => onOpenChange(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Learn more about AgriFact Hub</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll provide you with more information about our services.
          </DialogDescription>
        </DialogHeader>
        <ContactForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
