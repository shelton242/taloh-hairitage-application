import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useStore } from '../lib/store';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { reminders, streak } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.welcomeCard}>
        <Text style={styles.title}>Welcome to Taloh's Hairitage™</Text>
        <Text style={styles.description}>
          Track your routine, measure progress, and manage refills—all in one place. Set 12-hour
          reminders, capture photos securely, and subscribe to save.
        </Text>
      </Card>

      <Card style={styles.snapshotCard}>
        <Text style={styles.sectionTitle}>Routine Snapshot</Text>
        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Every</Text>
          <Text style={styles.snapshotValue}>{reminders.intervalHours} hours</Text>
        </View>
        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Start:</Text>
          <Text style={styles.snapshotValue}>{reminders.startTime}</Text>
        </View>
        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Streak:</Text>
          <Text style={styles.snapshotValue}>{streak} days</Text>
        </View>
      </Card>

      <Card style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Tips of the Day</Text>
        <View style={styles.tip}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Apply to a dry scalp and allow a few minutes for complete absorption before styling.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Consistency improves outcomes—use reminders to maintain your streak.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Mild tingling is common. Stop use if severe irritation persists and seek advice.
          </Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Track progress photos every 2 weeks to see visible improvements over time.
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Set Reminders"
          onPress={() => navigation.navigate('Reminders')}
          style={styles.actionButton}
        />
        <Button
          title="Add Progress Photo"
          onPress={() => navigation.navigate('Progress')}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Subscribe & Save"
          onPress={() => navigation.navigate('Shop')}
          variant="accent"
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  welcomeCard: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.grayDark,
    lineHeight: 24,
  },
  snapshotCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
    marginBottom: spacing.lg,
  },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  snapshotLabel: {
    ...typography.body,
    color: colors.grayDark,
  },
  snapshotValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
  },
  tipsCard: {
    marginBottom: spacing.xl,
    backgroundColor: '#F0FEFF',
  },
  tip: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tipBullet: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.sm,
    fontWeight: '700',
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.dark,
    flex: 1,
    lineHeight: 21,
  },
  actions: {
    gap: spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
});
