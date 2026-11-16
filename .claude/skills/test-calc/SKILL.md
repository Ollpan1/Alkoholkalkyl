---
name: test-calc
description: Test and verify BAC calculations, timeline simulations, and planner schedules.
---

# Test Calculation Skill

Use this skill when verifying or debugging calculations in `index.html`.

## Verification items:
- Check that Michaelis-Menten parameters ($V_{max}$, $K_m$) and Widmark factors are correctly applied.
- Test Promilleplaneraren inputs (start time, target time, target BAC, drink type/size) to ensure logical build-up and maintenance schedules.
- Verify that mobile decimal comma handling (`.replace(',', '.')`) functions properly across inputs.
