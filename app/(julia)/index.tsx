import { colors, fonts, layout, spacing } from '@/constants';
import { ChatSession, useChatStore } from '@/services/aiChatStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SessionsScreen = () => {
  const { sessions, fetchSessions, loading } = useChatStore();

  useEffect(() => {
    fetchSessions();
    console.log(sessions)
  }, []);

  const handleCreateNew = () => {
    useChatStore.getState().createSession();
    router.push('/(julia)/[sessionId]');
  };

  const renderSession = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => {
        useChatStore.getState().fetchSession(item._id);
        //@ts-ignore
        router.push(`/(julia)/${item._id}`);
      }}
    >
      <View style={styles.sessionIcon}>
        <Feather name="message-square" size={20} color={colors.primary} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title || 'Legal Consultation'}
        </Text>
        <Text style={styles.sessionDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-square" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.newButton} onPress={handleCreateNew}>
        <Feather name="plus" size={24} color="white" />
        <Text style={styles.newButtonText}>New Conversation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContainer: {
    padding: spacing.md,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'white',
    borderRadius: layout.borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sessionDate: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  newButtonText: {
    color: 'white',
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    marginLeft: spacing.sm,
  },
});

export default SessionsScreen;