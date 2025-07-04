import { colors, fonts, layout, spacing } from '@/constants';
import { Download, File, FileText, Filter, Image as ImageIcon, MoveVertical as MoreVertical, Search, Share, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockDocuments = [
  {
    id: '1',
    name: 'Contract Agreement - TechCorp',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: '2024-01-20T10:30:00Z',
    caseId: '1',
    caseName: 'Contract Dispute - TechCorp',
    tags: ['contract', 'legal', 'important']
  },
  {
    id: '2',
    name: 'Employment Records - Sarah Johnson',
    type: 'docx',
    size: '1.8 MB',
    uploadedAt: '2024-01-19T14:15:00Z',
    caseId: '2',
    caseName: 'Employment Law Case',
    tags: ['employment', 'records']
  },
  {
    id: '3',
    name: 'Property Deed Scan',
    type: 'jpg',
    size: '5.2 MB',
    uploadedAt: '2024-01-18T09:45:00Z',
    caseId: '3',
    caseName: 'Real Estate Transaction',
    tags: ['property', 'deed', 'scan']
  },
  {
    id: '4',
    name: 'Legal Brief - Contract Analysis',
    type: 'pdf',
    size: '890 KB',
    uploadedAt: '2024-01-17T16:20:00Z',
    caseId: '1',
    caseName: 'Contract Dispute - TechCorp',
    tags: ['brief', 'analysis']
  },
  {
    id: '5',
    name: 'Client Meeting Notes',
    type: 'txt',
    size: '45 KB',
    uploadedAt: '2024-01-16T11:00:00Z',
    caseId: '2',
    caseName: 'Employment Law Case',
    tags: ['notes', 'meeting']
  }
];

export default function DocumentsScreen() {
  const [filter, setFilter] = useState<'all' | 'recent' | 'important'>('all');

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText size={24} color={colors.primary} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon size={24} color={colors.secondary} />;
      default:
        return <File size={24} color={colors.text.secondary} />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return colors.error;
      case 'doc':
      case 'docx': return colors.primary;
      case 'jpg':
      case 'jpeg':
      case 'png': return colors.secondary;
      default: return colors.text.secondary;
    }
  };

  const renderDocument = (doc: typeof mockDocuments[0]) => (
    <TouchableOpacity key={doc.id} style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentIcon}>
          {getFileIcon(doc.type)}
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {doc.name}
          </Text>
          <Text style={styles.documentCase} numberOfLines={1}>
            {doc.caseName}
          </Text>
          <View style={styles.documentMeta}>
            <View style={[styles.typeBadge, { backgroundColor: getFileTypeColor(doc.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getFileTypeColor(doc.type) }]}>
                {doc.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.documentSize}>{doc.size}</Text>
            <Text style={styles.documentDate}>
              {new Date(doc.uploadedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.documentActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Download size={16} color={colors.primary} />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share size={16} color={colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {doc.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {doc.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockDocuments.length}</Text>
          <Text style={styles.statLabel}>Total Files</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {(mockDocuments.reduce((acc, doc) => {
              const size = parseFloat(doc.size);
              return acc + (doc.size.includes('MB') ? size : size / 1000);
            }, 0)).toFixed(1)} MB
          </Text>
          <Text style={styles.statLabel}>Storage Used</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockDocuments.filter(doc => 
              new Date(doc.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
          </Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {(['all', 'recent', 'important'] as const).map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterTab,
                  filter === filterOption && styles.activeFilterTab
                ]}
                onPress={() => setFilter(filterOption)}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === filterOption && styles.activeFilterTabText
                ]}>
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.documentsList}>
          {mockDocuments.map(renderDocument)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  searchButton: {
    backgroundColor: colors.background.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  statNumber: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginRight: spacing.md,
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
  filterButton: {
    backgroundColor: colors.background.primary,
    width: 40,
    height: 40,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...layout.shadow.sm,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  documentCase: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  moreButton: {
    padding: spacing.xs,
  },
  documentActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  tagText: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
});