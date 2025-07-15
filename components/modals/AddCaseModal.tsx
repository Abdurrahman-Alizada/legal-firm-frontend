import { colors, fonts, layout, spacing } from "@/constants";
import { Case, useCaseStore } from "@/services/caseStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddCaseModal = ({
  visible,
  onClose,
  selectedCase,
  setSelectedCase
}: {
  visible: boolean;
  onClose: () => void;
  selectedCase?: Case | null;
  setSelectedCase:any
}) => {
  const [newCase, setNewCase] = useState({
          title: "",
          clientName: "",
          description: "",
          status: "pending" as "pending" | "active" | "closed",
          priority: "medium" as "low" | "medium" | "high",
          clientId: "",
          companyId: "",
        });
  const { isLoading, updateCase, createCase } = useCaseStore();

  useEffect(() => {
    if(visible && selectedCase){
        setNewCase({
            title: selectedCase.title,
            clientName: selectedCase.clientName,
            description: selectedCase.description || "",
            status: selectedCase.status,
            priority: selectedCase.priority,
            clientId: selectedCase.companyId,
            companyId: selectedCase.companyId,
          })
    }else{
        setNewCase({
            title: "",
            clientName: "",
            description: "",
            status: "pending",
            priority: "medium",
            clientId: "",
            companyId: "",
          })
    }
  }, [visible,selectedCase])
  

  const handleSubmit = async () => {
    if (!newCase.title || !newCase.clientName) return;
    if (selectedCase) {
      await updateCase(selectedCase._id, newCase);
    } else {
      await createCase(newCase);
    }
    setNewCase({
      title: "",
      clientName: "",
      description: "",
      status: "pending",
      priority: "medium",
      clientId: "",
      companyId: "",
    });
    setSelectedCase(null)
    onClose();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedCase ? "Edit Case" : "New Case"}
          </Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!newCase.title || !newCase.clientName}
            >
              <Text
                style={[
                  styles.saveText,
                  (!newCase.title || !newCase.clientName) &&
                    styles.disabledText,
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Case Title *</Text>
            <TextInput
              style={styles.input}
              value={newCase.title}
              onChangeText={(text) =>
                setNewCase((prev) => ({ ...prev, title: text }))
              }
              placeholder="Enter case title"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              value={newCase.clientName}
              onChangeText={(text) =>
                setNewCase((prev) => ({ ...prev, clientName: text }))
              }
              placeholder="Enter client name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newCase.description}
              onChangeText={(text) =>
                setNewCase((prev) => ({ ...prev, description: text }))
              }
              placeholder="Enter case description"
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                {(["pending", "active", "closed"] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      newCase.status === status && styles.selectedPickerOption,
                    ]}
                    //@ts-ignore
                    onPress={() => setNewCase((prev) => ({ ...prev, status }))}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        newCase.status === status &&
                          styles.selectedPickerOptionText,
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.pickerContainer}>
                {(["low", "medium", "high"] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerOption,
                      newCase.priority === priority &&
                        styles.selectedPickerOption,
                    ]}
                    //@ts-ignore
                    onPress={() =>
                      setNewCase((prev) => ({ ...prev, priority }))
                    }
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        newCase.priority === priority &&
                          styles.selectedPickerOptionText,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCaseModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  cancelText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
  },
  saveText: {
    fontSize: fonts.sizes.base,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  disabledText: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formRow: {
    gap: spacing.md,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  pickerOption: {
    flex: 1,
    padding: spacing.md,
    alignItems: "center",
  },
  selectedPickerOption: {
    backgroundColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.primary,
  },
  selectedPickerOptionText: {
    color: colors.text.white,
    fontWeight: fonts.weights.medium,
  },
});
