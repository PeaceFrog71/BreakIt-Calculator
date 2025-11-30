# Help button appears oval instead of circular

**Labels:** bug

## Bug Description
The help button in the header is appearing oval (horizontally stretched) instead of perfectly circular.

## Current Behavior
- Help button has egg shape (wider horizontally than vertically)
- Despite having proper CSS constraints applied

## Expected Behavior
- Help button should be perfectly circular

## Technical Details
- **Location:** `src/App.css` lines 84-105
- **Current styles:**
  - `width: 44px`
  - `height: 44px`
  - `min-width: 44px`
  - `max-width: 44px`
  - `border-radius: 50%`
  - `flex-shrink: 0`
- Grid layout may be causing stretching despite size constraints
- Current grid: `grid-template-columns: 1fr auto 1fr`

## Possible Solutions
1. Add `aspect-ratio: 1 / 1` CSS property
2. Use absolute positioning instead of grid
3. Wrap button in a fixed-size container
4. Add `min-height: 44px` and `max-height: 44px`

## Additional Context
The button has proper width constraints but the grid layout appears to be stretching it horizontally. The issue persists even with `flex-shrink: 0` applied.
