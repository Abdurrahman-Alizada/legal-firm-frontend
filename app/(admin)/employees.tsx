import EmployeeCard from "@/components/common/EmployeeCard";
import InviteEmployeeModal from "@/components/modals/InviteEmployeeModal";
import { TabHeader } from "@/components/ui/Headers";
import { EmployeesSkeleton } from "@/components/ui/Skeletons";
import { colors, fonts, layout, spacing } from "@/constants";
import { authService } from "@/services/api/authService";
import { caseService } from "@/services/api/caseService";
import { useAuthStore } from "@/services/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

interface Employee {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  isPending: boolean;
  createdAt: string;
  isCompanyOwner: boolean;
}

const EmployeesScreen = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await caseService.getEmployees();
      setEmployees(response.data || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to load employees",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const handleInviteEmployee = async (data: {
    name: string;
    email: string;
    roleId: string;
  }) => {
    try {
      setInviteLoading(true);
      await authService.sendInviteToCompany(data);
      setModalVisible(false);
      fetchEmployees();
      Toast.show({
        type: "success",
        text1: "Invitation sent successfully!",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Failed to send invitation",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return <EmployeesSkeleton />;
  }

  return (
    <View style={styles.container}>
      <TabHeader
        title="Employees"
        onRight={
          isAuthenticated === "admin" && (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="person-add" size={20} color="#fff" />
              <Text style={styles.inviteButtonText}>Invite</Text>
            </TouchableOpacity>
          )
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {employees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Employees Yet</Text>
            <Text style={styles.emptySubtitle}>
              {isAuthenticated === "admin"
                ? "Start building your team by inviting employees"
                : "No employees have been added to the company yet"}
            </Text>
            {isAuthenticated === "admin" && (
              <TouchableOpacity
                style={styles.emptyInviteButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.emptyInviteButtonText}>
                  Invite First Employee
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{employees.length}</Text>
                <Text style={styles.statLabel}>Total Employees</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.statNumber}>
                  {employees.filter((emp) => !emp.isPending).length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="time" size={24} color="#F59E0B" />
                <Text style={styles.statNumber}>
                  {employees.filter((emp) => emp.isPending).length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            <View style={styles.employeesList}>
              {employees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <InviteEmployeeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleInviteEmployee}
        loading={inviteLoading}
      />
    </View>
  );
};

export default EmployeesScreen;

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
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.md,
    gap: spacing.xs,
  },
  inviteButtonText: {
    color: colors.text.white,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyInviteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.md,
    gap: spacing.sm,
  },
  emptyInviteButtonText: {
    color: colors.text.white,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  employeesList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap:spacing.md
  },
});
