import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, layout, spacing } from '../../constants';

export default function DocumentsTab() {
  const handleSelectFiles = () => {};
  const handleUploadFirstDocument = () => {};

  return (
    <>
      {/* Shared Document */}
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Shared Document</Text>
        </View>
        <Text style={styles.cardSubtitle}>
          Document shared with you by your legal team
        </Text>
        <View style={styles.dashedContainer}>
          <Ionicons name="document-outline" size={48} color={colors.border.medium} />
          <Text style={styles.noDocumentText}>No document shared yet</Text>
          <Text style={styles.helperText}>
            Your legal team hasn't shared any document with you yet. They will appear here once shared.
          </Text>
        </View>
      </View>

      {/* Document Upload */}
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.text.secondary} />
          </View>
          <Text style={styles.cardTitle}>Document Upload</Text>
        </View>
        <View style={styles.dashedContainer}>
          <Ionicons name="cloud-upload-outline" size={48} color={colors.border.medium} />
          <Text style={styles.uploadPrompt}>Upload document for your case</Text>
          <Text style={styles.uploadSubtext}>
            Drag and drop files here or click to browse (PDF, DOC, XLSX & Images)
          </Text>
          <TouchableOpacity style={styles.selectFilesButton} onPress={handleSelectFiles}>
            <Ionicons name="attach-outline" size={16} color={colors.primary} />
            <Text style={styles.selectFilesText}>Select Files</Text>
          </TouchableOpacity>
          <Text style={styles.securityNote}>
            ⚡ 256-bit encryption ensures your documents are secure
          </Text>
        </View>
        <View style={styles.uploadSection}>
          <Text style={styles.uploadSectionTitle}>Your Documents (0)</Text>
          <View style={styles.noUploadsContainer}>
            <Ionicons name="document-outline" size={48} color={colors.border.medium} />
            <Text style={styles.noUploadText}>No documents upload yet</Text>
            <TouchableOpacity style={styles.uploadFirstDocButton} onPress={handleUploadFirstDocument}>
              <Text style={styles.uploadFirstDocText}>Upload Your First Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  cardSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginLeft: 44,
  },
  dashedContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginVertical: spacing.md,
  },
  noDocumentText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: 12,
  },
  helperText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  uploadPrompt: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  selectFilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  selectFilesText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
    marginLeft: 4,
  },
  securityNote: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  uploadSection: {
    marginTop: spacing.md,
  },
  uploadSectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  noUploadsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noUploadText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginTop: 12,
    marginBottom: 16,
  },
  uploadFirstDocButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadFirstDocText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.semibold,
  },
});
