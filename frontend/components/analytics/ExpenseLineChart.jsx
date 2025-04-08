import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions,  } from 'react-native';
import Svg, { Line, Circle, Path,  Text as SvgText } from 'react-native-svg';
import { formatCurrency } from '../../utils/formatters';

const screenWidth = Dimensions.get('window').width;


const getMonthNames = () => [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const convertToMondayFirstDay = (jsDay) => {
  return jsDay === 0 ? 6 : jsDay - 1;
};

// This week data
const processWeekData = (weekData) => {
  if (!weekData || weekData.length === 0) {
    return null;
  }
  
  const today = new Date();
  const jsDay = today.getDay();
  const currentDayOfWeek = convertToMondayFirstDay(jsDay);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyExpenses = Array(7).fill(0);
  
  weekData.forEach(item => {
    const date = new Date(item.date);
    const itemDay = date.getDay();
    const adjustedDay = convertToMondayFirstDay(itemDay);
    
    if (adjustedDay >= 0 && adjustedDay < 7) {
      dailyExpenses[adjustedDay] = item.accumulated_expense;
    }
  });
  
  const spentSoFar = dailyExpenses[currentDayOfWeek] || 0;
  const predictedTotal = dailyExpenses[6] || 0;
  const expectedAdditionalSpending = predictedTotal - spentSoFar;
  const daysWithData = currentDayOfWeek + 1;
  
  return {
    labels: dayLabels,
    data: dailyExpenses.map(val => val || 0),
    actualDataCount: daysWithData,
    projectedTotal: predictedTotal,
    historicalTotal: spentSoFar,
    additionalSpending: expectedAdditionalSpending
  };
};

// This month data
const processMonthData = (monthData) => {
  if (!monthData || monthData.length === 0) {
    return null;
  }
  
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  const dailyExpenses = Array(daysInMonth).fill(0);
  
  monthData.forEach(item => {
    const date = new Date(item.date);
    const day = date.getDate();
    
    if (day >= 1 && day <= daysInMonth) {
      dailyExpenses[day - 1] = item.accumulated_expense;
    }
  });
  
  const spentSoFar = dailyExpenses[currentDay - 1] || 0;
  const predictedTotal = dailyExpenses[daysInMonth - 1] || 0;
  const expectedAdditionalSpending = predictedTotal - spentSoFar;
  
  return {
    labels: dayLabels,
    data: dailyExpenses.map(val => val || 0),
    actualDataCount: currentDay,
    projectedTotal: predictedTotal,
    historicalTotal: spentSoFar,
    additionalSpending: expectedAdditionalSpending
  };
};

// This year data
const processYearData = (yearData) => {
  if (!yearData || yearData.length === 0) {
    return null;
  }
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const monthLabels = getMonthNames().map(month => month.substring(0, 3));
  const monthlyExpenses = Array(12).fill(0);
  
  yearData.forEach(item => {
    const month = item.month - 1;
    
    if (month >= 0 && month < 12) {
      monthlyExpenses[month] = item.accumulated_expense;
    }
  });
  
  const spentSoFar = monthlyExpenses[currentMonth] || 0;
  const predictedYearTotal = monthlyExpenses[11] || 0;
  const expectedAdditionalSpending = predictedYearTotal - spentSoFar;
  
  return {
    labels: monthLabels,
    data: monthlyExpenses.map(val => val || 0),
    actualDataCount: currentMonth + 1,
    projectedTotal: predictedYearTotal,
    historicalTotal: spentSoFar,
    additionalSpending: expectedAdditionalSpending
  };
};

const processBackendData = (data, timePeriod) => {
  if (!data) return null;
  
  const emptyChartData = {
    labels: [],
    data: [],
    actualDataCount: 0,
    projectedTotal: 0,
    historicalTotal: 0,
    additionalSpending: 0
  };
  
  if (!data.this_week_expense || !data.this_month_expense || !data.this_year_expense) {
    return emptyChartData;
  }
  
  if (timePeriod === 'week') {
    return processWeekData(data.this_week_expense);
  } else if (timePeriod === 'month') {
    return processMonthData(data.this_month_expense);
  } else {
    return processYearData(data.this_year_expense);
  }
};

// Custom Line Chart is used for better customization, mainly concerning dots that distinguish actual vs predicted expenses
const CustomLineChart = ({ data, width, height, theme, isDarkMode }) => {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.gray }}>No data available</Text>
      </View>
    );
  }
  
  const values = data.data;
  const labels = data.labels;
  const actualCount = data.actualDataCount;

  const padding = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(...values, 0.1);
  
  const yAxisLabelCount = 5;
  const yAxisLabels = Array.from({ length: yAxisLabelCount + 1 }, (_, i) => {
    const value = maxValue * (i / yAxisLabelCount);
    if (value >= 1000) {
      return `$${(value/1000).toFixed(1)}K`;
    }
    return `$${Math.round(value)}`;
  });
  
  const visibleXLabels = labels.map((label, i) => {
    if (labels.length <= 12) return label;
    if (i === 0 || i === labels.length - 1) return label;
    if (labels.length > 20 && i % 5 === 0) return label;
    if (i % Math.ceil(labels.length / 6) === 0) return label;
    return '';
  });
  
  const points = values.map((value, i) => {
    const x = (chartWidth / (values.length - 1)) * i + padding.left;
    const y = chartHeight - (chartHeight * (value / maxValue)) + padding.top;
    return { x, y, value };
  });

  let linePath = '';
  points.forEach((point, i) => {
    if (i === 0) {
      linePath += `M ${point.x} ${point.y} `;
    } else {
      linePath += `L ${point.x} ${point.y} `;
    }
  });
  
  let areaPath = linePath + `L ${points[points.length-1].x} ${chartHeight + padding.top} L ${points[0].x} ${chartHeight + padding.top} Z`;
  
  const horizontalGridLines = Array.from({ length: yAxisLabelCount + 1 }, (_, i) => {
    const y = chartHeight - (chartHeight * (i / yAxisLabelCount)) + padding.top;
    return (
      <Line
        key={`h-grid-${i}`}
        x1={padding.left}
        y1={y}
        x2={width - padding.right}
        y2={y}
        stroke={isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
        strokeWidth='1'
        strokeDasharray='5,5'
      />
    );
  });
  
  return (
    <Svg width={width} height={height}>
      {/* Grid Lines */}
      {horizontalGridLines}
      
      {/* Y-Axis */}
      {yAxisLabels.map((label, i) => (
        <SvgText
          key={`y-label-${i}`}
          x={padding.left - 5}
          y={chartHeight - (chartHeight * (i / yAxisLabelCount)) + padding.top + 5}
          fontSize='10'
          textAnchor='end'
          fill={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
        >
          {label}
        </SvgText>
      ))}
      
      {/* X-Axis */}
      {visibleXLabels.map((label, i) => {
        if (!label) return null;
        return (
          <SvgText
            key={`x-label-${i}`}
            x={(chartWidth / (labels.length - 1)) * i + padding.left}
            y={height - 10}
            fontSize='10'
            textAnchor='middle'
            fill={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
          >
            {label}
          </SvgText>
        );
      })}

      <Path
        d={areaPath}
        fill='#ACBBF7'
        fillOpacity='0.2'
      />
      
      {/* Line */}
      <Path
        d={linePath}
        stroke='#ACBBF7'
        strokeWidth='2'
        fill='none'
      />
      
      {/* Data Points */}
      {points.map((point, i) => {
        if (point.value === 0) return null;
        
        const isActualData = i < actualCount;
        const dotColor = isActualData ? '#4361EE' : '#ACBBF7';
        
        return (
          <Circle
            key={`dot-${i}`}
            cx={point.x}
            cy={point.y}
            r='4'
            fill={dotColor}
          />
        );
      })}
    </Svg>
  );
};

// Main component
export default function ExpenseLineChart({ 
  predictionData, 
  timePeriod, 
  theme, 
  isDarkMode 
}) {
  const chartData = useMemo(() => 
    processBackendData(predictionData, timePeriod),
    [predictionData, timePeriod]
  );
  
  const getExpenseInsight = () => {
    if (!chartData || !chartData.data || chartData.data.length === 0) {
      return 'No expense data available.';
    }
    
    const spentSoFar = chartData.historicalTotal || 0;
    const expectedAdditionalSpending = chartData.additionalSpending || 0;
    const predictedTotal = chartData.projectedTotal || 0;
    
    const today = new Date();
    
    if (timePeriod === 'week') {
      const jsDay = today.getDay();
      const dayOfWeek = convertToMondayFirstDay(jsDay);
      const isEndOfWeek = dayOfWeek === 6;
      
      return isEndOfWeek ? 
        `Your total spending for this week is ${formatCurrency(predictedTotal)}.` :
        `Based on your spending history, you are predicted to spend an additional ${formatCurrency(expectedAdditionalSpending)} by the end of the week (${formatCurrency(predictedTotal)} total).`;
        
    } else if (timePeriod === 'year') {
      const currentMonth = today.getMonth();
      const isEndOfYear = currentMonth === 11;
      
      return isEndOfYear ? 
        `Your total spending for this year is ${formatCurrency(predictedTotal)}.` :
        `Based on your spending pattern, you are predicted to spend an additional ${formatCurrency(expectedAdditionalSpending)} by the end of the year (${formatCurrency(predictedTotal)} total).`;
        
    } else {
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const isLastDayOfMonth = today.getDate() === lastDayOfMonth;
      
      return isLastDayOfMonth ? 
        `Your total spending for this month is ${formatCurrency(predictedTotal)}.` :
        `Based on your spending pattern, we predict that you'll spend an additional ${formatCurrency(expectedAdditionalSpending)} by the end of the month (${formatCurrency(predictedTotal)} total).`;
    }
  };

  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: theme.colors.gray }]}>
        No expense data available for this {timePeriod}.
      </Text>
    );
  }

  return (
    <View style={styles.chartContainer}>
      <CustomLineChart
        data={chartData}
        width={screenWidth - 40}
        height={240}
        theme={theme}
        isDarkMode={isDarkMode}
      />
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4361EE' }]} />
          <Text style={{ color: theme.colors.text }}>Actual Expenses</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ACBBF7' }]} />
          <Text style={{ color: theme.colors.text }}>Predicted Expenses</Text>
        </View>
      </View>
      
      <Text style={[styles.chartDescription, { color: theme.colors.gray }]}>
        {getExpenseInsight()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  emptyText: {
    textAlign: 'center',
    padding: 15,
  },
  chartDescription: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    color: '#8D9093',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
});