import { useState } from 'react';
import type { ShipInstance } from '../types';
import type { SavedShipInstance } from '../utils/storage';
import {
  getSavedShipInstances,
  deleteShipInstance,
  loadShipInstance,
} from '../utils/storage';
import './ConfigManager.css';

interface ShipPoolLibraryProps {
  onLoadShip: (shipInstance: ShipInstance) => void;
}

export default function ShipPoolLibrary({ onLoadShip }: ShipPoolLibraryProps) {
  const [savedShips, setSavedShips] = useState<SavedShipInstance[]>(
    getSavedShipInstances()
  );

  const handleLoad = (id: string) => {
    const ship = loadShipInstance(id);
    if (ship) {
      // Create a new ship instance with a new ID to avoid conflicts
      const newShipInstance: ShipInstance = {
        ...ship.shipInstance,
        id: `ship-${Date.now()}`,
        position: undefined, // Will be assigned when added to group
      };
      onLoadShip(newShipInstance);
      alert(`Loaded ship "${ship.name}"`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete saved ship "${name}"?`)) {
      deleteShipInstance(id);
      setSavedShips(getSavedShipInstances());
    }
  };

  return (
    <div className="config-manager panel">
      <h2>Ship Library</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
        Save ships from your mining group to reuse later. Click "Save to Library" in the ship card actions.
      </p>

      <div className="configs-list">
        {savedShips.length === 0 ? (
          <p className="empty-message">No saved ships yet</p>
        ) : (
          savedShips.map((savedShip) => (
            <div key={savedShip.id} className="config-item">
              <div className="config-info">
                <div className="config-name">{savedShip.name}</div>
                <div className="config-meta">
                  {savedShip.shipInstance.ship.name} • {savedShip.shipInstance.config.lasers.filter(l => l.laserHead && l.laserHead.id !== 'none').length}/{savedShip.shipInstance.ship.laserSlots} lasers configured
                </div>
                <div className="config-date">
                  {new Date(savedShip.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="config-buttons">
                <button
                  onClick={() => handleLoad(savedShip.id)}
                  className="btn-load"
                  title="Add to Mining Group"
                >
                  + Add
                </button>
                <button
                  onClick={() => handleDelete(savedShip.id, savedShip.name)}
                  className="btn-delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
