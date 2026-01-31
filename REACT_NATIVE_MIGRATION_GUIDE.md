# React Native Migration Guide - ChandlaBook App

## Project Overview
ChandlaBook is a guest management and expense tracking application for events. This guide provides complete documentation for migrating from React web app to React Native.

## Current React App Analysis

### Tech Stack
- **Frontend**: React 19.2.0 + TypeScript + Vite
- **Styling**: TailwindCSS + Bootstrap
- **State Management**: Context API (AuthContext)
- **Navigation**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: React Icons, React Hot Toast
- **PDF Generation**: jsPDF, html2canvas

### Current Folder Structure
```
chandlabook-fe/
├── src/
│   ├── assets/
│   │   ├── image/
│   │   │   └── hederimage.png
│   │   └── react.svg
│   ├── components/
│   │   ├── ui/
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── PaginatedSearchSelect.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── InvitationCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── SplashScreen.tsx
│   ├── config/
│   │   └── Global.json
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useApi.ts
│   ├── layouts/
│   │   └── AppLayout.tsx
│   ├── pages/
│   │   ├── AddExpense.tsx
│   │   ├── AddRecord.tsx
│   │   ├── CreateEvent.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EventsList.tsx
│   │   ├── ExpenseManagement.tsx
│   │   ├── ExpenseManager.tsx
│   │   ├── GuestHistory.tsx
│   │   ├── GuestList.tsx
│   │   ├── GuestRecords.tsx
│   │   ├── Home.tsx
│   │   ├── InvitationGenerator.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Signup.tsx
│   │   └── ViewExpenses.tsx
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── helper.ts
│       ├── sweetAlert.ts
│       ├── textUtils.ts
│       └── validation.ts
```

## React Native Migration Plan

### 1. React Native Project Setup

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native init ChandlaBookRN --template react-native-template-typescript

# Navigate to project
cd ChandlaBookRN
```

### 2. Required Dependencies

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "react-native-screens": "^3.22.1",
    "react-native-safe-area-context": "^4.7.1",
    "react-native-gesture-handler": "^2.12.1",
    "axios": "^1.13.2",
    "react-native-async-storage": "^1.19.1",
    "react-native-vector-icons": "^10.0.0",
    "react-native-toast-message": "^2.1.6",
    "react-native-paper": "^5.9.1",
    "react-native-date-picker": "^4.2.13",
    "react-native-image-picker": "^5.6.0",
    "react-native-pdf": "^6.7.3",
    "react-native-share": "^9.4.1",
    "react-native-print": "^0.8.0",
    "@react-native-jwt/core": "^2.1.2"
  }
}
```

### 3. React Native Folder Structure

```
ChandlaBookRN/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── header-image.png
│   │   │   ├── logo.png
│   │   │   └── splash-bg.png
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Header.tsx
│   │   ├── ui/
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── PaginatedSelect.tsx
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   ├── InvitationCard.tsx
│   │   └── SplashScreen.tsx
│   ├── config/
│   │   ├── global.json
│   │   ├── api.ts
│   │   └── constants.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   └── useStorage.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── events/
│   │   │   ├── CreateEventScreen.tsx
│   │   │   ├── EventsListScreen.tsx
│   │   │   ├── EventDetailsScreen.tsx
│   │   │   └── InvitationScreen.tsx
│   │   ├── guests/
│   │   │   ├── AddRecordScreen.tsx
│   │   │   ├── GuestHistoryScreen.tsx
│   │   │   ├── GuestListScreen.tsx
│   │   │   └── GuestRecordsScreen.tsx
│   │   └── expenses/
│   │       ├── AddExpenseScreen.tsx
│   │       ├── ExpenseManagementScreen.tsx
│   │       ├── ExpenseManagerScreen.tsx
│   │       └── ViewExpensesScreen.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── pdf.ts
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── spacing.ts
│   │   └── globalStyles.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── common.ts
│   └── utils/
│       ├── helper.ts
│       ├── validation.ts
│       ├── dateUtils.ts
│       └── formatters.ts
├── android/
├── ios/
└── App.tsx
```

## 4. Main App.tsx File

```typescript
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor="#ffffff" 
            translucent={false}
          />
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
```

### App.tsx Key Features:
- **GestureHandlerRootView**: Required for react-native-gesture-handler
- **SafeAreaProvider**: Handles safe area insets for different devices
- **AuthProvider**: Wraps entire app with authentication context
- **StatusBar**: Configures status bar appearance
- **AppNavigator**: Main navigation component
- **Toast**: Global toast notifications

### Alternative App.tsx with Error Boundary:

```typescript
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar 
              barStyle="dark-content" 
              backgroundColor="#ffffff" 
              translucent={false}
            />
            <AppNavigator />
            <Toast />
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
```

## 5. Global Configuration (global.json)

```json
{
  "api": {
    "host": "http://10.183.88.74:8000",
    "endpoints": {
      "auth": {
        "token": "/auth/token/",
        "refreshToken": "/auth/token/refresh/",
        "passwordReset": "/api/v1/passwordReset/",
        "changePassword": "/api/v1/changeMyPassword/",
        "passReset": "/auth/pass-reset/",
        "sendOtp": "/api/v1/sendOtp/",
        "verifyOtp": "/api/v1/verifyOtp/"
      },
      "user": {
        "profile": "/api/v1/userProfile/",
        "create": "/api/v1/createUser/",
        "update": "/api/v1/user/"
      },
      "guests": {
        "list": "/api/v1/guest/",
        "records": "/api/v1/guestRecord/",
        "today": "/api/v1/guestRecord/today/",
        "upcoming": "/api/v1/guestRecord/upcoming/"
      },
      "events": {
        "list": "/api/v1/events/",
        "create": "/api/v1/events/",
        "update": "/api/v1/events/",
        "delete": "/api/v1/events/"
      },
      "dashboard": "/api/v1/dashboard/",
      "expenses": "/api/v1/expense/"
    }
  },
  "app": {
    "name": "ChandlaBook",
    "version": "1.0.0",
    "theme": {
      "primaryColor": "#dc3545",
      "secondaryColor": "#6c757d",
      "successColor": "#28a745",
      "warningColor": "#ffc107",
      "dangerColor": "#dc3545",
      "infoColor": "#17a2b8"
    }
  }
}
```

## 5. Screen Components Migration

### 5.1 Authentication Screens

#### LoginScreen.tsx
```typescript
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { globalStyles } from '../../styles/globalStyles';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      await loginUser(username, password);
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#dc3545',
    fontSize: 16,
  },
});

export default LoginScreen;
```

#### SignupScreen.tsx
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useApi } from '../../hooks/useApi';

const SignupScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { Post } = useApi();

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await Post('createUser', {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      });
      Alert.alert('Success', 'Account created successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({...formData, username: text})}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(text) => setFormData({...formData, firstName: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(text) => setFormData({...formData, lastName: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#dc3545',
    fontSize: 16,
  },
});

export default SignupScreen;
```

### 5.2 Dashboard Screen

#### DashboardScreen.tsx
```typescript
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import DashboardCard from '../../components/ui/DashboardCard';

interface DashboardSummary {
  total_events: number;
  total_guests: number;
  total_records: number;
  total_amount: number;
  aavel_total: number;
  mukel_total: number;
  difference: number;
}

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useContext(AuthContext);
  const { Get } = useApi();
  const [summary, setSummary] = useState<DashboardSummary>({
    total_events: 0,
    total_guests: 0,
    total_records: 0,
    total_amount: 0,
    aavel_total: 0,
    mukel_total: 0,
    difference: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await Get('dashboard');
      setSummary({
        total_events: response?.total_events || 0,
        total_guests: response?.total_guests || 0,
        total_records: response?.total_records || 0,
        total_amount: response?.total_amount || 0,
        aavel_total: response?.aavel_total || 0,
        mukel_total: response?.mukel_total || 0,
        difference: response?.difference || 0,
      });
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const quickActions = [
    {
      icon: 'add',
      label: 'New Entry',
      color: '#dc3545',
      onPress: () => navigation.navigate('AddRecord'),
    },
    {
      icon: 'people',
      label: 'Guest Record',
      color: '#007bff',
      onPress: () => navigation.navigate('GuestHistory'),
    },
    {
      icon: 'event',
      label: 'Add Event',
      color: '#ffc107',
      onPress: () => navigation.navigate('CreateEvent'),
    },
    {
      icon: 'calendar-today',
      label: 'View Events',
      color: '#17a2b8',
      onPress: () => navigation.navigate('EventsList'),
    },
    {
      icon: 'mail',
      label: 'Invitations',
      color: '#28a745',
      onPress: () => navigation.navigate('EventsList'),
    },
    {
      icon: 'attach-money',
      label: 'Expenses',
      color: '#ffc107',
      onPress: () => navigation.navigate('ViewExpenses'),
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileText}>
            {user?.first_name?.charAt(0) || 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ACTIVE EVENTS</Text>
            <Text style={styles.summaryValue}>
              {loading ? '--' : summary.total_events}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL GUESTS</Text>
            <Text style={styles.summaryValue}>
              {loading ? '--' : summary.total_guests}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <DashboardCard
              key={index}
              icon={action.icon}
              label={action.label}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#dc3545',
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default DashboardScreen;
```

### 5.3 Navigation Setup

#### AppNavigator.tsx
```typescript
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import SplashScreen from '../components/SplashScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

#### TabNavigator.tsx
```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import EventsListScreen from '../screens/events/EventsListScreen';
import GuestHistoryScreen from '../screens/guests/GuestHistoryScreen';
import ViewExpensesScreen from '../screens/expenses/ViewExpensesScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

// Stack Screens
import CreateEventScreen from '../screens/events/CreateEventScreen';
import AddRecordScreen from '../screens/guests/AddRecordScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    <Stack.Screen name="AddRecord" component={AddRecordScreen} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
  </Stack.Navigator>
);

const EventsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EventsList" component={EventsListScreen} />
    <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
  </Stack.Navigator>
);

const GuestsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="GuestHistory" component={GuestHistoryScreen} />
    <Stack.Screen name="AddRecord" component={AddRecordScreen} />
  </Stack.Navigator>
);

const ExpensesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ViewExpenses" component={ViewExpensesScreen} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'dashboard';
              break;
            case 'Events':
              iconName = 'event';
              break;
            case 'Guests':
              iconName = 'people';
              break;
            case 'Expenses':
              iconName = 'attach-money';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc3545',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardStack} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Guests" component={GuestsStack} />
      <Tab.Screen name="Expenses" component={ExpensesStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
```

## 6. Context and State Management

### AuthContext.tsx (React Native Version)
```typescript
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from '@react-native-jwt/core';
import Toast from 'react-native-toast-message';
import { useApi } from '../hooks/useApi';

interface AuthToken {
  access: string;
  refresh: string;
}

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User;
  authToken: AuthToken | null;
  isAuthenticated: boolean;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logOutUser: (message?: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | any>(undefined);

export default AuthContext;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [user, setUser] = useState<User>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { Post } = useApi();

  const loginUser = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await Post('token', { username, password });
      const tokenData: AuthToken = response.data;

      let decoded: any = {};
      try {
        decoded = jwtDecode(tokenData.access);
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Invalid token received',
        });
        return false;
      }

      setAuthToken(tokenData);
      setUser(decoded);
      setIsAuthenticated(true);

      await AsyncStorage.setItem('authToken', JSON.stringify(tokenData));
      await AsyncStorage.setItem('user', JSON.stringify(decoded));

      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        text2: 'Welcome back!',
      });

      return true;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error.response?.data?.message || 'Please try again',
      });
      return false;
    }
  };

  const logOutUser = async (message?: string) => {
    setAuthToken(null);
    setUser({});
    setIsAuthenticated(false);

    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');

    if (message) {
      Toast.show({
        type: 'error',
        text1: message,
      });
    }
  };

  const initializeAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        const tokenData: AuthToken = JSON.parse(storedToken);
        const userData: User = JSON.parse(storedUser);

        // Check if token is expired
        const decoded: any = jwtDecode(tokenData.access);
        if (decoded.exp * 1000 > Date.now()) {
          setAuthToken(tokenData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          await logOutUser('Session expired');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated,
        loginUser,
        logOutUser,
        loading,
      }}
    >
      {children}
      <Toast />
    </AuthContext.Provider>
  );
};
```

## 7. API Service Layer

### api.ts
```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalConfig from '../config/global.json';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: globalConfig.api.host,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const tokenData = JSON.parse(token);
          config.headers.Authorization = `Bearer ${tokenData.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint: string, params?: any): Promise<any> {
    const response: AxiosResponse = await this.api.get(
      globalConfig.api.endpoints[endpoint] || endpoint,
      { params }
    );
    return response.data;
  }

  async post(endpoint: string, data?: any): Promise<any> {
    const response: AxiosResponse = await this.api.post(
      globalConfig.api.endpoints[endpoint] || endpoint,
      data
    );
    return response.data;
  }

  async put(endpoint: string, data?: any): Promise<any> {
    const response: AxiosResponse = await this.api.put(
      globalConfig.api.endpoints[endpoint] || endpoint,
      data
    );
    return response.data;
  }

  async delete(endpoint: string): Promise<any> {
    const response: AxiosResponse = await this.api.delete(
      globalConfig.api.endpoints[endpoint] || endpoint
    );
    return response.data;
  }
}

export default new ApiService();
```

## 8. useApi Hook for React Native

### src/hooks/useApi.ts
```typescript
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import globalConfig from '../config/global.json';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T = any> {
  data: T[];
  count: number;
  next: string | null;
  previous: string | null;
  nextPage?: number;
  previousPage?: number;
}

interface UseApiReturn {
  loading: boolean;
  error: string | null;
  Get: (endpoint: string, id?: string | number, params?: any) => Promise<any>;
  Post: (endpoint: string, data?: any) => Promise<any>;
  Put: (endpoint: string, data?: any, id?: string | number) => Promise<any>;
  Delete: (endpoint: string, id?: string | number) => Promise<any>;
  GetPaginatedData: (endpoint: string, params?: any) => Promise<PaginatedResponse>;
}

const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get API URL from global config
  const getApiUrl = (endpoint: string): string => {
    const baseUrl = globalConfig.api.host;
    
    // Check if endpoint exists in global config
    const endpointPath = globalConfig.api.endpoints?.[endpoint as keyof typeof globalConfig.api.endpoints];
    
    if (endpointPath) {
      return `${baseUrl}${endpointPath}`;
    }
    
    // If not found in config, use endpoint as is
    return endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  };

  // Get auth token from AsyncStorage
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const tokenData = await AsyncStorage.getItem('authToken');
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        return parsed.access;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return null;
  };

  // Create axios instance with auth headers
  const createAxiosConfig = async (additionalHeaders?: any) => {
    const token = await getAuthToken();
    const headers: any = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return { headers };
  };

  // Handle API errors
  const handleError = (error: any, showToast = true) => {
    let errorMessage = 'An error occurred';
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || error.response.data?.detail || `Error: ${error.response.status}`;
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        AsyncStorage.removeItem('authToken');
        AsyncStorage.removeItem('user');
        errorMessage = 'Session expired. Please login again.';
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Other error
      errorMessage = error.message || 'Something went wrong';
    }

    setError(errorMessage);
    
    if (showToast) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
    
    throw error;
  };

  // GET request
  const Get = async (endpoint: string, id?: string | number, params?: any): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = id ? `${getApiUrl(endpoint)}${id}/` : getApiUrl(endpoint);
      const config = await createAxiosConfig();
      
      const response: AxiosResponse = await axios.get(url, {
        ...config,
        params,
      });
      
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // POST request
  const Post = async (endpoint: string, data?: any): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = getApiUrl(endpoint);
      const config = await createAxiosConfig();
      
      const response: AxiosResponse = await axios.post(url, data, config);
      
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // PUT request
  const Put = async (endpoint: string, data?: any, id?: string | number): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = id ? `${getApiUrl(endpoint)}${id}/` : getApiUrl(endpoint);
      const config = await createAxiosConfig();
      
      const response: AxiosResponse = await axios.put(url, data, config);
      
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE request
  const Delete = async (endpoint: string, id?: string | number): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = id ? `${getApiUrl(endpoint)}${id}/` : getApiUrl(endpoint);
      const config = await createAxiosConfig();
      
      const response: AxiosResponse = await axios.delete(url, config);
      
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // GET paginated data
  const GetPaginatedData = async (endpoint: string, params?: any): Promise<PaginatedResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = getApiUrl(endpoint);
      const config = await createAxiosConfig();
      
      const response: AxiosResponse = await axios.get(url, {
        ...config,
        params,
      });
      
      const { results, count, next, previous } = response.data;
      
      // Extract page numbers from URLs
      const getPageFromUrl = (url: string | null): number | undefined => {
        if (!url) return undefined;
        const match = url.match(/[?&]page=(\d+)/);
        return match ? parseInt(match[1], 10) : undefined;
      };
      
      return {
        data: results || response.data,
        count: count || 0,
        next,
        previous,
        nextPage: getPageFromUrl(next),
        previousPage: getPageFromUrl(previous),
      };
    } catch (error) {
      handleError(error);
      return {
        data: [],
        count: 0,
        next: null,
        previous: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    Get,
    Post,
    Put,
    Delete,
    GetPaginatedData,
  };
};

export default useApi;
```

### useApi Hook Usage Examples

#### Basic Usage in Component
```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import useApi from '../hooks/useApi';

const EventsScreen = () => {
  const { Get, Post, Delete, loading, error } = useApi();
  const [events, setEvents] = useState([]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await Get('events');
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const newEvent = await Post('events', eventData);
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await Delete('events', eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteEvent(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
```

#### Paginated Data Usage
```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import useApi from '../hooks/useApi';

const GuestHistoryScreen = () => {
  const { GetPaginatedData, loading } = useApi();
  const [guests, setGuests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async (pageNum = 1, append = false) => {
    try {
      const result = await GetPaginatedData('guestRecord', { page: pageNum });
      
      if (append) {
        setGuests(prev => [...prev, ...result.data]);
      } else {
        setGuests(result.data);
      }
      
      setHasMore(!!result.nextPage);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchGuests(page + 1, true);
    }
  };

  return (
    <FlatList
      data={guests}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.guest_name}</Text>
          <Text>{item.amount}</Text>
        </View>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        loading ? <Text>Loading more...</Text> : null
      }
    />
  );
};
```

### Key Features of useApi Hook:

1. **Automatic Token Management**: Handles JWT tokens from AsyncStorage
2. **Error Handling**: Comprehensive error handling with toast notifications
3. **Loading States**: Built-in loading state management
4. **Pagination Support**: Special method for paginated API responses
5. **Global Config Integration**: Uses endpoints from global.json
6. **TypeScript Support**: Full TypeScript interfaces and types
7. **Automatic 401 Handling**: Clears tokens on authentication errors
8. **Network Error Handling**: Handles network connectivity issuesndpoint] || endpoint
    );
    return response.data;
  }
}

export default new ApiService();
```

## 8. Styling System

### globalStyles.ts
```typescript
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#dc3545',
  secondary: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fonts.sizes.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.sizes.lg,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: fonts.sizes.md,
    color: colors.dark,
  },
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  marginTop: {
    marginTop: spacing.md,
  },
  padding: {
    padding: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
});
```

## 9. Complete Screen List

### All Screens to Implement:

1. **Authentication Screens**
   - SplashScreen.tsx
   - LoginScreen.tsx
   - SignupScreen.tsx

2. **Dashboard Screens**
   - DashboardScreen.tsx
   - ProfileScreen.tsx

3. **Event Screens**
   - CreateEventScreen.tsx
   - EventsListScreen.tsx
   - EventDetailsScreen.tsx
   - InvitationGeneratorScreen.tsx

4. **Guest Screens**
   - AddRecordScreen.tsx
   - GuestHistoryScreen.tsx
   - GuestListScreen.tsx
   - GuestRecordsScreen.tsx

5. **Expense Screens**
   - AddExpenseScreen.tsx
   - ExpenseManagementScreen.tsx
   - ExpenseManagerScreen.tsx
   - ViewExpensesScreen.tsx

## 10. Migration Checklist

### Phase 1: Setup & Core Structure
- [ ] Create React Native project
- [ ] Install required dependencies
- [ ] Setup folder structure
- [ ] Configure navigation
- [ ] Setup global configuration
- [ ] Create base styles and theme

### Phase 2: Authentication & Core Services
- [ ] Implement AuthContext
- [ ] Create API service layer
- [ ] Build authentication screens
- [ ] Setup AsyncStorage for persistence
- [ ] Implement token management

### Phase 3: Main Screens
- [ ] Dashboard screen with summary cards
- [ ] Profile screen
- [ ] Navigation setup
- [ ] Common components (cards, inputs, buttons)

### Phase 4: Feature Screens
- [ ] Event management screens
- [ ] Guest management screens
- [ ] Expense management screens
- [ ] Form components and validation

### Phase 5: Advanced Features
- [ ] PDF generation for invitations
- [ ] Image handling
- [ ] Push notifications
- [ ] Offline support
- [ ] Performance optimization

### Phase 6: Testing & Deployment
- [ ] Unit testing
- [ ] Integration testing
- [ ] Android build configuration
- [ ] iOS build configuration
- [ ] App store deployment

## 11. Key Differences from Web Version

1. **Navigation**: React Router → React Navigation
2. **Storage**: localStorage → AsyncStorage
3. **Styling**: CSS/TailwindCSS → StyleSheet
4. **Icons**: React Icons → React Native Vector Icons
5. **Alerts**: browser alerts → React Native Alert/Toast
6. **Forms**: HTML forms → React Native TextInput
7. **PDF**: html2canvas/jsPDF → react-native-pdf/react-native-print
8. **HTTP**: axios (same) but with different interceptors

This comprehensive guide provides everything needed to migrate your ChandlaBook React web app to React Native, maintaining all functionality while adapting to mobile-specific patterns and best practices.

## 12. Documentation & Resources

### 12.1 Official Documentation
- **React Native**: https://reactnative.dev/docs/getting-started
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **TypeScript Guide**: https://reactnative.dev/docs/typescript
- **Environment Setup**: https://reactnative.dev/docs/environment-setup

### 12.2 Package Documentation

#### Navigation
- **@react-navigation/native**: https://reactnavigation.org/docs/hello-react-navigation
- **@react-navigation/stack**: https://reactnavigation.org/docs/stack-navigator
- **@react-navigation/bottom-tabs**: https://reactnavigation.org/docs/bottom-tab-navigator
- **react-native-screens**: https://github.com/software-mansion/react-native-screens
- **react-native-safe-area-context**: https://github.com/th3rdwave/react-native-safe-area-context
- **react-native-gesture-handler**: https://docs.swmansion.com/react-native-gesture-handler/

#### Storage & HTTP
- **AsyncStorage**: https://react-native-async-storage.github.io/async-storage/docs/install
- **Axios**: https://axios-http.com/docs/intro

#### UI Components
- **Vector Icons**: https://github.com/oblador/react-native-vector-icons
- **Toast Message**: https://github.com/calintamas/react-native-toast-message
- **Paper**: https://callstack.github.io/react-native-paper/

#### Forms & Media
- **Date Picker**: https://github.com/henninghall/react-native-date-picker
- **Image Picker**: https://github.com/react-native-image-picker/react-native-image-picker

#### PDF & Sharing
- **PDF**: https://github.com/wonday/react-native-pdf
- **Share**: https://github.com/react-native-share/react-native-share
- **Print**: https://github.com/christopherdro/react-native-print

#### Authentication
- **JWT Core**: https://github.com/react-native-jwt/react-native-jwt

### 12.3 Setup & Deployment Guides
- **Android Setup**: https://reactnative.dev/docs/signed-apk-android
- **iOS Setup**: https://reactnative.dev/docs/publishing-to-app-store
- **Google Play Console**: https://play.google.com/console
- **App Bundle Guide**: https://developer.android.com/guide/app-bundle
- **Publishing Guide**: https://reactnative.dev/docs/signed-apk-android

### 12.4 Best Practices & Performance
- **Performance**: https://reactnative.dev/docs/performance
- **Security**: https://reactnative.dev/docs/security
- **Testing**: https://reactnative.dev/docs/testing-overview
- **Debugging**: https://reactnative.dev/docs/debugging
- **Flipper**: https://fbflipper.com/docs/getting-started/react-native/

### 12.5 Community Resources
- **React Native Directory**: https://reactnative.directory/
- **Awesome React Native**: https://github.com/jondot/awesome-react-native
- **React Native Elements**: https://reactnativeelements.com/
- **NativeBase**: https://nativebase.io/

### 12.6 Learning Resources
- **React Native Tutorial**: https://reactnative.dev/docs/tutorial
- **React Navigation Tutorial**: https://reactnavigation.org/docs/hello-react-navigation
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React Hooks**: https://reactjs.org/docs/hooks-intro.html

### 12.7 Tools & Utilities
- **React Native CLI**: https://github.com/react-native-community/cli
- **Metro Bundler**: https://facebook.github.io/metro/
- **Hermes Engine**: https://hermesengine.dev/
- **CodePush**: https://github.com/microsoft/react-native-code-push

### 12.8 Package Installation Commands

#### Core Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install axios @react-native-async-storage/async-storage
```

#### UI & Media
```bash
npm install react-native-vector-icons react-native-toast-message react-native-paper
npm install react-native-date-picker react-native-image-picker
```

#### PDF & Sharing
```bash
npm install react-native-pdf react-native-share react-native-print
```

#### Authentication
```bash
npm install @react-native-jwt/core
```

#### Development Dependencies
```bash
npm install --save-dev @types/react @types/react-native typescript
```

### 12.9 Platform Specific Setup

#### iOS Setup
```bash
cd ios && pod install
```

#### Android Setup
- Add permissions in `android/app/src/main/AndroidManifest.xml`
- Configure vector icons in `android/app/build.gradle`
- Setup signing config for release builds

### 12.10 Troubleshooting Resources
- **Common Issues**: https://reactnative.dev/docs/troubleshooting
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/react-native
- **GitHub Issues**: Check individual package repositories
- **Discord Community**: https://discord.gg/react-native

These resources provide comprehensive support for your React Native development journey from setup to deployment.