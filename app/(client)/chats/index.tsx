import { TabHeader } from "@/components/ui/Headers";
import { SkeletonThread } from "@/components/ui/Skeletons";
import { colors, fonts, layout, spacing } from "@/constants";
import { useCaseStore } from "@/services/caseStore";
import { useChatStore } from "@/services/chatStore";
import { Feather, Octicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatListScreen = () => {
  const { threads, loading, error, fetchThreads } = useChatStore();
  const { cases } = useCaseStore();

  useEffect(() => {
    fetchThreads();
  }, []);

  const navigateToChat = (threadId: string) => {
    router.push(`/chats/${threadId}`);
  };


  const renderThread = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.threadItem}
      onPress={() => navigateToChat(item._id)}
    >
      <View style={styles.threadAvatar}>
        <Octicons
          name={
            item.scope == "case"
              ? "law"
              : item.scope == "company"
              ? "organization"
              : "person"
          }
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={styles.threadContent}>
        <Text style={styles.threadTitle} numberOfLines={1}>
          {item.case?item?.case?.title:item?.lawCompany?.name}
        </Text>
        <Text style={styles.threadPreview} numberOfLines={1}>
        </Text>
      </View>
      <View style={styles.threadMeta}>
        <Text style={styles.threadTime}>
          {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    <SafeAreaView style={styles.container}>
      <TabHeader title="Chats" />
      <FlatList
        data={threads}
        renderItem={renderThread}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <View>
              {[...Array(8)].map((_, idx) => (
                <SkeletonThread key={idx} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Feather
                name="message-square"
                size={48}
                color={colors.text.secondary}
              />
              <Text style={styles.emptyText}>No chats yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    color: "white",
    fontWeight: fonts.weights.medium,
  },
  listContent: {
    padding: spacing.md,
  },
  threadItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  threadTime: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    flexGrow:1,
    paddingTop:200,
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
    textAlign: "center",
  },
});

export default ChatListScreen;
