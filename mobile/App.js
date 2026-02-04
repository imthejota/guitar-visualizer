import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScalesScreen } from './src/screens/ScalesScreen';
import { TriadsScreen } from './src/screens/TriadsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

// Use Ionicons logic or simple text tabs
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: '#1e1e1e',
            borderTopColor: '#333',
          },
          tabBarActiveTintColor: '#bb86fc',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Scales') {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            } else if (route.name === 'Triads') {
              iconName = focused ? 'apps' : 'apps-outline';
            }

            // You can return any component that you like here!
            // We'll rely on Expo's default Ionicons availability or just text if icon fails, 
            // but Expo usually has vector-icons installed by default in blank template properly? 
            // Actually blank template might not have it. Let's install it to be safe or use text.
            // Better to assume text for safety or add install step. 
            // We installed `react-native-vector-icons`? NO. 
            // Expo wrapper usually has it. Let's try.
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Scales" component={ScalesScreen} />
        <Tab.Screen name="Triads" component={TriadsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
