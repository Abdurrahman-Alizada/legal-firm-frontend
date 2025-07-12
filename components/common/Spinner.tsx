import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

const Spinner = ({ visible = false}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // dark transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
});

export default Spinner;