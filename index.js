import { registerRootComponent } from 'expo';
import { NativeWindStyleSheet } from 'nativewind';
import App from './App';

NativeWindStyleSheet.begin();

registerRootComponent(App);
