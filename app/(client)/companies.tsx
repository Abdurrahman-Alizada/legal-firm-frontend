import CompanyCard from "@/components/common/CompanyCard";
import { TabHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants/index";
import { getCompanies } from "@/services/api/billingService";
import { chatService } from "@/services/api/chatService";
import { useAuthStore } from "@/services/authStore";
import { useChatStore } from "@/services/chatStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export interface Company {
  _id: string;
  name: string;
  type: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

const Companies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageloading, setMessageLoading] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { fetchThreads } = useChatStore();

  useEffect(() => {
    setLoading(true);
    getCompanies("law")
      .then((res) => setCompanies(res.data)) 
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
        clientCompanyId: user?.companyId,
        lawCompanyId: id,
      });
      await fetchThreads();
      router.push(`/chats/${res._id}`);
    } catch (err: any) {
      Toast.show({ type: "error", text1: err.message });
    } finally {
      setMessageLoading(null);
    }
  };

  const renderSkeleton = () => {
    return (
      <View>
        {[1, 2, 3,4,5,6,7,8].map((_, idx) => (
          <View key={idx} style={[styles.itemContainer, { marginBottom: spacing.md }]}>
            <View style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ width: "50%", height: 14, borderRadius: 4, marginBottom: 6,backgroundColor:colors.background.secondary }} />
              <View style={{ width: "80%", height: 12, borderRadius: 4, marginBottom: 6,backgroundColor:colors.background.secondary }} />
              <View style={{ width: "60%", height: 12, borderRadius: 4 }} />
            </View>
            <View style={[styles.messageButton, { width: 36, height: 36, borderRadius: 18,backgroundColor:colors.background.secondary }]} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TabHeader title="Firms" />

      <View style={styles.listContainer}>
        {loading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={companies}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CompanyCard id={item.owner.companyId} loadingId={messageloading} name={item.name} type="Firm" owner={item.owner} onPress={onMessagePress}/>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: layout.borderRadius.lg,
    backgroundColor:colors.background.secondary,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: fonts.sizes.lg,
    fontFamily: fonts.family.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  type: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.family.medium,
    color: colors.text.secondary,
    textTransform: "capitalize",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.light,
    marginHorizontal: spacing.sm,
  },
  owner: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.family.medium,
    color: colors.text.secondary,
  },
  email: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.family.regular,
    color: colors.text.light,
  },
  messageButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.primaryLight + "20",
    borderRadius: layout.borderRadius.full,
    marginLeft: spacing.sm,
  },
});

export default Companies;
