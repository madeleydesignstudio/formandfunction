import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@ordo/ui/components/button";
import { z } from "zod";

// Zod schemas for type safety
const calculationRequestSchema = z.object({
  beam_designation: z.string().optional(),
  applied_load: z.number().positive(),
  span_length: z.number().positive(),
  load_type: z.enum(["uniform", "point"]),
  safety_factor: z.number().positive().default(1.6),
  material_grade: z.enum(["S235", "S275", "S355", "S460"]).default("S355"),
});

const calculationResultSchema = z.object({
  beam: z.object({
    section_designation: z.string(),
    mass_per_metre: z.number(),
    depth_of_section: z.number(),
    width_of_section: z.number(),
  }),
  applied_load: z.number(),
  span_length: z.number(),
  max_moment: z.number(),
  max_shear: z.number(),
  max_deflection: z.number(),
  stress_utilization: z.number(),
  deflection_limit_check: z.boolean(),
  is_adequate: z.boolean(),
  safety_margin: z.number(),
  recommendations: z.array(z.string()),
});

type CalculationRequest = z.infer<typeof calculationRequestSchema>;
type CalculationResult = z.infer<typeof calculationResultSchema>;

// API functions
const analyzeBeam = async (
  data: CalculationRequest,
): Promise<CalculationResult> => {
  const calcEngineUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8081"
      : "https://engine.itsformfunction.com";

  const response = await fetch(`${calcEngineUrl}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  const result = await response.json();
  return calculationResultSchema.parse(result);
};

const fetchAvailableBeams = async (): Promise<string[]> => {
  // Fallback beam data
  const fallbackBeams = ["UB406x178x74", "UB406x178x67"];

  const calcEngineUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8081"
      : "https://engine.itsformfunction.com";

  try {
    const response = await fetch(`${calcEngineUrl}/beams`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.warn(
        `Beams API responded with ${response.status}: ${response.statusText}`,
      );
      return fallbackBeams;
    }

    const data = await response.json();

    // Handle both response formats
    if (Array.isArray(data)) {
      // Direct array from Go API
      return data.map((beam: any) => beam.section_designation).filter(Boolean);
    } else if (data.beams && Array.isArray(data.beams)) {
      // Wrapped format from Python calc engine
      return data.beams
        .map((beam: any) => beam.section_designation)
        .filter(Boolean);
    } else {
      console.warn("Invalid response format from beams API");
      return fallbackBeams;
    }
  } catch (error) {
    console.error("Error fetching beams:", error);
    return fallbackBeams;
  }
};

export default function BeamCalculator() {
  const [formData, setFormData] = useState<CalculationRequest>({
    applied_load: 10,
    span_length: 6,
    load_type: "uniform",
    safety_factor: 1.6,
    material_grade: "S355",
  });

  const [useOptimalBeam, setUseOptimalBeam] = useState(true);

  // Query for available beams
  const { data: availableBeams = [] } = useQuery({
    queryKey: ["availableBeams"],
    queryFn: fetchAvailableBeams,
    enabled: !useOptimalBeam,
    retry: 2, // Limit retries
    retryDelay: 1000, // 1 second delay between retries
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for beam analysis
  const analysisMutation = useMutation({
    mutationFn: analyzeBeam,
  });

  const handleInputChange = (field: keyof CalculationRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = () => {
    const requestData = useOptimalBeam
      ? { ...formData, beam_designation: undefined }
      : formData;

    try {
      const validatedData = calculationRequestSchema.parse(requestData);
      analysisMutation.mutate(validatedData);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 1.0) return "text-red-600 bg-red-50";
    if (utilization > 0.9) return "text-orange-600 bg-orange-50";
    if (utilization < 0.5) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("CRITICAL")) return "text-red-700 bg-red-100";
    if (recommendation.includes("HIGH")) return "text-orange-700 bg-orange-100";
    if (recommendation.includes("LOW")) return "text-blue-700 bg-blue-100";
    return "text-green-700 bg-green-100";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Steel Beam Calculator
        </h2>
        <p className="text-gray-600">
          Analyze steel beams for structural adequacy using Eurocode 3 standards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Loading Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applied Load
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.applied_load}
                    onChange={(e) =>
                      handleInputChange(
                        "applied_load",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">
                    {formData.load_type === "uniform" ? "kN/m" : "kN"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Span Length
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.span_length}
                    onChange={(e) =>
                      handleInputChange(
                        "span_length",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">
                    m
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Load Type
                </label>
                <select
                  value={formData.load_type}
                  onChange={(e) =>
                    handleInputChange(
                      "load_type",
                      e.target.value as "uniform" | "point",
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="uniform">Uniform Distributed</option>
                  <option value="point">Point Load (Center)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Grade
                </label>
                <select
                  value={formData.material_grade}
                  onChange={(e) =>
                    handleInputChange("material_grade", e.target.value as any)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="S235">S235 (235 N/mm²)</option>
                  <option value="S275">S275 (275 N/mm²)</option>
                  <option value="S355">S355 (355 N/mm²)</option>
                  <option value="S460">S460 (460 N/mm²)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Factor
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.safety_factor}
                  onChange={(e) =>
                    handleInputChange(
                      "safety_factor",
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Beam Selection
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useOptimalBeam}
                    onChange={() => setUseOptimalBeam(true)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Find optimal beam automatically
                  </span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useOptimalBeam}
                    onChange={() => setUseOptimalBeam(false)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select specific beam
                  </span>
                </label>
              </div>

              {!useOptimalBeam && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beam Designation
                  </label>
                  <select
                    value={formData.beam_designation || ""}
                    onChange={(e) =>
                      handleInputChange("beam_designation", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a beam...</option>
                    {availableBeams.map((beam) => (
                      <option key={beam} value={beam}>
                        {beam}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={
              analysisMutation.isPending ||
              (!useOptimalBeam && !formData.beam_designation)
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {analysisMutation.isPending ? "Analyzing..." : "Analyze Beam"}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {analysisMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Analysis Error
              </h3>
              <p className="text-red-700">
                {analysisMutation.error instanceof Error
                  ? analysisMutation.error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          )}

          {analysisMutation.data && (
            <div className="space-y-6">
              {/* Beam Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Selected Beam:{" "}
                  {analysisMutation.data.beam.section_designation}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Mass:</span>
                    <span className="ml-2 text-gray-900">
                      {analysisMutation.data.beam.mass_per_metre} kg/m
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Depth:</span>
                    <span className="ml-2 text-gray-900">
                      {analysisMutation.data.beam.depth_of_section} mm
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Width:</span>
                    <span className="ml-2 text-gray-900">
                      {analysisMutation.data.beam.width_of_section} mm
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Results */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Analysis Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm font-medium text-gray-600">
                      Max Moment
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {analysisMutation.data.max_moment} kNm
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm font-medium text-gray-600">
                      Max Deflection
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {analysisMutation.data.max_deflection.toFixed(2)} mm
                    </div>
                  </div>
                </div>

                {/* Utilization Display */}
                <div
                  className={`mt-4 p-4 rounded-lg ${getUtilizationColor(analysisMutation.data.stress_utilization)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Stress Utilization</span>
                    <span className="text-2xl font-bold">
                      {(analysisMutation.data.stress_utilization * 100).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        analysisMutation.data.stress_utilization > 1.0
                          ? "bg-red-600"
                          : analysisMutation.data.stress_utilization > 0.9
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(analysisMutation.data.stress_utilization * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Pass/Fail Status */}
                <div
                  className={`mt-4 p-4 rounded-lg text-center ${
                    analysisMutation.data.is_adequate
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">
                    {analysisMutation.data.is_adequate
                      ? "✓ ADEQUATE"
                      : "✗ INADEQUATE"}
                  </div>
                  <div className="text-sm">
                    Safety Margin:{" "}
                    {analysisMutation.data.safety_margin.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysisMutation.data.recommendations.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Engineering Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysisMutation.data.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${getRecommendationColor(rec)}`}
                      >
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!analysisMutation.data && !analysisMutation.error && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🏗️</div>
              <p>
                Enter loading parameters and click "Analyze Beam" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
