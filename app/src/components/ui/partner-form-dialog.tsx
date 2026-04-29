import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { CheckCircle2 } from 'lucide-react';

interface PartnerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  companyName: string;
  shopName: string;
  innKpp: string;
  phone: string;
  email: string;
}

export function PartnerFormDialog({ isOpen, onClose }: PartnerFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    shopName: '',
    innKpp: '',
    phone: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate API call
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        companyName: '',
        shopName: '',
        innKpp: '',
        phone: '',
        email: '',
      });
    }, 2000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-kisu-text-dark">
            Стать партнёром
          </DialogTitle>
          <DialogDescription className="text-kisu-text-gray">
            Заполните форму ниже, и мы свяжемся с вами в ближайшее время
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-kisu-text-dark mb-2">
              Заявка отправлена!
            </h3>
            <p className="text-kisu-text-gray">
              Мы свяжемся с вами в ближайшее время
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="companyName" className="text-kisu-text-dark">
                Полное наименование компании
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="ООО Компания"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="shopName" className="text-kisu-text-dark">
                Название магазина
              </Label>
              <Input
                id="shopName"
                value={formData.shopName}
                onChange={(e) => handleChange('shopName', e.target.value)}
                placeholder="Магазин детской одежды"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="innKpp" className="text-kisu-text-dark">
                ИНН/КПП
              </Label>
              <Input
                id="innKpp"
                value={formData.innKpp}
                onChange={(e) => handleChange('innKpp', e.target.value)}
                placeholder="7701234567 / 770101001"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-kisu-text-dark">
                Телефон <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+7 (999) 999-99-99"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-kisu-text-dark">
                Электронная почта <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium py-3 rounded-full transition-all duration-300 hover:shadow-kisu"
            >
              Отправить заявку
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
