import { colors, spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownInputProps {
  label?: string;
  data: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  value?: string | number;
  placeholder?: string;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  iconColor?: string;
  modalBackgroundColor?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  data,
  onSelect,
  value,
  placeholder = 'Select an option',
  containerStyle,
  inputStyle,
  labelStyle,
  iconColor = '#333',
  modalBackgroundColor = '#fff',
}) => {
  const [visible, setVisible] = useState(false);
  const selectedItem = data.find(item => item.value === value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, inputStyle]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: selectedItem ? '#000' : '#999' }}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={iconColor} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay]}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item,item.value==selectedItem?.value&&{backgroundColor:colors.background.secondary}]}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownInput;

const styles = StyleSheet.create({
  container: {
    marginBottom:spacing.md
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    maxHeight: '50%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius:5
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
});
