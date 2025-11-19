```javascript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { styled } from 'nativewind';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  icon?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className,
  textClassName,
  icon,
}) => {
  const baseButtonClass = "flex-row items-center justify-center rounded-xl shadow-sm elevation-2";
  
  const sizeClasses = {
    small: "py-2 px-4 min-h-[36px]",
    medium: "py-4 px-6 min-h-[48px]",
    large: "py-6 px-8 min-h-[56px]",
  };

  const variantClasses = {
    primary: "bg-green-500",
    secondary: "bg-slate-500",
    outline: "bg-transparent border border-green-500",
    ghost: "bg-transparent",
  };

  const disabledClass = (disabled || loading) ? "opacity-60" : "";

  const buttonClass = `${ baseButtonClass } ${ sizeClasses[size] } ${ variantClasses[variant] } ${ disabledClass } ${ className || '' } `;

  const baseTextClass = "font-semibold text-center";
  
  const textSizeClasses = {
    small: "text-xs",
    medium: "text-base",
    large: "text-lg",
  };

  const textVariantClasses = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-green-500",
    ghost: "text-green-500",
  };

  const textClass = `${ baseTextClass } ${ textSizeClasses[size] } ${ textVariantClasses[variant] } ${ textClassName || '' } `;

  const getIconColor = () => {
    if (variant === 'outline' || variant === 'ghost') return '#22c55e';
    return '#ffffff';
  };

  return (
    <TouchableOpacity
      className={buttonClass}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text className={textClass}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
```