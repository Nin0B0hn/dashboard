export function interpretOPI(opi: number): string {
    const epsilon = 0.0001;
  
    if (Math.abs(opi - 0) < epsilon) {
      return 'No polarization';
    } else if (opi > 0 && opi <= 0.2) {
      return 'Very low polarization';
    } else if (opi > 0.2 && opi <= 0.4) {
      return 'Low polarization';
    } else if (opi > 0.4 && opi <= 0.6) {
      return 'Moderate polarization';
    } else if (opi > 0.6 && opi <= 0.8) {
      return 'High polarization';
    } else if (opi > 0.8 && opi <= 1) {
      return 'Very high polarization';
    } else {
      return 'Unknown OPI value';
    }
  }