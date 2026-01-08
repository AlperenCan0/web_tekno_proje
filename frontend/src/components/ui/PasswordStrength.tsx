import React from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthProps {
  password: string;
}

/**
 * PasswordStrength Component - Şifre gücü göstergesi
 * Real-time şifre gücü analizi ve görsel feedback sağlar
 */
const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  const checks = [
    {
      label: 'En az 6 karakter',
      test: password.length >= 6,
    },
    {
      label: 'En az 8 karakter (önerilen)',
      test: password.length >= 8,
    },
    {
      label: 'Büyük harf içeriyor',
      test: /[A-Z]/.test(password),
    },
    {
      label: 'Küçük harf içeriyor',
      test: /[a-z]/.test(password),
    },
    {
      label: 'Rakam içeriyor',
      test: /\d/.test(password),
    },
    {
      label: 'Özel karakter içeriyor',
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const passedChecks = checks.filter((check) => check.test).length;
  const strength = passedChecks <= 2 ? 'weak' : passedChecks <= 4 ? 'medium' : 'strong';

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthTexts = {
    weak: 'Zayıf',
    medium: 'Orta',
    strong: 'Güçlü',
  };

  return (
    <div className="mt-2 space-y-2 bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-amber-900">Şifre Gücü:</span>
        <span className={`text-xs font-semibold ${
          strength === 'weak' ? 'text-red-500' :
          strength === 'medium' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {strengthTexts[strength]}
        </span>
      </div>
      <div className="w-full bg-white/50 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
          style={{ width: `${(passedChecks / checks.length) * 100}%` }}
        />
      </div>
      <div className="space-y-1 mt-2">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-xs transition-colors ${
              check.test ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {check.test ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;

