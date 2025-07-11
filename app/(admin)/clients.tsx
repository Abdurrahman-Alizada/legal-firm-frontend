import { TabHeader } from '@/components/ui/Headers';
import { colors, fonts, layout, spacing } from '@/constants';
import { Mail, MapPin, Phone, Plus, Search } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockClients = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    activeCases: 3,
    type: 'Corporate'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    avatar: 'https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    activeCases: 1,
    type: 'Individual'
  },
  {
    id: '3',
    name: 'Property Developers LLC',
    email: 'info@propdev.com',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    avatar: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    activeCases: 2,
    type: 'Corporate'
  },
  {
    id: '4',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 321-0987',
    location: 'Seattle, WA',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    activeCases: 1,
    type: 'Individual'
  }
];

export default function ClientsScreen() {
  const renderClientCard = (client: typeof mockClients[0]) => (
    <TouchableOpacity key={client.id} style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <Image source={{ uri: client.avatar }} style={styles.clientAvatar} />
        <View style={styles.clientInfo}>
          <View style={styles.clientNameRow}>
            <Text style={styles.clientName} numberOfLines={1}>
              {client.name}
            </Text>
            <View style={[styles.typeBadge, client.type === 'Corporate' ? styles.corporateBadge : styles.individualBadge]}>
              <Text style={styles.typeText}>{client.type}</Text>
            </View>
          </View>
          <Text style={styles.clientCases}>
            {client.activeCases} active case{client.activeCases !== 1 ? 's' : ''}
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
          <Text style={styles.clientDetailText}>
            {client.phone}
          </Text>
        </View>
        <View style={styles.clientDetail}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.clientDetailText}>
            {client.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TabHeader title='Clients' onRight={ <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.text.white} />
          </TouchableOpacity>
        </View>}/>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Corporate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Individual</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.clientsList}>
          {mockClients.map(renderClientCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  searchButton: {
    backgroundColor: colors.background.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    ...layout.shadow.sm,
  },
  statNumber: {
    fontSize: fonts.sizes['2xl'],
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
    marginBottom:30
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
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: colors.primary + '20',
  },
  individualBadge: {
    backgroundColor: colors.secondary + '20',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clientDetailText: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
});