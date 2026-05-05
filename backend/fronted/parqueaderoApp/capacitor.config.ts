import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ucc.parqueadero',
  appName: 'Parqueadero UCC',
  webDir: 'dist',
  server: {
    // Cambiamos a http para evitar problemas de certificados SSL en desarrollo local
    androidScheme: 'http', 
    cleartext: true, // Esto permite que la app se comunique con tu servidor http://localhost:3000
    allowNavigation: ['localhost', '10.0.2.2', '192.168.*.*'] 
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
