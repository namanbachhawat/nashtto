import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

export const Button = ({
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
  const buttonClassName = `flex-row items-center justify-center rounded-xl shadow-sm ${
    size === 'small' ? 'py-2 px-4 min-h-9 text-xs' : size === 'large' ? 'py-6 px-8 min-h-14 text-lg' : 'py-4 px-6 min-h-12 text-base'
  } ${
    variant === 'primary' ? 'bg-green-500 text-white' : variant === 'secondary' ? 'bg-slate-500 text-white' : variant === 'outline' ? 'bg-transparent border border-green-500 text-green-500' : 'bg-transparent text-green-500'
  } ${disabled || loading ? 'opacity-60' : ''} ${className || ''}`;

  const textClass = `font-semibold text-center ${
    variant === 'primary' ? 'text-white' : variant === 'secondary' ? 'text-white' : variant === 'outline' ? 'text-green-500' : 'text-green-500'
  } ${textClassName || ''}`;

  return (
    <TouchableOpacity
      className={buttonClassName}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#22c55e' : '#ffffff'} size="small" />
      ) : (
        <>
          {icon}
          <Text className={textClass}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
