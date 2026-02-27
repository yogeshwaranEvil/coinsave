// src/utils/backup.js

export const exportData = () => {
  const data = {};
  // Collect all app-specific keys
  const keys = [
    'coinsave_transactions', 
    'coinsave_wealth', 
    'coinsave_remittances', 
    'coinsave_upcoming', 
    'coinsave_loans',
    'coinsave_pin'
  ];

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) data[key] = JSON.parse(value);
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `coinsave_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      callback(true);
    } catch (err) {
      console.error("Import failed", err);
      callback(false);
    }
  };
  reader.readAsText(file);
};