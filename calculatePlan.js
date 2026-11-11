// Beräkna promilleplanen
function calculatePlan() {
  const startTime = document.getElementById('planStartTime').value;
  const targetTime = document.getElementById('planTargetTime').value;
  const endTime = document.getElementById('planEndTime').value;
  const targetPromille = parseFloat(document.getElementById('planTargetPromille').value);
  const drinkType = document.getElementById('planDrinkType').value;
  const sizeIndex = parseInt(document.getElementById('planDrinkSize').value);

  // Validering
  if (!startTime || !targetTime || !endTime || !targetPromille) {
    alert('Fyll i alla fält');
    return;
  }

  // Hämta drink-info
  const drink = drinkFormats[drinkType][sizeIndex];

  // Hämta personliga inställningar
  const weight = parseFloat(document.getElementById('weight').value) || 70;
  const gender = document.getElementById('gender').value;
  const hunger = document.getElementById('hunger').value;
  const r = REDUCTION_FACTOR[gender];
  const k = K_VALUES[hunger];

  // Helper: konvertera tid-string till minuter från midnatt
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper: konvertera minuter tillbaka till tid-string
  const minutesToTime = (minutes) => {
    const h = Math.floor((minutes % (24 * 60)) / 60);
    const m = Math.floor(minutes % 60);
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  };

  // Konvertera alla tider till minuter
  let startMin = timeToMinutes(startTime);
  let targetMin = timeToMinutes(targetTime);
  let endMin = timeToMinutes(endTime);

  // Beräkna faktiska intervaller (hantera över midnatt)
  let buildupMinutes = targetMin >= startMin ?
    targetMin - startMin :
    (24 * 60 - startMin) + targetMin;

  let maintenanceMinutes = endMin >= targetMin ?
    endMin - targetMin :
    (24 * 60 - targetMin) + endMin;

  const buildupHours = buildupMinutes / 60;
  const maintenanceHours = maintenanceMinutes / 60;

  // Validering
  if (buildupHours <= 0) {
    alert('Målpromille-tid måste vara senare än starttid');
    return;
  }

  // Gram alkohol per drink
  const gramsPerDrink = (drink.volume * drink.percent) / 100 * 0.789;

  // Beräkna drycker för uppbyggning
  const theoreticalGrams = targetPromille * weight * r;
  const drinksNeeded = Math.max(1, Math.round(theoreticalGrams / gramsPerDrink));

  // Verifiera att det är möjligt
  const maxPossiblePromille = (drinksNeeded * gramsPerDrink / (weight * r)) * (1 - Math.exp(-k * buildupHours)) - BETA * buildupHours;

  if (maxPossiblePromille < targetPromille * 0.8) {
    alert(`Omöjligt att nå ${targetPromille}‰ på ${buildupHours.toFixed(1)} timmar med ${drink.size}.\n\nFörsök med:\n- Längre tid till målpromille\n- Större/starkare drycker\n- Lägre målpromille`);
    return;
  }

  // Beräkna underhållsfas
  let maintenanceInterval = 0;
  if (maintenanceHours > 0) {
    const eliminationPerHour = BETA * weight * r;
    const drinksPerHour = eliminationPerHour / gramsPerDrink;
    maintenanceInterval = Math.max(15, Math.round(60 / drinksPerHour));
  }

  // Formatera resultat
  const buildupText = `Drick ${drinksNeeded} x ${drink.size} från ${startTime} till ${targetTime} (${buildupHours.toFixed(1)} timmar) för att nå ~${targetPromille}‰`;

  let maintenanceText = '';
  if (maintenanceHours > 0) {
    maintenanceText = `Drick 1 x ${drink.size} var ${maintenanceInterval} minuter från ${targetTime} till ${endTime} (${maintenanceHours.toFixed(1)} timmar) för att hålla ~${targetPromille}‰`;
  } else {
    maintenanceText = 'Ingen underhållsfas (sluttid = målpromille-tid)';
  }

  // Skapa schema
  let schedule = [];

  // Uppbyggningsfas - jämn fördelning
  const buildupInterval = buildupMinutes / drinksNeeded;
  for (let i = 0; i < drinksNeeded; i++) {
    const drinkTime = startMin + (i * buildupInterval);
    schedule.push(minutesToTime(drinkTime));
  }

  // Underhållsfas
  if (maintenanceHours > 0) {
    let mainTime = targetMin + maintenanceInterval;
    while (mainTime <= (targetMin + maintenanceMinutes)) {
      schedule.push(minutesToTime(mainTime));
      mainTime += maintenanceInterval;
    }
  }

  // Visa resultat
  document.getElementById('planBuildupText').textContent = buildupText;
  document.getElementById('planMaintenanceText').textContent = maintenanceText;
  document.getElementById('planSchedule').textContent = 'Dryck på tiderna:\n' + schedule.join(', ');
  document.getElementById('planResult').style.display = 'block';
}
