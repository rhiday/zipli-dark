export interface FoodItemWithMetrics {
    name: string;
    category: string;
    quantity: number;    // kg
    co2Emission: number; // kg CO2 per kg
    cost: number;        // EUR per kg
    calories: number;    // kcal per kg
}

export const foodItemsWithMetrics: FoodItemWithMetrics[] = [
    { name: "Kikherne pihvit", category: "main_protein", quantity: 1.9, co2Emission: 0.8, cost: 12.50, calories: 2800 },
    { name: "Herkkusieni gratinii", category: "energy_supplement", quantity: 3.65, co2Emission: 0.3, cost: 8.90, calories: 1200 },
    { name: "Punajuuripihvit", category: "main_protein", quantity: 1.9, co2Emission: 0.4, cost: 9.80, calories: 1800 },
    { name: "Naudanlihapta", category: "main_protein", quantity: 2.5, co2Emission: 27.0, cost: 18.50, calories: 2500 },
    { name: "Kalapyörykät", category: "main_protein", quantity: 1.54, co2Emission: 3.5, cost: 15.20, calories: 2200 },
    { name: "Täysjyvälaura", category: "energy_supplement", quantity: 2.2, co2Emission: 0.6, cost: 6.80, calories: 3200 },
    { name: "Kalakeitto", category: "main_protein", quantity: 7.06, co2Emission: 3.2, cost: 12.30, calories: 1800 },
    { name: "Pähkinäistä kukkakaaligratiinia", category: "main_protein", quantity: 4.54, co2Emission: 0.5, cost: 11.20, calories: 1600 },
    { name: "Kalkkunakaaviskeitto", category: "main_protein", quantity: 7.49, co2Emission: 4.2, cost: 13.80, calories: 2000 },
    { name: "Kidneypapu-ratatouille", category: "main_protein", quantity: 7.0, co2Emission: 0.7, cost: 8.50, calories: 2400 },
    { name: "Kylmäsavulohikeitto", category: "soup", quantity: 9.4, co2Emission: 3.8, cost: 16.90, calories: 1900 },
    { name: "Kasvis-makaronilaatikko", category: "main_protein", quantity: 3.91, co2Emission: 0.9, cost: 7.20, calories: 2100 },
    { name: "Broilerinakkikastikketta", category: "main_protein", quantity: 4.77, co2Emission: 3.8, cost: 14.50, calories: 2300 },
    { name: "Soija-pastavuoka", category: "main_protein", quantity: 3.2, co2Emission: 0.4, cost: 9.80, calories: 1900 },
    { name: "Burrito", category: "main_protein", quantity: 2.88, co2Emission: 1.2, cost: 11.50, calories: 2500 },
    { name: "Kurpistasalaattti", category: "salad_ingredients", quantity: 4.03, co2Emission: 0.3, cost: 5.90, calories: 800 },
    { name: "Eiistakiusaus", category: "main_protein", quantity: 4.4, co2Emission: 2.8, cost: 17.20, calories: 2100 },
    { name: "Timjami maustettua kalkkunaa", category: "main_protein", quantity: 5.75, co2Emission: 4.1, cost: 15.80, calories: 2400 },
    { name: "Thai curry tofu", category: "main_protein", quantity: 5.725, co2Emission: 0.6, cost: 10.90, calories: 1800 },
];

export const metricOptions = [
    { key: 'quantity', label: 'Paino', unit: 'kg', color: '#22c55e' },
    { key: 'co2Emission', label: 'CO₂-päästöt', unit: 'kg CO₂', color: '#ef4444' },
    { key: 'cost', label: 'Hinta', unit: '€', color: '#f59e0b' },
    { key: 'calories', label: 'Kalorit', unit: 'kcal', color: '#8b5cf6' },
 ] as const;

export type MetricKey = (typeof metricOptions)[number]["key"];


