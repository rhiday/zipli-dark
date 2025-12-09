import { z } from "zod"

const RequestSchema = z.object({
  restaurantId: z.string(),
  period: z.enum(["this-week"]),
})

type SodexoWeeklyResponse = {
  meta: {
    ref_title?: string
    ref_url?: string
  }
  timeperiod?: string
  mealdates: Array<{
    date: string
    courses: Record<
      string,
      {
        title_fi: string
        title_en?: string
        category?: string
        dietcodes?: string
      }
    >
  }>
}

// Sodexo restaurant configs - maps slug to weekly JSON endpoint
const SODEXO_RESTAURANTS: Record<
  string,
  { name: string; location: string; weeklyJsonUrl: string }
> = {
  "stadin-ao-vilppulantie": {
    name: "Stadin AO Vilppulantie",
    location: "Helsinki",
    weeklyJsonUrl: "https://www.sodexo.fi/ruokalistat/output/weekly_json/180",
  },
  // Add more restaurants here as needed
}

export async function GET() {
  // Return list of available restaurants
  const restaurants = Object.entries(SODEXO_RESTAURANTS).map(([id, data]) => ({
    id,
    name: data.name,
    location: data.location,
  }))
  
  return Response.json({ restaurants })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { restaurantId } = RequestSchema.parse(body)

    const restaurant = SODEXO_RESTAURANTS[restaurantId]
    if (!restaurant) {
      return Response.json(
        { error: "Unknown restaurant. Available: " + Object.keys(SODEXO_RESTAURANTS).join(", ") },
        { status: 400 }
      )
    }

    const res = await fetch(restaurant.weeklyJsonUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Zipli-CO2-Analyzer/1.0",
      },
    })
    
    if (!res.ok) {
      return Response.json(
        { error: `Failed to fetch Sodexo menu: ${res.status} ${res.statusText}` },
        { status: 502 }
      )
    }

    const json = (await res.json()) as SodexoWeeklyResponse

    // Build rows compatible with ParsedExcelData / analyze-surplus
    const headers = [
      "Date",
      "Restaurant",
      "Location",
      "Food Type",
      "Category",
      "Diet codes",
      "Mass (kg)",
    ]

    const rows: Record<string, unknown>[] = []

    for (const day of json.mealdates ?? []) {
      const dateLabel = day.date // e.g. "Maanantai" (Monday in Finnish)

      for (const key of Object.keys(day.courses ?? {})) {
        const course = day.courses[key]
        if (!course) continue

        rows.push({
          Date: dateLabel,
          Restaurant: restaurant.name,
          Location: restaurant.location,
          "Food Type": course.title_fi || course.title_en || "",
          Category: course.category ?? "",
          "Diet codes": course.dietcodes ?? "",
          // Mass not available from Sodexo API - GPT will estimate
          "Mass (kg)": null,
        })
      }
    }

    const summaryLines = [
      `Restaurant: ${restaurant.name}`,
      `Location: ${restaurant.location}`,
      `Period: ${json.timeperiod ?? "N/A"}`,
      `Source: ${json.meta?.ref_url ?? restaurant.weeklyJsonUrl}`,
      `Total days: ${json.mealdates?.length ?? 0}`,
      `Total menu items: ${rows.length}`,
      "",
      "Sample items (first 5):",
      ...rows.slice(0, 5).map((r, i) => {
        return `  ${i + 1}. ${r.Date} – ${r["Food Type"]} (${r.Category})`
      }),
    ]

    return Response.json({
      data: {
        headers,
        rows,
      },
      summary: summaryLines.join("\n"),
      meta: {
        restaurant: restaurant.name,
        location: restaurant.location,
        period: json.timeperiod,
        totalItems: rows.length,
      },
    })
  } catch (err) {
    console.error("fetch-sodexo-menu error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}


