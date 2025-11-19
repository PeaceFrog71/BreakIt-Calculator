import type { Gadget } from '../types';
import { GADGETS } from '../types';
import './GadgetSelector.css';

interface GadgetSelectorProps {
  gadgets: (Gadget | null)[];
  onChange: (gadgets: (Gadget | null)[]) => void;
  gadgetCount: number;
  onGadgetCountChange: (count: number) => void;
}

export default function GadgetSelector({ gadgets, onChange, gadgetCount, onGadgetCountChange }: GadgetSelectorProps) {
  const handleGadgetChange = (index: number, gadgetId: string) => {
    const gadget = GADGETS.find((g) => g.id === gadgetId) || null;
    const newGadgets = [...gadgets];
    newGadgets[index] = gadget;
    onChange(newGadgets);
  };

  const handleCountChange = (newCount: number) => {
    const count = Math.max(1, Math.min(6, newCount)); // Clamp between 1 and 6
    onGadgetCountChange(count);

    // Adjust gadgets array size
    const newGadgets = [...gadgets];
    if (count > gadgets.length) {
      // Add null gadgets
      while (newGadgets.length < count) {
        newGadgets.push(null);
      }
    } else if (count < gadgets.length) {
      // Remove excess gadgets
      newGadgets.splice(count);
    }
    onChange(newGadgets);
  };

  return (
    <div className="gadget-selector panel">
      <div className="gadget-header">
        <h2>Gadgets (Consumables)</h2>
        <div className="gadget-count-selector">
          <label>Count:</label>
          <input
            type="number"
            value={gadgetCount}
            onChange={(e) => handleCountChange(parseInt(e.target.value) || 3)}
            min="1"
            max="6"
            className="gadget-count-input"
          />
        </div>
      </div>
      {Array.from({ length: gadgetCount }).map((_, index) => (
        <div key={index} className="form-group">
          <label>Gadget {index + 1}:</label>
          <select
            value={gadgets[index]?.id || 'none'}
            onChange={(e) => handleGadgetChange(index, e.target.value)}
          >
            {GADGETS.map((gadget) => (
              <option key={gadget.id} value={gadget.id}>
                {gadget.name}
                {gadget.resistModifier !== 1 ? ` (${gadget.resistModifier}x resist)` : ''}
              </option>
            ))}
          </select>
          {gadgets[index] && gadgets[index]!.id !== 'none' && (
            <div className="gadget-description">{gadgets[index]!.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
