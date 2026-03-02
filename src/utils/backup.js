// src/utils/backup.js
import { Capacitor } from '@capacitor/core';

// We use dynamic imports or check availability to prevent Vite from crashing 
// if the native platform isn't fully initialized yet
let Filesystem, Directory, Encoding, Share;

if (Capacitor.isNativePlatform()) {
    // Dynamic import to avoid build-time errors in browser-only environments
    import('@capacitor/filesystem').then(m => {
        Filesystem = m.Filesystem;
        Directory = m.Directory;
        Encoding = m.Encoding;
    });
    import('@capacitor/share').then(m => {
        Share = m.Share;
    });
}

export const exportData = async () => {
  const data = {};
  
  // 🔴 ADDED 'coinsave_cards' to the backup keys array
  const keys = [
    'coinsave_transactions', 
    'coinsave_wealth', 
    'coinsave_remittances', 
    'coinsave_upcoming', 
    'coinsave_loans', 
    'coinsave_pin',
    'coinsave_cards' 
  ];

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    // Only parse if the value is valid JSON, otherwise save the raw string (like the PIN)
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        data[key] = value; 
      }
    }
  });

  const jsonString = JSON.stringify(data, null, 2);
  const fileName = `coinsave_backup.json`;

  if (Capacitor.isNativePlatform()) {
    try {
      // Ensure plugins are loaded before using
      const { Filesystem: FS, Directory: DIR, Encoding: ENC } = await import('@capacitor/filesystem');
      const { Share: SH } = await import('@capacitor/share');

      const result = await FS.writeFile({
        path: fileName,
        data: jsonString,
        directory: DIR.Cache,
        encoding: ENC.UTF8,
      });

      await SH.share({
        title: 'CoinSave Backup',
        url: result.uri,
      });
    } catch (error) {
      console.error("Backup failed", error);
      alert("Permission denied or storage full.");
    }
  } else {
    // Standard Browser Download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coinsave_web_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export const importData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Automatically iterates through all keys in the backup, including cards
      Object.keys(data).forEach(key => {
        const val = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
        localStorage.setItem(key, val);
      });
      callback(true);
    } catch (err) {
      console.error("Import failed", err);
      callback(false);
    }
  };
  reader.readAsText(file);
};