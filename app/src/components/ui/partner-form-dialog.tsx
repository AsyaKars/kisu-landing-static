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
        {isSubmitted ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <img src="/images/logo.svg" alt="KISU" className="h-10 w-auto object-contain" />
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kisu-orange/10 border-2 border-kisu-orange/25">
              <CheckCircle2 className="w-10 h-10 text-kisu-orange" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-kisu-text-dark">
              Спасибо за заявку!
            </h3>
            <p className="text-kisu-text-gray text-base leading-relaxed max-w-xs">
              Мы очень рады, что вы выбрали <span className="text-kisu-orange font-semibold">KISU</span>!
              Наш менеджер свяжется с вами в ближайшее рабочее время и с удовольствием ответит на все вопросы.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-kisu-orange hover:bg-kisu-orange-dark text-white font-medium px-10 py-2.5 rounded-full transition-all duration-300"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-bold text-kisu-text-dark">
              Стать партнёром
            </DialogTitle>
            <DialogDescription className="text-kisu-text-gray">
              Заполните форму ниже, и мы свяжемся с вами в ближайшее время
            </DialogDescription>
          </DialogHeader>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
