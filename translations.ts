
import { Language } from './types';

export const translations = {
  it: {
    nav: {
      deployment: 'Distribuzione',
      telemetry: 'Telemetria',
      signOut: 'Disconnetti',
      activeRelay: 'Relay Attivo'
    },
    auth: {
      title: 'RelaySync',
      subtitle: 'Autorizzazione Interfaccia Comando',
      emailLabel: 'Handle Email',
      passLabel: 'Chiave di Accesso',
      loginBtn: 'Inizia Collegamento',
      registerBtn: 'Registra Nodo',
      requestAccess: 'Richiedi Nuovo Accesso',
      existingNode: 'Nodo Esistente? Sincronizza',
      verificationSent: 'Link di verifica inviato alla tua email.',
      footer: 'Protocollo Controllo Nexus • v3.1.0'
    },
    upload: {
      statusSuccess: 'Relay di distribuzione completato.',
      statusError: 'Protocollo di distribuzione fallito.',
      statusRequired: 'Asset e target di distribuzione richiesti.',
      mediaSource: 'Sorgente Media',
      selectFile: 'Seleziona File',
      replaceFile: 'Sostituisci File',
      opLogic: 'Logica Operativa',
      missionIntent: 'Obiettivo Missione',
      missionPlaceholder: 'Descrizione operativa...',
      captionHooks: 'Caption e Hook',
      captionPlaceholder: 'Testo suggerito e hashtag...',
      targetGrid: 'Griglia Target',
      noTarget: 'Nessun Target Selezionato',
      accountTarget: 'Account Target',
      relayFormat: 'Formato Relay',
      relayActive: 'Relay Attivo',
      syncing: 'Sincronizzazione...',
      executeLaunch: 'Esegui Lancio'
    },
    analytics: {
      systemTelemetry: 'Telemetria di Sistema • Sessione Attiva',
      intelBrief: 'Rapporto Intelligence',
      subtitle: 'Metriche in tempo reale e log operativi.',
      currentCycle: 'Ciclo Corrente',
      allTimeRelay: 'Relay Totali',
      integrity: 'Integrità Rete',
      platformDist: 'Distribuzione Piattaforme',
      liveLogs: 'Log in Tempo Reale',
      logEmpty: 'Cache Log Vuota',
      syncingTelemetry: 'Sincronizzazione Telemetria...'
    }
  },
  en: {
    nav: {
      deployment: 'Deployment',
      telemetry: 'Telemetry',
      signOut: 'Sign Out',
      activeRelay: 'Active Relay'
    },
    auth: {
      title: 'RelaySync',
      subtitle: 'Command Interface Authorization',
      emailLabel: 'Email Handle',
      passLabel: 'Access Key',
      loginBtn: 'Initiate Link',
      registerBtn: 'Register Node',
      requestAccess: 'Request New Access',
      existingNode: 'Existing Node? Sync',
      verificationSent: 'Verification link sent to your email.',
      footer: 'Nexus Control Protocol • v3.1.0'
    },
    upload: {
      statusSuccess: 'Deployment relay successful.',
      statusError: 'Deployment protocol failed.',
      statusRequired: 'Asset and deployment target required.',
      mediaSource: 'Media Source',
      selectFile: 'Select File',
      replaceFile: 'Replace File',
      opLogic: 'Operational Logic',
      missionIntent: 'Mission Intent',
      missionPlaceholder: 'Operational description...',
      captionHooks: 'Caption & Hooks',
      captionPlaceholder: 'Suggested text and hashtags...',
      targetGrid: 'Target Grid',
      noTarget: 'No Target Selected',
      accountTarget: 'Account Target',
      relayFormat: 'Relay Format',
      relayActive: 'Relay Active',
      syncing: 'Syncing...',
      executeLaunch: 'Execute Launch'
    },
    analytics: {
      systemTelemetry: 'System Telemetry • Session Active',
      intelBrief: 'Intelligence Brief',
      subtitle: 'Real-time performance metrics and operational logs.',
      currentCycle: 'Current Cycle',
      allTimeRelay: 'All-Time Relay',
      integrity: 'Network Integrity',
      platformDist: 'Platform Distribution',
      liveLogs: 'Live Logs',
      logEmpty: 'Log Cache Empty',
      syncingTelemetry: 'Syncing Telemetry...'
    }
  }
};
