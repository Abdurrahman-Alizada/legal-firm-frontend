import { TabHeader } from '@/components/ui/Headers';
import { colors, fonts, layout, spacing } from '@/constants';
import { useAuthStore } from '@/services/authStore';
import { Bell, ChevronRight, CreditCard as Edit, CircleHelp as HelpCircle, LogOut, Mail, User } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);

  const profileSections = [
    {
      title: 'Account',
      items: [
        { id: 'personal-info', label: 'Personal Information', icon: User, action: 'navigate' },
        // { id: 'security', label: 'Security & Privacy', icon: Shield, action: 'navigate' },
        { id: 'notifications', label: 'Notifications', icon: Bell, action: 'toggle', value: notificationsEnabled, onToggle: setNotificationsEnabled },
      ]
    },
    // {
    //   title: 'App Settings',
    //   items: [
    //     // { id: 'general', label: 'General Settings', icon: Settings, action: 'navigate' },
    //     // { id: 'biometrics', label: 'Biometric Authentication', icon: Shield, action: 'toggle', value: biometricsEnabled, onToggle: setBiometricsEnabled },
    //   ]
    // },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help & Support', icon: HelpCircle, action: 'navigate' },
        { id: 'logout', label: 'Sign Out', icon: LogOut, action: 'logout', destructive: true },
      ]
    }
  ];

  const handleItemPress = (item: any) => {
    if (item.action === 'logout') {
      logout();
    }
    // Handle other navigation items here
  };

  const renderSettingsItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingsItem, item.destructive && styles.destructiveItem]}
      onPress={() => handleItemPress(item)}
      disabled={item.action === 'toggle'}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, item.destructive && styles.destructiveIcon]}>
          <item.icon 
            size={20} 
            color={item.destructive ? colors.error : colors.text.secondary} 
          />
        </View>
        <Text style={[styles.settingsLabel, item.destructive && styles.destructiveLabel]}>
          {item.label}
        </Text>
      </View>
      
      <View style={styles.settingsItemRight}>
        {item.action === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: colors.border.medium, true: colors.primary + '40' }}
            thumbColor={item.value ? colors.primary : colors.background.primary}
          />
        ) : (
          <ChevronRight size={20} color={colors.text.secondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TabHeader title='Profile' onRight={<TouchableOpacity style={styles.editButton}>
          <Edit size={24} color={colors.primary} />
        </TouchableOpacity>}/>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={require('@/assets/images/lawyer.png')}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.profileRole}>
              {(user && user?.role?.name.charAt(0).toUpperCase() + user?.role.name.slice(1) )}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Mail size={20} color={colors.text.secondary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsCard}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  {renderSettingsItem(item)}
                  {index < section.items.length - 1 && <View style={styles.settingsDivider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Legal Firm</Text>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  editButton: {
    padding: spacing.sm,
  },
  profileCard: {
    backgroundColor: colors.background.primary,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileRole: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  contactCard: {
    backgroundColor: colors.background.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.sm,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  contactInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  contactLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  settingsSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  settingsCard: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    ...layout.shadow.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  destructiveItem: {
    backgroundColor: colors.error + '05',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  destructiveIcon: {
    backgroundColor: colors.error + '10',
  },
  settingsLabel: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  destructiveLabel: {
    color: colors.error,
  },
  settingsItemRight: {
    alignItems: 'center',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: spacing.lg + 40 + spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom:60
  },
  appInfoText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
});