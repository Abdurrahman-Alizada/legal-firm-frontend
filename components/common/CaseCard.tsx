import { colors, fonts } from "@/constants";
import { Case, useCaseStore } from "@/services/caseStore";
import { router } from "expo-router";
import {
  Clock,
  Edit,
  Ellipsis,
  FileText,
  Trash2
} from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CaseCardProps {
  case_: Case;
  onMenu: (case_: Case) => void;
  menuOpen: boolean;
  onEdit: () => void;
  onCloseMenu: () => void;
}

const CaseCard = ({
  case_,
  onMenu,
  menuOpen,
  onEdit,
  onCloseMenu,
}: CaseCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteCase } = useCaseStore();

  return (
    <>
    <TouchableOpacity key={case_._id} onPress={()=>router.push(`/cases/${case_._id}`)} style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseHeaderLeft}>
          <Text style={styles.caseTitle} numberOfLines={1}>
            {case_.title}
          </Text>
          <Text style={styles.caseClient}>{case_.clientName}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onMenu(case_)}
        >
          <Ellipsis size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
      {case_.description && (
        <Text style={styles.caseDescription} numberOfLines={2}>
          {case_.description}
        </Text>
      )}
      <View style={styles.caseFooter}>
        <View style={styles.caseStats}>
          <View style={styles.caseStat}>
            <FileText size={14} color={colors.text.secondary} />
            <Text style={styles.caseStatText}>
              {case_.documents?.length || 0} docs
            </Text>
          </View>
          <View style={styles.caseStat}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.caseStatText}>
              {new Date(case_.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.caseBadges}>
          <View style={[styles.statusBadge, styles[`status${case_.status}`]]}>
            <Text style={styles.badgeText}>{case_.status}</Text>
          </View>
          <View
            style={[styles.priorityBadge, styles[`priority${case_.priority}`]]}
          >
            <Text style={styles.badgeText}>{case_.priority}</Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>

      {menuOpen && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          statusBarTranslucent
          presentationStyle="overFullScreen"
          onRequestClose={() => {
            onCloseMenu();
            setShowDeleteConfirm(false);
          }}
        >
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => {
                onCloseMenu();
                setShowDeleteConfirm(false);
              }}
          >
            {showDeleteConfirm ? (
              <View style={styles.confirmModal}>
                <Trash2 color={colors.text.primary} size={45} />
                <Text style={styles.confirmText}>
                  Are you sure you want to delete this case?
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => {
                      onCloseMenu();
                      setShowDeleteConfirm(false);
                    }}
                  >
                    <Text style={styles.cancelText}>No, Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      await deleteCase(case_._id).then(() => {
                        onCloseMenu();
                        setShowDeleteConfirm(false);
                      });
                    }}
                  >
                    <Text style={[styles.saveText, { color: colors.error }]}>
                      Yes, I'm sure
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.menuModal}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onCloseMenu();
                    onEdit();
                  }}
                >
                  <Edit size={fonts.sizes.lg} />
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash2 size={fonts.sizes.lg} color={colors.error} />
                  <Text style={[styles.menuText, { color: colors.error }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      )}</>
  );
};

export default CaseCard;

const styles = StyleSheet.create({
  caseCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  caseHeaderLeft: {
    flex: 1,
  },
  caseTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  caseClient: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  caseDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  caseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caseStats: {
    flexDirection: "row",
    gap: 16,
  },
  caseStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  caseStatText: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  caseBadges: {
    flexDirection: "row",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    marginVertical: 16,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  cancelText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginRight: 16,
  },
  saveText: {
    fontSize: fonts.sizes.base,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
});
