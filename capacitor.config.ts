import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onlinepos',
  appName: 'Online Hotel POS',
  server: {
    url: 'https://steak.hotelpos.top/',
    cleartext: false
  }
};

export default config;
