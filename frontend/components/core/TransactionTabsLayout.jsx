import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingIcon from './LoadingIcon';
import AmountCard from './AmountCard';
import NoContent from './NoContent';
import AddButton from './AddButton';
import SortButton from './SortButton';
import TransactionItem from './TransactionItem';

export default function TransactionTabsLayout({
  type,
  theme,
  title,
  transactions,
  totalAmount,
  loading,
  refreshing,
  onRefresh,
  onAddPress,
  onSortPress,
  onTransactionPress,
  emptyIconName,
}) {
  if (loading && !refreshing) {
    return <LoadingIcon theme={theme} />;
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title || `${type === 'income' ? 'Income' : 'Expense'} History`}
      </Text>
      <SortButton onPress={onSortPress} theme={theme} />
    </View>
  );

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.cardContainer, { backgroundColor: theme.colors.card }]}
      onPress={() => onTransactionPress(item)}
      activeOpacity={0.7}
    >
      <TransactionItem 
        transaction={item} 
        theme={theme} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={[]}>
      <AmountCard 
        label={type === 'income' ? 'Total Income' : 'Total Expenses'} 
        value={totalAmount} 
        theme={theme} 
        type={type} 
      />

      {transactions.length > 0 ? (
        <FlatList
          style={styles.listContainer}
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[theme.colors.primary]} 
              tintColor={theme.colors.primary}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <>
          {renderHeader()}
          <NoContent 
            theme={theme} 
            type={type} 
            onAddPress={onAddPress}
            iconName={emptyIconName}
          />
        </>
      )}
      
      <AddButton theme={theme} onPress={onAddPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContainer: {
    marginTop: 5
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  cardContainer: {
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    marginBottom: 2,
  },
  separator: {
    height: 10, 
  }
});