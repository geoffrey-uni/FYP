import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default function LoadingIcon({ theme }) {
	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<ActivityIndicator size='large' color={theme.colors.primary} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});