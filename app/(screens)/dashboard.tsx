import { ErrorMessage } from '@/components/common/ErrorMessage';
import { colors, fonts, layout, spacing } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useCaseStore } from '@/stores/caseStore';
import { ChartBar as BarChart3, Bell, Briefcase, Clock, FileText, Plus, ShieldCheck, TrendingUp, Users, Wand as Wand2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuthStore();
  const { cases, isLoading, error, fetchCases } = useCaseStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
    }
  }, [isAuthenticated]);

  const stats = [
    {
      id: 1,
      title: 'Active Cases',
      value: cases.filter(c => c.status === 'active').length.toString(),
      icon: <Briefcase size={24} color={colors.primary} />,
      trend: '+12%'
    },
    {
      id: 2,
      title: 'Clients',
      value: '24',
      icon: <Users size={24} color={colors.secondary} />,
      trend: '+5%'
    },
    {
      id: 3,
      title: 'Documents',
      value: '156',
      icon: <FileText size={24} color={colors.accent} />,
      trend: '+8%'
    },
    {
      id: 4,
      title: 'Revenue',
      value: '$45.2K',
      icon: <TrendingUp size={24} color={colors.success} />,
      trend: '+15%'
    }
  ];

  const features = [
    {
      id: 1,
      title: 'AI Research',
      description: 'Get instant legal insights with AI-powered research',
      icon: <Wand2 size={32} color={colors.text.white} />,
      gradient: [colors.primary, colors.primaryDark],
    },
    {
      id: 2,
      title: 'Secure Communication',
      description: 'End-to-end encrypted client communications',
      icon: <ShieldCheck size={32} color={colors.text.white} />,
      gradient: [colors.secondary, '#0891B2'],
    },
    {
      id: 3,
      title: 'Smart Analytics',
      description: 'Real-time insights into case progress and billing',
      icon: <BarChart3 size={32} color={colors.text.white} />,
      gradient: [colors.accent, '#D97706'],
    }
  ];

  const quickActions = [
    { id: 1, title: 'New Case', icon: <Plus size={20} color={colors.text.white} /> },
    { id: 2, title: 'Add Client', icon: <Users size={20} color={colors.text.white} /> },
    { id: 3, title: 'Upload Document', icon: <FileText size={20} color={colors.text.white} /> }
  ];

//   if (!isAuthenticated) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.authContainer}>
//           <Text style={styles.welcomeTitle}>Welcome to FirmLink AI</Text>
//           <Text style={styles.welcomeSubtitle}>
//             Revolutionize your legal practice with AI-powered case management
//           </Text>
//           <Button 
//             title="Get Started" 
//             onPress={() => {}} 
//             size="large"
//             fullWidth
//             style={{ marginTop: spacing.xl }}
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={colors.text.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statIcon}>
                {stat.icon}
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statTrend}>{stat.trend}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionButton}>
                <View style={styles.quickActionIcon}>
                  {action.icon}
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Cases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Cases</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <View style={styles.casesContainer}>
              {cases.slice(0, 3).map((case_) => (
                <TouchableOpacity key={case_.id} style={styles.caseCard}>
                  <View style={styles.caseHeader}>
                    <Text style={styles.caseTitle} numberOfLines={1}>
                      {case_.title}
                    </Text>
                    <View style={[styles.statusBadge, styles[`status${case_.status}`]]}>
                      <Text style={styles.statusText}>{case_.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.caseClient}>{case_.clientName}</Text>
                  <View style={styles.caseFooter}>
                    <View style={styles.caseInfo}>
                      <Clock size={14} color={colors.text.secondary} />
                      <Text style={styles.caseDate}>
                        {new Date(case_.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.priorityBadge, styles[`priority${case_.priority}`]]}>
                      <Text style={styles.priorityText}>{case_.priority}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Powered by AI</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature) => (
              <TouchableOpacity key={feature.id} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.gradient[0] }]}>
                  {feature.icon}
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  welcomeTitle: {
    fontSize: fonts.sizes['3xl'],
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  welcomeSubtitle: {
    fontSize: fonts.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  statIcon: {
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fonts.sizes['2xl'],
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statTrend: {
    fontSize: fonts.sizes.xs,
    color: colors.success,
    fontWeight: fonts.weights.medium,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  seeAllText: {
    fontSize: fonts.sizes.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...layout.shadow.sm,
  },
  quickActionIcon: {
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.white,
    fontWeight: fonts.weights.medium,
    textAlign: 'center',
  },
  casesContainer: {
    gap: spacing.md,
  },
  caseCard: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.sm,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  caseTitle: {
    flex: 1,
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  caseClient: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  caseDate: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  statusBadge: {
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
  statusText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
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
  priorityText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  featuresContainer: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    gap: spacing.lg,
    ...layout.shadow.sm,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});