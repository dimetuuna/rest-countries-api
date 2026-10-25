const populationFormatter = new Intl.NumberFormat('en-US')

export function formatPopulation(population: number): string {
  return populationFormatter.format(population)
}
