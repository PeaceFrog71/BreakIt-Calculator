# Charge Window Research Protocol

Goal: Understand how optimal (green) and overcharge (red) zone sizes are determined, so we can simulate them in the calculator.

## Research Questions

1. **What determines base window size?**
   - Rock type (Igneous, Granite, Shale, Atacamite)?
   - Mineral composition?
   - Mass?
   - Instability value?

2. **How do equipment modifiers affect window size?**
   - Do lasers with `chargeWindowModifier` change zone size?
   - Do modules (Focus, Rieger, Torrent) change zone size?
   - Do gadgets (Okunis 2.0x, Waveshift 2.0x, Sabir 1.5x) change zone size?

3. **Are green and red zones linked?**
   - Do they scale together?
   - Or are they independent?

## Test Matrix

### Phase 1: Baseline (No Modifiers)
Use a laser with NO window modifier (like Helix has 0.6, so avoid it).

**Test setup:** Lancet MH1 (window: 0.4) or find a neutral laser

Actually, looking at the data:
- Most lasers HAVE window modifiers
- We need to establish what "1.0x" baseline looks like

**Alternative:** Use consistent equipment across all tests, then vary one thing at a time.

### Phase 2: Rock Type Comparison
Same equipment, different rock types:

| Test | Rock Type | Target Mineral | Screenshot Name |
|------|-----------|----------------|-----------------|
| R1 | Igneous | Quantanium ~30% | igneous_quan_30.png |
| R2 | Granite | Quantanium ~30% | granite_quan_30.png |
| R3 | Shale | Quantanium ~30% | shale_quan_30.png |
| R4 | Atacamite | Riccite | atacamite_riccite.png |

### Phase 3: Mineral % Comparison
Same rock type (Igneous), different Quantanium %:

| Test | Quan % | Target | Screenshot Name |
|------|--------|--------|-----------------|
| M1 | ~20% | Low Quan rock | igneous_quan_20.png |
| M2 | ~35% | Mid Quan rock | igneous_quan_35.png |
| M3 | ~50% | High Quan rock | igneous_quan_50.png |

### Phase 4: Equipment Modifiers
Same rock, different equipment:

| Test | Equipment | Window Mod | Screenshot Name |
|------|-----------|------------|-----------------|
| E1 | Arbor MH1 | 1.4x | arbor_window.png |
| E2 | Helix I | 0.6x | helix_window.png |
| E3 | Hofstede-S1 | 1.6x | hofstede_window.png |
| E4 | Lancet MH1 | 0.4x | lancet_window.png |

### Phase 5: Gadget Effects
Same rock + equipment, add gadget:

| Test | Gadget | Window Mod | Screenshot Name |
|------|--------|------------|-----------------|
| G1 | None | 1.0x | no_gadget.png |
| G2 | Okunis | 2.0x | okunis_window.png |
| G3 | Waveshift | 2.0x | waveshift_window.png |
| G4 | Sabir | 1.5x | sabir_window.png |
| G5 | Stalwart | 0.7x | stalwart_window.png |

### Phase 6: Module Effects
Same rock + laser, add window modules:

| Test | Module | Window Mod | Screenshot Name |
|------|--------|------------|-----------------|
| Mod1 | None | 1.0x | no_module.png |
| Mod2 | Focus III | 1.4x | focus3_window.png |
| Mod3 | Rieger-C3 | 0.99x | rieger3_window.png |
| Mod4 | Torrent III | 0.99x | torrent3_window.png |

## Screenshot Requirements

For each screenshot, capture:
1. **SCAN RESULTS panel** showing:
   - Rock type
   - Mass
   - Resistance
   - Instability
   - Composition

2. **CHARGE LEVEL meter** showing:
   - Green zone size (estimate % of total bar)
   - Red zone size (estimate % of total bar)
   - Current charge position

3. **Equipment info** (if visible) or note separately

## Data Collection Template

```
Screenshot: [filename]
Date: [date]
Location: [moon/planet]

ROCK DATA:
- Type: [Igneous/Granite/Shale/Atacamite]
- Mass: [number]
- Resistance: [%]
- Instability: [number]
- Primary Mineral: [name] [%]

EQUIPMENT:
- Ship: [Prospector/MOLE/GOLEM]
- Laser: [name]
- Modules: [list]
- Gadget: [name or None]

WINDOW OBSERVATIONS:
- Green zone size: [Small/Medium/Large] or [estimated %]
- Red zone size: [Small/Medium/Large] or [estimated %]
- Notes: [any observations]
```

## Priority Tests

If time is limited, focus on:

1. **Gadget comparison** (G1-G5) - These have the biggest modifiers (2.0x)
2. **Laser comparison** (E1-E4) - Verify lasers affect window
3. **One Quantanium vs one Riccite rock** - Compare volatile minerals

## Gaps in Current Data

We need samples of:
- [ ] **Stileron** rocks (no samples yet)
- [ ] Low-instability rocks (Tier 3 minerals: Ice, Copper, etc.)
- [ ] Any rock with visible window while NOT in IMPOSSIBLE state
- [ ] Same rock scanned with different equipment

## Notes for Testing

- Screenshots are most useful when rock is POSSIBLE to mine (shows active window)
- Try to find smaller/easier rocks first to establish baseline
- Gadgets are single-use, so plan gadget tests carefully
- Consider using Lyria or other Quantanium-rich moons for consistent testing
