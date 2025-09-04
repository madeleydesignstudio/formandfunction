import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@ordo/ui/components/button";

// Zod schema for a single steel beam, derived from the previous interface
const steelBeamSchema = z.object({
  section_designation: z.string(),
  mass_per_metre: z.number(),
  depth_of_section: z.number(),
  width_of_section: z.number(),
  thickness_web: z.number(),
  thickness_flange: z.number(),
  root_radius: z.number(),
  depth_between_fillets: z.number(),
  ratios_for_local_buckling_web: z.number(),
  ratios_for_local_buckling_flange: z.number(),
  end_clearance: z.number(),
  notch: z.number(),
  dimensions_for_detailing_n: z.number(),
  surface_area_per_metre: z.number(),
  surface_area_per_tonne: z.number(),
  second_moment_of_area_axis_y: z.number(),
  second_moment_of_area_axis_z: z.number(),
  radius_of_gyration_axis_y: z.number(),
  radius_of_gyration_axis_z: z.number(),
  elastic_modulus_axis_y: z.number(),
  elastic_modulus_axis_z: z.number(),
  plastic_modulus_axis_y: z.number(),
  plastic_modulus_axis_z: z.number(),
  buckling_parameter: z.number(),
  torsional_index: z.number(),
  warping_constant: z.number(),
  torsional_constant: z.number(),
  area_of_section: z.number(),
});

// Zod schema for the API response that contains beams array
const steelBeamsResponseSchema = z.object({
  beams: z.array(steelBeamSchema),
  count: z.number(),
  source: z.string(),
});

// Type alias inferred from the Zod schema
type SteelBeam = z.infer<typeof steelBeamSchema>;

// Asynchronous function to fetch and validate steel beam data
const fetchBeams = async () => {
  const apiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/beams"
      : "https://api.itsformfunction.com/beams";
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  // Validate data with Zod, which throws an error if validation fails
  const validatedData = steelBeamsResponseSchema.parse(data);
  // Return just the beams array for the component
  return validatedData.beams;
};

export default function SteelBeams() {
  const {
    data: beams = [], // Default to an empty array
    isFetching,
    isError,
    error,
    refetch, // Function to trigger the fetch
  } = useQuery({
    queryKey: ["steelBeams"], // Unique key for this query
    queryFn: fetchBeams, // The function that will fetch the data
    enabled: false, // Disable this query from automatically running
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Steel Beam Database
        </h2>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mb-4"
        >
          {isFetching ? "Loading..." : "Fetch Steel Beams"}
        </Button>
      </div>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong>{" "}
          {error instanceof Error ? error.message : "Failed to fetch beams"}
        </div>
      )}

      {beams.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mass (kg/m)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depth (mm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Width (mm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Web Thickness (mm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flange Thickness (mm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area (cm²)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {beams.map((beam: SteelBeam, index: number) => (
                  <tr
                    key={beam.section_designation}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {beam.section_designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.mass_per_metre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.depth_of_section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.width_of_section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.thickness_web}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.thickness_flange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {beam.area_of_section}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {beams.length > 0 && (
            <div className="bg-gray-50 px-6 py-3">
              <p className="text-sm text-gray-500">
                Showing {beams.length} steel beam{beams.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
