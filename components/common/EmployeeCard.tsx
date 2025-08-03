import { colors, fonts, layout, spacing } from "@/constants";
import { SecretaryRole, paralegalRole } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Employee {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  isPending: boolean;
  createdAt: string;
  isCompanyOwner: boolean;
}

interface EmployeeCardProps {
  employee: Employee;
  onPress?: () => void;
  showActions?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onPress,
  showActions = false,
}) => {
  const getRoleName = (roleId: string) => {
    if (roleId === SecretaryRole._id) return SecretaryRole.name;
    if (roleId === paralegalRole._id) return paralegalRole.name;
    return "Unknown Role";
  };

  const getRoleColor = (roleId: string) => {
    if (roleId === SecretaryRole._id) return "#8B5CF6";
    if (roleId === paralegalRole._id) return "#06B6D4";
    return "#6B7280";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CardContent = () => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {employee.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeEmail}>{employee.email}</Text>
        </View>
        <View style={styles.statusContainer}>
          {employee.isPending ? (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={12} color="#F59E0B" />
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          ) : (
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.employeeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Role:</Text>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: getRoleColor(employee.roleId) + "20" },
            ]}
          >
            <Text
              style={[
                styles.roleText,
                { color: getRoleColor(employee.roleId) },
              ]}
            >
              {getRoleName(employee.roleId)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Joined:</Text>
          <Text style={styles.detailValue}>
            {formatDate(employee.createdAt)}
          </Text>
        </View>

        {employee.isCompanyOwner && (
          <View style={styles.detailRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.detailLabel}>Company Owner</Text>
          </View>
        )}
      </View>

      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

export default EmployeeCard;

const styles = StyleSheet.create({
  employeeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  employeeEmail: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
    gap: spacing.xs,
  },
  pendingText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: "#F59E0B",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
    gap: spacing.xs,
  },
  activeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: "#10B981",
  },
  employeeDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    minWidth: 60,
  },
  detailValue: {
    fontSize: fonts.sizes.sm,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  roleText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.sm,
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
}); 