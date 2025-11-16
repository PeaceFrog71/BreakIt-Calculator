import type { MiningConfiguration, Ship, MiningGroup, ShipInstance } from '../types';

const STORAGE_KEY = 'rock-breaker-configs';
const CURRENT_CONFIG_KEY = 'rock-breaker-current';
const MINING_GROUPS_KEY = 'rock-breaker-mining-groups';
const SHIP_POOL_KEY = 'rock-breaker-ship-pool';

export interface SavedConfiguration {
  id: string;
  name: string;
  ship: Ship;
  config: MiningConfiguration;
  createdAt: number;
  updatedAt: number;
}

export interface SavedMiningGroup {
  id: string;
  name: string;
  miningGroup: MiningGroup;
  createdAt: number;
  updatedAt: number;
}

export interface SavedShipInstance {
  id: string;
  name: string;
  shipInstance: ShipInstance;
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all saved configurations
 */
export function getSavedConfigurations(): SavedConfiguration[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved configurations:', error);
    return [];
  }
}

/**
 * Save a new configuration
 */
export function saveConfiguration(
  name: string,
  ship: Ship,
  config: MiningConfiguration
): SavedConfiguration {
  const configs = getSavedConfigurations();

  const newConfig: SavedConfiguration = {
    id: Date.now().toString(),
    name,
    ship,
    config,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  configs.push(newConfig);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));

  return newConfig;
}

/**
 * Update an existing configuration
 */
export function updateConfiguration(
  id: string,
  name: string,
  ship: Ship,
  config: MiningConfiguration
): SavedConfiguration | null {
  const configs = getSavedConfigurations();
  const index = configs.findIndex((c) => c.id === id);

  if (index === -1) return null;

  configs[index] = {
    ...configs[index],
    name,
    ship,
    config,
    updatedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  return configs[index];
}

/**
 * Delete a configuration
 */
export function deleteConfiguration(id: string): boolean {
  const configs = getSavedConfigurations();
  const filtered = configs.filter((c) => c.id !== id);

  if (filtered.length === configs.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Load a configuration by ID
 */
export function loadConfiguration(id: string): SavedConfiguration | null {
  const configs = getSavedConfigurations();
  return configs.find((c) => c.id === id) || null;
}

/**
 * Save current configuration (auto-save)
 */
export function saveCurrentConfiguration(ship: Ship, config: MiningConfiguration): void {
  try {
    const data = {
      ship,
      config,
      timestamp: Date.now(),
    };
    localStorage.setItem(CURRENT_CONFIG_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving current configuration:', error);
  }
}

/**
 * Load current configuration (auto-save)
 */
export function loadCurrentConfiguration(): { ship: Ship; config: MiningConfiguration } | null {
  try {
    const data = localStorage.getItem(CURRENT_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading current configuration:', error);
    return null;
  }
}

/**
 * Export configuration as JSON file
 */
export function exportConfiguration(savedConfig: SavedConfiguration): void {
  const dataStr = JSON.stringify(savedConfig, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${savedConfig.name.replace(/[^a-z0-9]/gi, '_')}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import configuration from JSON file
 */
export function importConfiguration(file: File): Promise<SavedConfiguration> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const newConfig = saveConfiguration(
          imported.name || 'Imported Config',
          imported.ship,
          imported.config
        );
        resolve(newConfig);
      } catch (error) {
        reject(new Error('Invalid configuration file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ===== MINING GROUP STORAGE =====

/**
 * Get all saved mining groups
 */
export function getSavedMiningGroups(): SavedMiningGroup[] {
  try {
    const data = localStorage.getItem(MINING_GROUPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved mining groups:', error);
    return [];
  }
}

/**
 * Save a new mining group
 */
export function saveMiningGroup(name: string, miningGroup: MiningGroup): SavedMiningGroup {
  const groups = getSavedMiningGroups();

  const newGroup: SavedMiningGroup = {
    id: Date.now().toString(),
    name,
    miningGroup,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  groups.push(newGroup);
  localStorage.setItem(MINING_GROUPS_KEY, JSON.stringify(groups));

  return newGroup;
}

/**
 * Update an existing mining group
 */
export function updateMiningGroup(
  id: string,
  name: string,
  miningGroup: MiningGroup
): SavedMiningGroup | null {
  const groups = getSavedMiningGroups();
  const index = groups.findIndex((g) => g.id === id);

  if (index === -1) return null;

  groups[index] = {
    ...groups[index],
    name,
    miningGroup,
    updatedAt: Date.now(),
  };

  localStorage.setItem(MINING_GROUPS_KEY, JSON.stringify(groups));
  return groups[index];
}

/**
 * Delete a mining group
 */
export function deleteMiningGroup(id: string): boolean {
  const groups = getSavedMiningGroups();
  const filtered = groups.filter((g) => g.id !== id);

  if (filtered.length === groups.length) return false;

  localStorage.setItem(MINING_GROUPS_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Load a mining group by ID
 */
export function loadMiningGroup(id: string): SavedMiningGroup | null {
  const groups = getSavedMiningGroups();
  return groups.find((g) => g.id === id) || null;
}

// ===== SHIP POOL STORAGE =====

/**
 * Get all saved ship instances
 */
export function getSavedShipInstances(): SavedShipInstance[] {
  try {
    const data = localStorage.getItem(SHIP_POOL_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved ship instances:', error);
    return [];
  }
}

/**
 * Save a new ship instance
 */
export function saveShipInstance(name: string, shipInstance: ShipInstance): SavedShipInstance {
  const ships = getSavedShipInstances();

  const newShip: SavedShipInstance = {
    id: Date.now().toString(),
    name,
    shipInstance,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  ships.push(newShip);
  localStorage.setItem(SHIP_POOL_KEY, JSON.stringify(ships));

  return newShip;
}

/**
 * Update an existing ship instance
 */
export function updateShipInstance(
  id: string,
  name: string,
  shipInstance: ShipInstance
): SavedShipInstance | null {
  const ships = getSavedShipInstances();
  const index = ships.findIndex((s) => s.id === id);

  if (index === -1) return null;

  ships[index] = {
    ...ships[index],
    name,
    shipInstance,
    updatedAt: Date.now(),
  };

  localStorage.setItem(SHIP_POOL_KEY, JSON.stringify(ships));
  return ships[index];
}

/**
 * Delete a ship instance
 */
export function deleteShipInstance(id: string): boolean {
  const ships = getSavedShipInstances();
  const filtered = ships.filter((s) => s.id !== id);

  if (filtered.length === ships.length) return false;

  localStorage.setItem(SHIP_POOL_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Load a ship instance by ID
 */
export function loadShipInstance(id: string): SavedShipInstance | null {
  const ships = getSavedShipInstances();
  return ships.find((s) => s.id === id) || null;
}
