import AddCaseModal from "@/components/modals/AddCaseModal";
import AddDocumentModal from "@/components/modals/AddDocumentModal";
import { ScreenHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants";
import { useCaseStore } from "@/services/caseStore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const CaseDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, fetchCaseById, selectedCase, cases, selectCase, uploadDocument } =
    useCaseStore();
  const [activeTab, setActiveTab] = useState("details");
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    selectCase(cases.find((item) => item._id === id) || null);
  }, [id, !showAddModal]);

  const handleDocumentUpload = async (documents: any[], description: string) => {
    if (!selectedCase) return;
    
    try {
      for (const doc of documents) {
        const formData = new FormData();
        formData.append('file', {
          uri: doc.uri,
          name: doc.name,
          type: doc.type,
        } as any);
        formData.append('description', description);
        formData.append('caseId', selectedCase._id);
        
        await uploadDocument(selectedCase._id, formData);
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleOpenDocument = async (doc: any) => {
    try {
      if (doc.type === "pdf") {
        // For PDFs, we'd typically download and open
        Alert.alert("Open Document", `Would you like to open ${doc.name}?`, [
          { text: "Cancel", style: "cancel" },
          { text: "Open", onPress: () => Linking.openURL(doc.url) },
        ]);
      } else if (doc.type === "image") {
        // For images, we can show a preview
        Alert.alert("View Image", `Would you like to view ${doc.name}?`, [
          { text: "Cancel", style: "cancel" },
          { text: "View", onPress: () => Linking.openURL(doc.url) },
        ]);
      }
    } catch (error) {
      console.error("Error opening document:", error);
      Alert.alert("Error", "Could not open the document");
    }
  };

  const handleCallClient = () => {
    Alert.alert("Contact Client", "Would you like to call the client?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL("tel:+1234567890") },
    ]);
  };

  const handleEmailClient = () => {
    Linking.openURL("mailto:client@example.com");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return colors.success;
      case "pending":
        return colors.warning;
      case "closed":
        return colors.text.secondary;
      default:
        return colors.primary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!selectedCase) {
    return (
      <View style={styles.centered}>
        <MaterialIcons
          name="error-outline"
          size={48}
          color={colors.text.secondary}
        />
        <Text style={styles.emptyText}>Case not found</Text>
        <Text style={styles.emptySubtext}>
          The requested case could not be loaded
        </Text>
      </View>
    );
  }

  // Merge mock documents with actual documents if needed
  //@ts-ignore
  const documents = selectedCase?.documents?.length > 0 ? selectedCase.documents : [];

  return (
    <View style={styles.container}>
      <ScreenHeader title={selectedCase.title} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {selectedCase.title || "Untitled Case"}
            </Text>
            <Text style={styles.clientName}>
              <Feather name="user" size={14} color={colors.text.secondary} />{" "}
              {selectedCase.clientName || "No client specified"}
            </Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(selectedCase.status) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(selectedCase.status) },
                  ]}
                >
                  {selectedCase.status || "Unknown status"}
                </Text>
              </View>
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor:
                      getPriorityColor(selectedCase.priority) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: getPriorityColor(selectedCase.priority) },
                  ]}
                >
                  {selectedCase.priority || "Unknown priority"}
                </Text>
              </View>
            </View>

            <View style={styles.datesRow}>
              <View style={styles.dateItem}>
                <Feather
                  name="calendar"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.dateText}>
                  Created:{" "}
                  {format(
                    new Date(selectedCase.createdAt || new Date()),
                    "MMM d, yyyy"
                  )}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Feather
                  name="refresh-cw"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.dateText}>
                  Updated:{" "}
                  {format(
                    new Date(selectedCase.updatedAt || new Date()),
                    "MMM d, yyyy"
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCallClient}
            >
              <Feather name="phone" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEmailClient}
            >
              <Feather name="mail" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Email</Text>
            </TouchableOpacity>
            <Link href={`/chats/${selectedCase._id}`} asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Feather
                  name="message-square"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "details" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("details")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "details" && styles.activeTabText,
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "documents" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("documents")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "documents" && styles.activeTabText,
              ]}
            >
              Documents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "timeline" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("timeline")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "timeline" && styles.activeTabText,
              ]}
            >
              Timeline
            </Text>
          </TouchableOpacity>
        </View>

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <View style={styles.tabContent}>
            {/* Description Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Description</Text>
                <TouchableOpacity
                  onPress={() => setExpandedDescription(!expandedDescription)}
                >
                  <Text style={styles.expandButton}>
                    {expandedDescription ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={styles.sectionText}
                numberOfLines={expandedDescription ? undefined : 3}
              >
                {selectedCase.description || (
                  <Text style={styles.placeholder}>
                    No description provided for this case.
                  </Text>
                )}
              </Text>
            </View>

            {/* Case Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Case Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Case ID</Text>
                  <Text style={styles.infoValue}>
                    {selectedCase._id || "N/A"}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Client ID</Text>
                  <Text style={styles.infoValue}>
                    {selectedCase.clientId || (
                      <Text style={styles.placeholder}>N/A</Text>
                    )}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Company</Text>
                  <Text style={styles.infoValue}>
                    {selectedCase.companyId || (
                      <Text style={styles.placeholder}>N/A</Text>
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* Assignee Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assigned To</Text>
              <View style={styles.assigneeCard}>
                <View style={styles.assigneeAvatar}>
                  <Feather name="user" size={24} color={colors.text.primary} />
                </View>
                <View style={styles.assigneeInfo}>
                  <Text style={styles.assigneeName}>John Doe</Text>
                  <Text style={styles.assigneeRole}>Case Manager</Text>
                </View>
                <TouchableOpacity style={styles.assigneeAction}>
                  <Feather
                    name="message-square"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Documents Tab Content */}
        {activeTab === "documents" && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Documents</Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => setShowUploadModal(true)}
                >
                  <Feather name="upload" size={16} color={colors.primary} />
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>

              {documents!.length > 0 ? (
                documents!.map((doc: any, idx: number) => (
                  <TouchableOpacity
                    key={doc._id || idx}
                    style={styles.documentCard}
                    onPress={() => handleOpenDocument(doc)}
                  >
                    <View style={styles.documentPreview}>
                      {doc.type === "image" ? (
                        <Image
                          source={{ uri: doc.thumbnail || doc.url }}
                          style={styles.documentImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.documentIcon}>
                          <Feather
                            name="file-text"
                            size={32}
                            color={colors.text.secondary}
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName} numberOfLines={1}>
                        {doc.name || `Document ${idx + 1}`}
                      </Text>
                      <Text style={styles.documentMeta}>
                        {doc.type.toUpperCase()} • {doc.size || "Unknown size"}{" "}
                        •{" "}
                        {format(
                          new Date(doc.createdAt || new Date()),
                          "MMM d, yyyy"
                        )}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.documentAction}>
                      <Feather
                        name="more-vertical"
                        size={20}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather
                    name="folder"
                    size={48}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.emptyStateText}>
                    No documents uploaded yet
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    Upload files, photos, or documents related to this case
                  </Text>
                  <TouchableOpacity 
                    style={styles.uploadButtonLarge}
                    onPress={() => setShowUploadModal(true)}
                  >
                    <Feather name="upload" size={20} color={colors.primary} />
                    <Text style={styles.uploadButtonLargeText}>
                      Upload Documents
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Timeline Tab Content */}
        {activeTab === "timeline" && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Case Timeline</Text>

              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>Today, 10:30 AM</Text>
                    <Text style={styles.timelineTitle}>Case Opened</Text>
                    <Text style={styles.timelineText}>
                      The case was created and assigned to you
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>Yesterday, 2:15 PM</Text>
                    <Text style={styles.timelineTitle}>Client Interview</Text>
                    <Text style={styles.timelineText}>
                      Conducted initial interview with the client
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>Jul 5, 2023</Text>
                    <Text style={styles.timelineTitle}>Documents Received</Text>
                    <Text style={styles.timelineText}>
                      Client submitted initial documents
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>Jun 28, 2023</Text>
                    <Text style={styles.timelineTitle}>Initial Contact</Text>
                    <Text style={styles.timelineText}>
                      First contact made with client
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Feather name="edit" size={24} color="white" />
      </TouchableOpacity>
      <AddCaseModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
        }}
        selectedCase={selectedCase}
        setSelectedCase={(value: any) => {}}
      />
      
      <AddDocumentModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleDocumentUpload}
        caseId={selectedCase?._id}
      />
    </View>
  );
};

export default CaseDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: "center",
    maxWidth: "80%",
  },
  headerContainer: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...layout.shadow.sm,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  clientName: {
    fontSize: fonts.sizes.lg,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
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
  statusText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    textTransform: "capitalize",
  },
  priorityText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    textTransform: "capitalize",
  },
  datesRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dateText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  actionButton: {
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.background.secondary,
    flex: 1,
    marginHorizontal: spacing.sm,
    ...layout.shadow.sm,
  },
  actionButtonText: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.sm,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.sm,
  },
  tabButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.background.primary,
    ...layout.shadow.sm,
  },
  tabText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    fontWeight: fonts.weights.medium,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  section: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...layout.shadow.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom:spacing.sm
  },
  expandButton: {
    color: colors.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  sectionText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    lineHeight: 24,
  },
  placeholder: {
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.sm,
  },
  infoItem: {
    width: "50%",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  assigneeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    ...layout.shadow.sm,
  },
  assigneeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  assigneeInfo: {
    flex: 1,
  },
  assigneeName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  assigneeRole: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  assigneeAction: {
    padding: spacing.sm,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.primary + "10",
    gap: spacing.xs,
  },
  uploadButtonText: {
    color: colors.primary,
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...layout.shadow.sm,
  },
  documentPreview: {
    width: 48,
    height: 48,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  documentImage: {
    width: "100%",
    height: "100%",
  },
  documentIcon: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  documentMeta: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  documentAction: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: "center",
    maxWidth: "80%",
    marginBottom: spacing.lg,
  },
  uploadButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.primary + "10",
    gap: spacing.sm,
  },
  uploadButtonLargeText: {
    color: colors.primary,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
  },
  timeline: {
    paddingLeft: spacing.md,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: spacing.lg,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timelineTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  timelineText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...layout.shadow.md,
  },
});
