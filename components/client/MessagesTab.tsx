import { colors, fonts, layout, spacing } from '@/constants';
import { useCaseStore } from '@/services/caseStore';
import { useChatStore } from '@/services/chatStore';
import { ChatThread } from '@/types';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const MessagesTab = () => {
  const { threads, loading, error, fetchThreads } = useChatStore();
  const { cases } = useCaseStore();

  useEffect(() => {
    fetchThreads();
  }, []);

  const navigateToChat = (threadId: string) => {
    router.push(`/chats/${threadId}`);
  };

  const getCaseTitle = (caseId: string) => {
    const found = cases.find((c) => c._id === caseId);
    return found ? found.title : caseId;
  };

  const renderThread = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity 
      style={styles.threadItem} 
      onPress={() => navigateToChat(item._id)}
    >
      <View style={styles.threadAvatar}>
        <Feather name="message-square" size={24} color={colors.primary} />
      </View>
      <View style={styles.threadContent}>
        <Text style={styles.threadTitle} numberOfLines={1}>
          {getCaseTitle(item.caseId)}
        </Text>
        <Text style={styles.threadPreview} numberOfLines={1}>
          Thread ID: {item._id}
        </Text>
      </View>
      <View style={styles.threadMeta}>
        <Text style={styles.threadTime}>
          {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && threads.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchThreads}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        renderItem={renderThread}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-square" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubtext}>Start a conversation by opening a case</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fonts.sizes.lg,
    color: colors.error,
    marginBottom: spacing.md,
  },
  retryButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.md,
  },
  retryText: {
    color: 'white',
    fontWeight: fonts.weights.medium,
  },
  listContent: {
    flexGrow:1,
    padding: spacing.md,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
    marginBottom: spacing.sm,
    ...layout.shadow.sm,
  },
  threadAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  threadContent: {
    flex: 1,
  },
  threadTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  threadPreview: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  threadMeta: {
    position:'absolute',
    bottom:10,
    right:10
  },
  threadTime: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default MessagesTab;