import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});
