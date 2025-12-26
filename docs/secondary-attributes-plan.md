# Secondary Mining Attributes - Planning Document

Consolidated planning for issues #11, #24, #25, #26

## Overview

Add calculations and display for three secondary mining attributes beyond power/resistance:

| Attribute | Issues | Purpose |
|-----------|--------|---------|
| **Instability** | #11, #24 | Warn miners of volatility risk |
| **Charge Window** | #25 | Show optimal zone size |
| **Charge Rate** | #26 | Show how fast the rock charges |
| **Overcharge Rate** | #26 | Show danger accumulation speed when above green |

## Current Data Foundation

All three modifiers already exist in `src/types/index.ts`:

### Lasers (LaserHead)
| Laser | Instability | Window | Rate |
|-------|-------------|--------|------|
| Pitman | 1.35 (+35%) | 1.4 (+40%) | 0.6 (-40%) |
| Arbor MH1/2 | 0.65 (-35%) | 1.4 (+40%) | - |
| Helix I/II | - | 0.6 (-40%) | - |
| Hofstede S1/2 | 1.1 (+10%) | 1.6 (+60%) | 1.2 (+20%) |
| Impact I/II | 0.9 (-10%) | 1.2 (+20%) | 0.6 (-40%) |
| Klein S1/2 | 1.35 (+35%) | 1.2 (+20%) | - |
| Lancet MH1/2 | 0.9 (-10%) | 0.4 (-60%) | 1.4 (+40%) |

### Modules with Secondary Effects
| Module | Instability | Window | Rate |
|--------|-------------|--------|------|
| Lifeline | 0.8 (-20%) | - | - |
| Optimum | 0.9 (-10%) | - | - |
| Stampede | 0.9 (-10%) | - | - |
| Surge | 1.1 (+10%) | - | - |
| Focus I/II/III | - | 1.3-1.4 | - |
| Rieger C1/2/3 | - | 0.9-0.99 | - |
| Torrent I/II/III | - | 0.9-0.99 | 1.3-1.4 |
| Torpid | - | - | 1.6 (+60%) |
| Vaux C1/2/3 | - | - | 0.8-0.95 |

### Gadgets
| Gadget | Instability | Window | Rate |
|--------|-------------|--------|------|
| BoreMax | 0.3 (-70%) | - | - |
| Okunis | - | 2.0 (+100%) | - |
| OptiMax | 0.7 (-30%) | - | - |
| Sabir | 1.15 (+15%) | 1.5 (+50%) | - |
| Stalwart | 0.65 (-35%) | 0.7 (-30%) | 1.5 (+50%) |
| Waveshift | 0.65 (-35%) | 2.0 (+100%) | 0.7 (-30%) |

## Calculation Logic

### Stacking Rules (Same as Resistance)
1. **Within a laser**: Module percentages ADD together
2. **Across lasers/ships**: Modifiers MULTIPLY together
3. **Gadgets**: MULTIPLY with equipment modifier

### Formula Pattern
```
// Per-laser calculation
laserMod = laserHead.modifier * (1 + sum(module.modifier - 1))

// Multi-ship/laser combination
totalEquipmentMod = laser1Mod * laser2Mod * ...

// Final with gadgets
totalMod = totalEquipmentMod * gadgetMod
```

### Base vs Modified Values (In-Game UI)
- **White text** = Base values (no equipment modifiers applied)
- **Green text** = Modified value is BETTER (improvement from equipment)
- **Red text** = Modified value is WORSE (penalty from equipment)

This matches the resistance behavior - users can input either base (cockpit scan) or modified (laser scan) values.

**What "better" means per attribute:**
| Attribute | Better (Green) | Worse (Red) |
|-----------|----------------|-------------|
| Resistance | Lower % | Higher % |
| Instability | Lower value | Higher value |
| Charge Window | Larger window | Smaller window |
| Charge Rate | Faster (higher) | Slower (lower) |
| Overcharge Rate | Slower (lower) | Faster (higher) |

**Sample values from screenshots:**

| Rock | Mass | Resistance | Instability | Result |
|------|------|------------|-------------|--------|
| Igneous (Quantanium 50%) | 87,564 | 64% | 744.80 | IMPOSSIBLE |
| Igneous (Quantanium 38%) | 31,824 | 14% | 326.87 | IMPOSSIBLE |

**Key findings:**
- Instability varies significantly even for same mineral type (326-744 range for Quantanium)
- Higher Quantanium % correlates with higher instability
- Low resistance (14%) can still be IMPOSSIBLE due to mass/power requirements

## Implementation Phases

### Phase 1: Calculator Functions
- [ ] `calculateLaserInstabilityModifier(laser)`
- [ ] `calculateLaserWindowModifier(laser)`
- [ ] `calculateLaserChargeRateModifier(laser)`
- [ ] `calculateLaserOverchargeRateModifier(laser)`
- [ ] Add to `CalculationResult` type

### Phase 2: Single-Ship Display
- [ ] Add instability/window/rate to result panel
- [ ] Color-code instability warnings (green/yellow/red)

### Phase 3: Multi-Ship Support
- [ ] Extend `calculateGroupBreakability` for secondary attributes
- [ ] Handle multiplicative stacking across ships

### Phase 4: Base/Modified Mode (Like Resistance)
- [ ] Support user input of scanned values
- [ ] Back-calculate base from modified readings

## UI Considerations

### Result Display Options
1. **Compact**: Show modifiers only (e.g., "Instability: 0.65x")
2. **Detailed**: Show base → modified values
3. **Warning badges**: "HIGH INSTABILITY" for dangerous rocks

### Input Options
- Rock instability input field (optional)
- Base vs Modified toggle (like resistance)

## Research Needed

### Charge Window Mechanics (Priority)
The mining HUD shows a charge level meter with distinct zones:

```
┌─────────────┐
│   (empty)   │  ← Above overcharge (explosion)
├─────────────┤
│ OVERCHARGE  │  ← Red zone - danger area
│   (red)     │
├─────────────┤
│  OPTIMAL    │  ← Green zone - target area
│  (green)    │
├─────────────┤
│ (undercharge)│  ← Below optimal - won't break
└─────────────┘
     0.08      ← Charge level indicator
```

**Confirmed behavior:**
- Both green (OPTIMAL) and red (OVERCHARGE) zone sizes vary by rock material
- Zone sizes are NOT fixed - they're affected by equipment and rock properties

| Zone | Description | Modifier? |
|------|-------------|-----------|
| **Green (OPTIMAL)** | Target zone for breaking | `chargeWindowModifier` |
| **Red (OVERCHARGE)** | Danger area above optimal | TBD - separate modifier? |
| **Undercharge** | Below optimal - won't break | Inverse of green? |

**Questions to test in-game:**
- [ ] What's the base green zone size with no equipment?
- [ ] Do green and red zones scale together or independently?
- [ ] Does `chargeWindowModifier` affect both zones?
- [ ] Does `overchargeRateModifier` affect zone SIZE or fill SPEED?
- [ ] Is there a separate overcharge window modifier?

### Instability Behavior

**Data Analysis (14 rock samples from Training Data folder):**

| Rock Type | Mass | Resistance | Instability | Volatile Mineral |
|-----------|------|------------|-------------|------------------|
| Igneous | 43,768 | 33% | 390 | Taranite 41% |
| Igneous | 50,085 | 42% | 350 | Quantanium 23% |
| Granite | 52,237 | 50% | 391 | Quantanium 30% |
| Igneous | 49,256 | 28% | 346 | Quantanium 21% |
| Atacamite | 18,357 | 35% | **481** | **Riccite 26%** |
| Igneous | 51,413 | 30% | 341 | Quantanium 30% |
| Shale | 32,328 | 50% | 245 | Quantanium 31% |
| Igneous | 22,055 | 41% | 168 | Quantanium 42% |
| Granite | 39,447 | 49% | 274 | Quantanium 43% |
| Granite | 14,807 | 38% | 112 | Quantanium 35% |
| Granite | 29,066 | 29% | 208 | Quantanium 27% |
| Igneous | 36,098 | 45% | 311 | Quantanium 48% |
| Igneous | 87,564 | 64% | **744** | **Quantanium 50%** |

**Findings:**
1. **Mass correlates with instability** for Quantanium rocks:
   - < 25k mass → ~110-190 instability
   - 25k-40k mass → ~210-310 instability
   - 40k-55k mass → ~340-390 instability
   - > 80k mass → ~744 instability

2. **Riccite is exceptionally volatile** - 26% Riccite in small rock → 481 instability

3. **Hypothesis formula:**
   ```
   Instability = (Mass × baseFactor) + (volatileMineral% × volatilityMultiplier)
   ```
   Volatility multipliers: Riccite/Stileron > Quantanium > Taranite > others

**Research questions:**
- [ ] What numerical ranges map to Low/Medium/High/Very High?
- [ ] Is there a threshold where rock becomes "unmineable"?
- [ ] How does instability affect the charge bar movement?
- [ ] Confirm Stileron volatility (no samples yet)

### Charge Rate Behavior
Two separate rate modifiers exist:

| Modifier | Modules | Effect |
|----------|---------|--------|
| `chargeRateModifier` | Torrent, Torpid, Vaux, Lancet, etc. | Speed bar fills toward optimal |
| `overchargeRateModifier` | Forel (0.4), Lifeline (1.6), Optimum (0.2), Torpid (0.4) | Speed you enter danger when above green |

**Research questions:**
- [ ] Is charge rate the speed the bar fills?
- [ ] How does it interact with throttle position?
- [ ] What's the base charge rate value?
- [ ] Does overcharge rate affect how fast you accumulate explosion risk?
- [ ] Or does it affect how fast you move through the red zone?

## Open Questions

1. What are the base values for window/rate in-game?
2. Should we calculate absolute values or just show modifiers?
3. What instability threshold triggers warnings?
4. How do these interact with "In Scan" gadget mode?
5. Are overcharge/undercharge zones affected by the same modifiers as optimal zone?

## Research Resources

| File | Purpose |
|------|---------|
| [field-guide.md](field-guide.md) | **Standalone quick-reference for in-game use** |
| [data-collection-sheet.csv](data-collection-sheet.csv) | **Excel/Sheets fillable data entry form** |
| [window-research-protocol.md](window-research-protocol.md) | Data collection mission and test matrices |
| [window-research-tracker.csv](window-research-tracker.csv) | Spreadsheet for logging test results |
| [mining-commodities.md](mining-commodities.md) | Mineral instability reference data |
| [mining-data-template.csv](mining-data-template.csv) | General rock data collection template |

## Related Issues
- #11 - Instability modification and warning system
- #24 - Multi-ship instability calculations
- #25 - Multi-ship window size calculations
- #26 - Multi-ship charge rate calculations
