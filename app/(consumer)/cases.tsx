import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { colors, fonts, layout, spacing } from '@/constants';
import { Case, useCaseStore } from '@/stores/caseStore';
import { Clock, FileText, Filter, MoveVertical as MoreVertical, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CasesScreen() {
  const { cases, isLoading, error, fetchCases, createCase } = useCaseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    clientName: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || case_.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateCase = async () => {
    if (!newCase.title || !newCase.clientName) return;
    
    await createCase(newCase);
    setNewCase({
      title: '',
      clientName: '',
      description: '',
      status: 'pending',
      priority: 'medium'
    });
    setShowCreateModal(false);
  };

  const renderCaseCard = (case_: Case) => (
    <TouchableOpacity key={case_.id} style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseHeaderLeft}>
          <Text style={styles.caseTitle} numberOfLines={1}>
            {case_.title}
          </Text>
          <Text style={styles.caseClient}>{case_.clientName}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color={colors.text.secondary} />
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
            <Text style={styles.caseStatText}>{case_.documents || 0} docs</Text>
          </View>
          <View style={styles.caseStat}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.caseStatText}>
              {new Date(case_.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.caseBadges}>
          <View style={[styles.statusBadge, styles[`status${case_.status}`]]}>
            <Text style={styles.badgeText}>{case_.status}</Text>
          </View>
          <View style={[styles.priorityBadge, styles[`priority${case_.priority}`]]}>
            <Text style={styles.badgeText}>{case_.priority}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage 
          message={error} 
          onRetry={fetchCases}
          fullScreen 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cases</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={24} color={colors.text.white} />
        </TouchableOpacity>
      </View>

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
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {(['all', 'active', 'pending', 'closed'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              filterStatus === status && styles.activeFilterTab
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[
              styles.filterTabText,
              filterStatus === status && styles.activeFilterTabText
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size={"small"} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredCases.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No cases found</Text>
              <Text style={styles.emptyMessage}>
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first case to get started'}
              </Text>
              <Button
                title="Create Case"
                onPress={() => setShowCreateModal(true)}
                style={{ marginTop: spacing.lg }}
              />
            </View>
          ) : (
            <View style={styles.casesList}>
              {filteredCases.map(renderCaseCard)}
            </View>
          )}
        </ScrollView>
      )}

      {/* Create Case Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Case</Text>
            <TouchableOpacity 
              onPress={handleCreateCase}
              disabled={!newCase.title || !newCase.clientName}
            >
              <Text style={[
                styles.saveText,
                (!newCase.title || !newCase.clientName) && styles.disabledText
              ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Case Title *</Text>
              <TextInput
                style={styles.input}
                value={newCase.title}
                onChangeText={(text) => setNewCase(prev => ({ ...prev, title: text }))}
                placeholder="Enter case title"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Name *</Text>
              <TextInput
                style={styles.input}
                value={newCase.clientName}
                onChangeText={(text) => setNewCase(prev => ({ ...prev, clientName: text }))}
                placeholder="Enter client name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newCase.description}
                onChangeText={(text) => setNewCase(prev => ({ ...prev, description: text }))}
                placeholder="Enter case description"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                  {(['pending', 'active', 'closed'] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.pickerOption,
                        newCase.status === status && styles.selectedPickerOption
                      ]}
                     //@ts-ignore 
                      onPress={() => setNewCase(prev => ({ ...prev, status }))}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        newCase.status === status && styles.selectedPickerOptionText
                      ]}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.pickerOption,
                        newCase.priority === priority && styles.selectedPickerOption
                      ]}
                      //@ts-ignore
                      onPress={() => setNewCase(prev => ({ ...prev, priority }))}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        newCase.priority === priority && styles.selectedPickerOptionText
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
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
    gap: spacing.md,
  },
  caseCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...layout.shadow.sm,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  caseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  caseStatText: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  caseBadges: {
    flexDirection: 'row',
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
    backgroundColor: colors.success + '20',
  },
  statuspending: {
    backgroundColor: colors.warning + '20',
  },
  statusclosed: {
    backgroundColor: colors.text.secondary + '20',
  },
  priorityhigh: {
    backgroundColor: colors.error + '20',
  },
  prioritymedium: {
    backgroundColor: colors.warning + '20',
  },
  prioritylow: {
    backgroundColor: colors.success + '20',
  },
  badgeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  formGroup: {
    marginBottom: spacing.lg,
  },
  formRow: {
    gap: spacing.md,
  },
  formGroupHalf: {
    flex: 1,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  pickerOption: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  selectedPickerOption: {
    backgroundColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.primary,
  },
  selectedPickerOptionText: {
    color: colors.text.white,
    fontWeight: fonts.weights.medium,
  },
});