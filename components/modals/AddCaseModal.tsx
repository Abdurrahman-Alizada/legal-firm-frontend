import EmployeeCard from "@/components/common/EmployeeCard";
import { colors, fonts, layout, spacing } from "@/constants";
import { useAuthStore } from "@/services/authStore";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddCaseModal = ({
  visible,
  onClose,
  selectedCase,
  setSelectedCase,
}: {
  visible: boolean;
  onClose: () => void;
  selectedCase?: Case | null ;
  setSelectedCase: any;
}) => {
  const [newCase, setNewCase] = useState({
    title: "",
    clientEmail: "",
    description: "",
    status: "pending" as "pending" | "active" | "closed",
    priority: "medium" as "low" | "medium" | "high",
    companyId: "",
    assignedEmployeeIds: [] as string[],
  });
  const { isLoading, updateCase, createCase, employees, getEmployees } =
    useCaseStore();
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const { isAuthenticated} = useAuthStore();
  useEffect(() => {
    if (visible) {
      setEmployeeLoading(true);
      getEmployees()
        .finally(() => setEmployeeLoading(false));
    }
  }, [visible]);

  useEffect(() => {
    if (visible && selectedCase) {
      setNewCase({
        title: selectedCase.title,
        clientEmail: selectedCase.clientName,
        description: selectedCase.description || "",
        status: selectedCase.status,
        priority: selectedCase.priority,
        companyId: selectedCase.companyId,
        assignedEmployeeIds: selectedCase.assignedEmployeeIds?selectedCase.assignedEmployeeIds:selectedCase.assignedEmployees?selectedCase.assignedEmployees.map(employee => employee._id):[],
      });
    } else {
      setNewCase({
        title: "",
        clientEmail: "",
        description: "",
        status: "pending",
        priority: "medium",
        companyId: "",
        assignedEmployeeIds: [],
      });
    }
  }, [visible, selectedCase]);

  const handleSubmit = async () => {
    if (!newCase.title) return;
    if (selectedCase) {
      await updateCase(selectedCase._id, newCase);
    } else {
      await createCase(newCase as any);
    }
    setNewCase({
      title: "",
      clientEmail: "",
      description: "",
      status: "pending",
      priority: "medium",
      companyId: "",
      assignedEmployeeIds: [],
    });
    setSelectedCase(null);
    onClose();
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setNewCase((prev) => ({
      ...prev,
      assignedEmployeeIds: [employeeId],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {selectedCase ? "Edit Case" : "New Case"}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} contentContainerStyle={{paddingBottom:spacing["3xl"]}}>
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

         {!selectedCase && <View style={styles.formGroup}>
            <Text style={styles.label}>Client Email *</Text>
            <TextInput
              style={styles.input}
              value={newCase.clientEmail}
              onChangeText={(text) =>
                setNewCase((prev) => ({ ...prev, clientEmail: text }))
              }
              placeholder="Enter client email"
              placeholderTextColor={colors.text.secondary}
            />
          </View>}

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
              numberOfLines={6}
            />
          </View>

          {/* Employee Selection Section */}
          {isAuthenticated==="admin" &&<View style={styles.formGroup}>
            <Text style={[styles.label, { marginBottom: 12 }]}>
              Assign Employee
            </Text>
            {employeeLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading employees...</Text>
              </View>
            ) : employees.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No employees found.</Text>
                <Text style={styles.emptySubtext}>
                  Add employees to assign them to cases.
                </Text>
              </View>
            ) : (
              <View style={styles.employeeSelectionContainer}>
                {employees.map((emp) => (
                  <TouchableOpacity
                    key={emp._id}
                    style={[
                      styles.employeeSelectionCard,
                      newCase.assignedEmployeeIds[0] === emp._id &&
                        styles.selectedEmployeeCard,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleEmployeeSelect(emp._id)}
                  >
                    <EmployeeCard employee={emp} />
                    {newCase.assignedEmployeeIds[0] === emp._id && (
                      <View style={styles.selectionIndicator}>
                        <Text style={styles.selectionIndicatorText}>✓ Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              {["pending", "active", "closed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerOption,
                    newCase.status === status && styles.selectedPickerOption,
                  ]}
                  onPress={() =>
                    setNewCase((prev) => ({ ...prev, status: status as any }))
                  }
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newCase.status === status && styles.selectedPickerOptionText,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerContainer}>
              {["low", "medium", "high"].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.pickerOption,
                    newCase.priority === priority && styles.selectedPickerOption,
                  ]}
                  onPress={() =>
                    setNewCase((prev) => ({ ...prev, priority: priority as any }))
                  }
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newCase.priority === priority && styles.selectedPickerOptionText,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCaseModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeButtonText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.md,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.secondary,
  },
  saveButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.white,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
  employeeSelectionContainer: {
    gap: spacing.sm,
  },
  employeeSelectionCard: {
    borderRadius: layout.borderRadius.md,
    overflow: "hidden",
  },
  selectedEmployeeCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectionIndicator: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  selectionIndicatorText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.white,
  },
  pickerContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
  },
  selectedPickerOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  selectedPickerOptionText: {
    color: colors.text.white,
    fontWeight: fonts.weights.medium,
  },
});
