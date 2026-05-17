/**
 * Ayato Studio Portal - NISA Strategist Engine
 * Calculates long-term returns with 18M JPY limit constraint.
 */

export interface SimulationResult {
  year: number;
  principal: number;
  profit: number;
  total: number;
}

export function calculateNisa(
  monthlyInvestment: number,
  annualReturn: number, // e.g., 0.05 for 5%
  durationYears: number,
): SimulationResult[] {
  const results: SimulationResult[] = [
    {
      year: 0,
      principal: 0,
      profit: 0,
      total: 0,
    },
  ];
  const MAX_PRINCIPAL = 18000000;
  
  let currentPrincipal = 0;
  let currentBalance = 0;
  const monthlyReturn = annualReturn / 12;

  // Calculate month by month
  const totalMonths = durationYears * 12;

  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly investment if principal limit not reached
    const investment = currentPrincipal < MAX_PRINCIPAL ? monthlyInvestment : 0;
    currentPrincipal += investment;
    
    // Apply return
    currentBalance += investment;
    currentBalance *= (1 + monthlyReturn);

    // Record yearly stats
    if (month % 12 === 0) {
      const year = month / 12;
      results.push({
        year,
        principal: Math.round(currentPrincipal),
        profit: Math.round(currentBalance - currentPrincipal),
        total: Math.round(currentBalance),
      });
    }
  }

  return results;
}
