import { Text, TextInput, View } from 'react-native';

export const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  style,
  className,
  ...props
}) => {
  return (
    <View className="mb-4">
      <TextInput
        className={`bg-white border rounded-xl py-4 px-4 text-base text-slate-800 ${error ? 'border-red-500' : 'border-slate-200'
          } ${className || ''}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={style}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
};