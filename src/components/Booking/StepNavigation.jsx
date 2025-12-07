import React from 'react';
import { ChevronRight } from 'lucide-react';

const Button = ({ children, className = '', variant = 'default', onClick, disabled, ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-bold flex items-center justify-center transition-all';
  const styles = variant === 'outline'
    ? 'border-2 bg-white hover:bg-gray-50 text-black'
    : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white';
  return <button className={`${base} ${styles} ${className}`} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
};

const StepNavigation = ({ step, loading, handleNext, setStep }) => {
  return (
    <div className="flex justify-between">
      {step > 1 && step < 4 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>}
      {step < 4 && (
        <Button onClick={handleNext} disabled={loading} className="ml-auto">
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;