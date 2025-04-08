import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingIcon from './LoadingIcon';
import NoContent from './NoContent';
import AddButton from './AddButton';
import GoalSummaryCard from './GoalSummaryCard';
import GoalsList from './GoalsList';

export default function GoalLayout({
  theme,
  title,
  goals,
  totalSaved,
  totalTarget,
  loading,
  refreshing,
  onRefresh,
  onAddPress,
  onGoalPress,
  emptyIconName,
}) {
  if (loading && !refreshing) {
    return <LoadingIcon theme={theme} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={[]}>
      <GoalSummaryCard 
        totalSaved={totalSaved} 
        totalTarget={totalTarget} 
        theme={theme} 
      />

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
        </View>
        
        {goals.length > 0 ? (
          <GoalsList 
            goals={goals}
            theme={theme}
            onGoalPress={onGoalPress}
          />
        ) : (
          <NoContent 
            theme={theme} 
            type="goal" 
            onAddPress={onAddPress}
            iconName={emptyIconName}
          />
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <AddButton theme={theme} onPress={onAddPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80,
  },
});