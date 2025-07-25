import { colors, layout, spacing } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export const SkeletonBox = ({ height, width, radius = 8, style = {} }:any) => (
  <LinearGradient
    colors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[
      {
        height,
        width,
        borderRadius: radius,
        backgroundColor: "#eee",
        marginVertical: spacing.xs,
      },
      style,
    ]}
  />
);

export const CaseDetailSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBox height={30} width="60%" />
        <SkeletonBox height={20} width="80%" />
        <SkeletonBox height={20} width="70%" />
        <View style={styles.statusRow}>
          <SkeletonBox height={20} width={80} />
          <SkeletonBox height={20} width={80} />
        </View>
      </View>

      <View style={styles.section}>
        <SkeletonBox height={24} width="40%" />
        <SkeletonBox height={80} width="100%" />
      </View>

      <View style={styles.section}>
        <SkeletonBox height={24} width="50%" />
        {[...Array(4)].map((_, index) => (
          <SkeletonBox key={index} height={20} width="100%" />
        ))}
      </View>

      <View style={styles.section}>
        <SkeletonBox height={24} width="50%" />
        <SkeletonBox height={48} width="100%" />
      </View>
    </View>
  );
};

export const PlanSkeleton = () => (
  <>
    <SkeletonBox height={20} width={140} radius={12} />
    <SkeletonBox height={24} width={180} />
    <SkeletonBox height={16} width="80%" />
    {[1, 2, 3].map((_, i) => (
      <SkeletonBox key={i} height={16} width="90%" />
    ))}
    <SkeletonBox height={44} width="100%" radius={8} />
  </>
);

 // Skeleton loader for firm info
 export const FirmSkeleton = () => (
  <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <SkeletonBox width={40} height={40} radius={20} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <SkeletonBox width="60%" height={16} radius={8} />
        <SkeletonBox width="40%" height={12} radius={8} />
      </View>
    </View>
  </View>
);
  // Skeleton loader for summary card
  export const SummarySkeleton = () => (
    <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
      {[...Array(3)].map((_, section) => (
        <React.Fragment key={section}>
          <SkeletonBox width="50%" height={18} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <SkeletonBox width={60} height={12} style={{ marginRight: 12 }} />
            <SkeletonBox width={40} height={12} />
          </View>
          <SkeletonBox width="40%" height={12} />
          <SkeletonBox width="80%" height={12} />
        </React.Fragment>
      ))}
    </View>
  );
  // Skeleton loader for chat screen
  export const ChatSkeleton = () => (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      {/* Header skeleton */}
      <View style={{ width: '60%', height: 24, backgroundColor: '#E5E7EB', borderRadius: 8, marginBottom: 24, alignSelf: 'center' }} />
      {/* Message bubbles skeleton */}
      {[1, 2, 3, 4,5,6,7,8,9,10].map((_, i) => (
        <View
          key={i}
          style={{
            alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
            backgroundColor: '#E5E7EB',
            borderRadius: 16,
            marginBottom: 16,
            padding: 16,
            minWidth: 120,
            maxWidth: '70%',
          }}
        >
          <View style={{ width: '80%', height: 12, backgroundColor: '#D1D5DB', borderRadius: 6, marginBottom: 8 }} />
          <View style={{ width: '60%', height: 12, backgroundColor: '#D1D5DB', borderRadius: 6 }} />
        </View>
      ))}
    </View>
  );

  export const SkeletonThread = () => (
    <View style={styles.skeletonItem}>
      <SkeletonBox width={48} height={48} radius={24} style={{ marginRight: spacing.md }} />
      <View style={styles.skeletonTextContainer}>
        <SkeletonBox width="50%" height={12} />
        <SkeletonBox width="80%" height={10} />
      </View>
    </View>
  );

  
  
  const styles = StyleSheet.create({
    skeletonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.background.primary,
      borderRadius: layout.borderRadius.md,
      marginBottom: spacing.sm,
      ...layout.shadow.sm,
    },
    skeletonAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E0E0E0',
      marginRight: spacing.md,
    },
    skeletonTextContainer: {
      flex: 1,
    },
    skeletonLineShort: {
      width: '50%',
      height: 12,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      marginBottom: spacing.xs,
    },
    skeletonLineLong: {
      width: '80%',
      height: 10,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
    },
    container: {
      padding: spacing.md,
      backgroundColor: colors.background.secondary,
      flex: 1,
    },
    header: {
      backgroundColor: colors.background.primary,
      padding: spacing.lg,
      borderRadius: 24,
      marginBottom: spacing.lg,
    },
    statusRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.sm,
    },
    section: {
      backgroundColor: colors.background.primary,
      borderRadius: layout.borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      ...layout.shadow.sm,
    },
    
  // Skeleton styles
  loadingBadge: {
    width: 140,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 10,
  },
  loadingTitle: {
    width: 180,
    height: 24,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingSubtitle: {
    width: "80%",
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingFeature: {
    width: "90%",
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  loadingButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 10,
  },
  })