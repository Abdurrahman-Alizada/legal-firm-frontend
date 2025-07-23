import GenerateDocumentModal from "@/components/modals/GenerateDocumentModal";
import { TabHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants";
import { GeneratedDocument, useDocumentStore } from "@/services/documentStore";
import { handleOpenDocument, isIosDevice, shareDocument } from "@/utils/helper";
import {
  Download,
  File,
  FileText,
  Image as ImageIcon,
  Share,
  Star,
  Upload
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function DocumentsScreen() {
  const [filter, setFilter] = useState<"all" | "recent" | "important">("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<
    GeneratedDocument[]
  >([]);
  const { documents, toggleImportant } = useDocumentStore();

  useEffect(() => {
    // Combine filter and search
    let result = [...documents];

    // Apply filter
    if (filter === "recent") {
      result = result
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    } else if (filter === "important") {
      result = result.filter((doc) => doc.isImportant);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query))
      );
    }

    setFilteredDocuments(result);
  }, [documents, filter, searchQuery]);


  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "doc":
      case "docx":
        return <FileText size={24} color={colors.primary} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon size={24} color={colors.secondary} />;
      default:
        return <File size={24} color={colors.text.secondary} />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return colors.error;
      case "doc":
      case "docx":
        return colors.primary;
      case "jpg":
      case "jpeg":
      case "png":
        return colors.secondary;
      default:
        return colors.text.secondary;
    }
  };

  const renderDocument = (doc: GeneratedDocument) => (
    <TouchableOpacity key={doc.url} style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentIcon}>{getFileIcon("pdf")}</View>
        <View style={styles.documentInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.documentName} numberOfLines={1}>
              {doc.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleImportant(doc.url)}
              style={styles.starButton}
            >
              <Star
                size={20}
                fill={doc.isImportant ? colors.warning : "transparent"}
                color={doc.isImportant ? colors.warning : colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.documentCase} numberOfLines={1}>
            {doc.description}
          </Text>
          <View style={styles.documentMeta}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getFileTypeColor("pdf") + "20" },
              ]}
            >
              <Text
                style={[styles.typeText, { color: getFileTypeColor("pdf") }]}
              >
                {"pdf"}
              </Text>
            </View>
            <Text style={styles.documentSize}>{"1.3 mb"}</Text>
            <Text style={styles.documentDate}>
              {new Date(doc.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOpenDocument(doc)}
        >
          <FileText size={16} color={colors.primary} />
          <Text style={styles.actionText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOpenDocument(doc)}
        >
          <Download size={16} color={colors.primary} />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => shareDocument(doc)}
        >
          <Share size={16} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TabHeader
        title="Documents"
        showSearch
        onSearchChange={(text)=>setSearchQuery(text)}
        onRight={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setModalVisible(true)}
            >
              <Upload size={24} color={colors.text.white} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {(["all", "recent", "important"] as const).map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterTab,
                  filter === filterOption && styles.activeFilterTab,
                ]}
                onPress={() => setFilter(filterOption)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filter === filterOption && styles.activeFilterTabText,
                  ]}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {filteredDocuments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <File size={48} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No documents found</Text>
          {searchQuery && (
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          )}
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.documentsList}>
            {filteredDocuments.map(renderDocument)}
          </View>
        </ScrollView>
      )}
      <GenerateDocumentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  searchContainer: {
    paddingTop: isIosDevice ? 0 : StatusBar.currentHeight,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    overflow: "hidden",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 30,
    paddingHorizontal: spacing.md,
    height: 50,
    marginTop: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    height: "100%",
  },
  searchClose: {
    padding: spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  searchButton: {
    backgroundColor: colors.background.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...layout.shadow.sm,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    ...layout.shadow.sm,
  },
  filterTabs: {
    flexDirection: "row",
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.background.secondary,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fonts.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  documentsList: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  documentCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.md,
    ...layout.shadow.sm,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  documentName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    flex: 1,
  },
  starButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  documentCase: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  typeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
  },
  documentSize: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  documentDate: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  documentActions: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
});
