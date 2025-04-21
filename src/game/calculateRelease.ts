export function calculateRelease(netValue: number, confidence: number) {
    const roll = Math.floor(Math.random() * 100) + 1;
    return roll <= confidence;
  }