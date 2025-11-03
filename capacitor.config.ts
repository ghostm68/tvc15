import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tvc15',
  appName: 'tvc15',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['inkrealm.info'],
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0D0D0D',
    useLegacyBridge: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#0D0D0D',
      showSpinner: false,
    },
  },
};

export default config;
