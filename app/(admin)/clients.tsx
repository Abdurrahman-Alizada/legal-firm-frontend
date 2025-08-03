import { TabHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants";
import { getRecentClients } from "@/services/api/billingService";
import { chatService } from "@/services/api/chatService";
import { useAuthStore } from "@/services/authStore";
import { useChatStore } from "@/services/chatStore";
import { router } from "expo-router";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ClientsScreen() {
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageloading, setMessageLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthStore();
  const { fetchThreads } = useChatStore();

  useEffect(() => {
    setLoading(true);
    getRecentClients()
      .then((res) => setRecentClients(res.data))
      .catch((err) => {
        Toast.show({ type: "error", text1: "Failed to load companies" });
      })
      .finally(() => setLoading(false));
  }, []);

  const onMessagePress = async (id: string) => {
    setMessageLoading(id);
    try {
      const res = await chatService.createChatThread({
        scope: "company",
        clientCompanyId: id,
        lawCompanyId: user?.companyId,
      });
      await fetchThreads();
      router.push(`/chats/${res._id}`);
    } catch (err: any) {
      Toast.show({ type: "error", text1: err.message });
    } finally {
      setMessageLoading(null);
    }
  };
  const renderClientCard = (client: any) => (
    <TouchableOpacity key={client.email} style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <Image
          source={require("@/assets/images/user.png")}
          style={styles.clientAvatar}
        />
        <View style={styles.clientInfo}>
          <View style={styles.clientNameRow}>
            <Text style={styles.clientName} numberOfLines={1}>
              {client.name}
            </Text>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => onMessagePress(client._id)}
            >
              {client._id === messageloading ? (
                <ActivityIndicator />
              ) : (
                <MessageCircle size={24} color="#2563EB" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.clientCases}>
            {client.activeCase??1} active case{client.activeCases !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <View style={styles.clientDetails}>
        <View style={styles.clientDetail}>
          <Mail size={16} color={colors.text.secondary} />
          <Text style={styles.clientDetailText} numberOfLines={1}>
            {client.email}
          </Text>
        </View>
        <View style={styles.clientDetail}>
          <Phone size={16} color={colors.text.secondary} />
          <Text style={styles.clientDetailText}>{client.phone || "N/A"}</Text>
        </View>
        <View style={styles.clientDetail}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.clientDetailText}>
            {client.location || "N/A"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TabHeader
        title="Clients"
        showSearch={true}
        onSearchChange={(text) => {
          setSearchQuery(text);
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.clientsList}>
          {recentClients.map(renderClientCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...layout.shadow.sm,
  },
  statsContainer: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: "center",
    ...layout.shadow.sm,
  },
  statNumber: {
    fontSize: fonts.sizes["2xl"],
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  clientsList: {
    padding: spacing.lg,
  },
  clientCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...layout.shadow.sm,
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  clientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  clientInfo: {
    flex: 1,
  },
  messageButton: {
    padding: 8,
  },
  clientNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  clientName: {
    flex: 1,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  corporateBadge: {
    backgroundColor: colors.primary + "20",
  },
  individualBadge: {
    backgroundColor: colors.secondary + "20",
  },
  typeText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  clientCases: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  clientDetails: {
    gap: spacing.sm,
  },
  clientDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  clientDetailText: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
});
