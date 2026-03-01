import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Send, MessageCircle, Twitter } from 'lucide-react';
import { useTranslation } from '@/lib/i18n.jsx';

const ShareModal = ({ isOpen, setIsOpen, toolTitle, toolUrl }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const shareText = `¡Echa un vistazo a esta increíble herramienta: ${toolTitle}!`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-6 h-6" />,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + toolUrl)}`,
      className: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Telegram",
      icon: <Send className="w-6 h-6" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(shareText)}`,
      className: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-6 h-6" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(shareText)}`,
      className: "bg-blue-400 hover:bg-blue-500",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(toolUrl);
    toast({
      title: t('shareModal.linkCopied'),
      description: t('shareModal.linkCopiedDescription'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-4 border-red-500 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-700">{t('shareModal.title')}</DialogTitle>
          <DialogDescription>
            {t('shareModal.description', { toolTitle })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-3">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                asChild
                className={`w-full text-white font-bold py-6 text-lg ${option.className} transition-transform transform hover:scale-105`}
              >
                <a href={option.url} target="_blank" rel="noopener noreferrer">
                  {option.icon}
                  <span className="ml-3">{t('shareModal.shareOn', { platform: option.name })}</span>
                </a>
              </Button>
            ))}
          </div>
          <div className="relative flex items-center mt-4">
            <Input id="link" defaultValue={toolUrl} readOnly className="pr-12 h-12 text-base" />
            <Button type="button" size="icon" className="absolute right-2 h-9 w-9 bg-red-600 hover:bg-red-700" onClick={copyToClipboard}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;