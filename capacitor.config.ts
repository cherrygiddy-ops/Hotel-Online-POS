import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onlinePos',
  appName: 'Online POS',
  server: {
    url: 'https://steak.hotelpos.top/',
    cleartext: false
  }
};

export default config;

