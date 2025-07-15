import { Button } from "@/components/common/Button";
import CaseCard from "@/components/common/CaseCard";
import AddCaseModal from "@/components/modals/AddCaseModal";
import { TabHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants";
import { Case, useCaseStore } from "@/services/caseStore";
import { Plus, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CasesScreen() {
  const {
    cases,
    isLoading,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
    uploadDocument,
  } = useCaseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "closed"
  >("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState<Case | null>(
    null
  );
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter((case_) => {
    const matchesSearch = case_.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || case_.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <TabHeader
        title="Cases"
        onRight={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color={colors.text.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cases..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.secondary}
          />
        </View>
      </View>

      <View style={styles.filterTabs}>
        {(["all", "active", "pending", "closed"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              filterStatus === status && styles.activeFilterTab,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterTabText,
                filterStatus === status && styles.activeFilterTabText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={isLoading}
            onRefresh={fetchCases}
          />
        }
      >
        {filteredCases.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No cases found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first case to get started"}
            </Text>
            <Button
              title="Create Case"
              onPress={() => setShowAddModal(true)}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.casesList}>
            {filteredCases.map((case_) => (
              <CaseCard
                key={case_._id}
                case_={case_}
                menuOpen={selectedCase?._id === case_._id}
                onMenu={setSelectedCase}
                onEdit={() => {
                  setShowAddModal(true);
                  setSelectedCaseForEdit(case_);
                }}
                onCloseMenu={() => setSelectedCase(null)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Case Modal */}
      <View style={{ flex: 1 }}>
        <AddCaseModal
          visible={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedCaseForEdit(null);
          }}
          selectedCase={selectedCaseForEdit}
          setSelectedCase={setSelectedCaseForEdit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...layout.shadow.sm,
  },
  searchContainer: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
  },
  filterButton: {
    backgroundColor: colors.background.primary,
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.background.primary,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    fontWeight: fonts.weights.medium,
  },
  activeFilterTabText: {
    color: colors.text.white,
  },
  content: {
    flex: 1,
  },
  casesList: {
    padding: spacing.md,
  },
  caseCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...layout.shadow.sm,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  caseHeaderLeft: {
    flex: 1,
  },
  caseTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  caseClient: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  moreButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  caseDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  caseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caseStats: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  caseStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  caseStatText: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  caseBadges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  statusactive: {
    backgroundColor: colors.success + "20",
  },
  statuspending: {
    backgroundColor: colors.warning + "20",
  },
  statusclosed: {
    backgroundColor: colors.text.secondary + "20",
  },
  priorityhigh: {
    backgroundColor: colors.error + "20",
  },
  prioritymedium: {
    backgroundColor: colors.warning + "20",
  },
  prioritylow: {
    backgroundColor: colors.success + "20",
  },
  badgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    textTransform: "capitalize",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
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
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModal: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    alignItems: "stretch",
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
  },
  confirmModal: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 24,
    minWidth: 250,
    alignItems: "center",
    elevation: 4,
  },
  confirmText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  addDocModal: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 24,
    minWidth: 250,
    alignItems: "stretch",
    elevation: 4,
  },
});
