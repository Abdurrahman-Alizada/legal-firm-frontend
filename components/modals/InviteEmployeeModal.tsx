import { colors, fonts, layout, spacing } from "@/constants";
import { SecretaryRole, paralegalRole } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InviteEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; roleId: string }) => void;
  loading: boolean;
}

const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    roleId: "",
  });

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { id: SecretaryRole._id, name: SecretaryRole.name, description: "Manage documents and administrative tasks" },
    { id: paralegalRole._id, name: paralegalRole.name, description: "Assist with legal research and case preparation" },
  ];

  useEffect(() => {
    if (!visible) {
      setFormData({ name: "", email: "", roleId: "" });
      setErrors({ name: "", email: "", roleId: "" });
      setShowRoleDropdown(false);
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      roleId: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Please select a role";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const selectedRole = roles.find((role) => role.id === formData.roleId);

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
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Invite Employee</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Send an invitation to join your law firm. The employee will receive an email with instructions to set up their account.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Employee Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Enter employee's full name"
                placeholderTextColor={colors.text.secondary}
                autoCapitalize="words"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="Enter employee's email address"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role *</Text>
              <TouchableOpacity
                style={[styles.roleSelector, errors.roleId && styles.inputError]}
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <View style={styles.roleSelectorContent}>
                  {selectedRole ? (
                    <View style={styles.selectedRole}>
                      <Text style={styles.selectedRoleName}>{selectedRole.name}</Text>
                      <Text style={styles.selectedRoleDescription}>{selectedRole.description}</Text>
                    </View>
                  ) : (
                    <Text style={styles.rolePlaceholder}>Select a role</Text>
                  )}
                  <Ionicons
                    name={showRoleDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
              {errors.roleId ? <Text style={styles.errorText}>{errors.roleId}</Text> : null}

              {showRoleDropdown && (
                <View style={styles.roleDropdown}>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.roleOption,
                        formData.roleId === role.id && styles.selectedRoleOption,
                      ]}
                      onPress={() => {
                        handleInputChange("roleId", role.id);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <View style={styles.roleOptionContent}>
                        <Text style={styles.roleOptionName}>{role.name}</Text>
                        <Text style={styles.roleOptionDescription}>{role.description}</Text>
                      </View>
                      {formData.roleId === role.id && (
                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.roleInfoSection}>
            <Text style={styles.roleInfoTitle}>Available Roles</Text>
            <View style={styles.roleInfoCards}>
              <View style={styles.roleInfoCard}>
                <View style={styles.roleInfoHeader}>
                  <Ionicons name="document-text" size={20} color="#8B5CF6" />
                  <Text style={styles.roleInfoName}>{SecretaryRole.name}</Text>
                </View>
                <Text style={styles.roleInfoDescription}>
                  Manage documents, handle administrative tasks, and coordinate with clients and legal teams.
                </Text>
              </View>

              <View style={styles.roleInfoCard}>
                <View style={styles.roleInfoHeader}>
                  <Ionicons name="search" size={20} color="#06B6D4" />
                  <Text style={styles.roleInfoName}>{paralegalRole.name}</Text>
                </View>
                <Text style={styles.roleInfoDescription}>
                  Assist with legal research, case preparation, and document drafting under attorney supervision.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="hourglass" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Sending Invitation...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Send Invitation</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default InviteEmployeeModal;

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
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.primary + "10",
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
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
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: fonts.sizes.xs,
    color: "#EF4444",
    marginTop: spacing.xs,
  },
  roleSelector: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  roleSelectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedRole: {
    flex: 1,
  },
  selectedRoleName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  selectedRoleDescription: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  rolePlaceholder: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
  },
  roleDropdown: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: "hidden",
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  selectedRoleOption: {
    backgroundColor: colors.primary + "10",
  },
  roleOptionContent: {
    flex: 1,
  },
  roleOptionName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  roleOptionDescription: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  roleInfoSection: {
    marginBottom: spacing.xl,
  },
  roleInfoTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  roleInfoCards: {
    gap: spacing.md,
  },
  roleInfoCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  roleInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  roleInfoName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  roleInfoDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: colors.text.secondary,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  submitButtonText: {
    color: colors.text.white,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
  },
}); 