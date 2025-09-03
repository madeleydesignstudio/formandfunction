import { useState } from "react";
import { Button } from "@ordo/ui/components/button";

interface SteelBeam {
  section_designation: string;
  mass_per_metre: number;
  depth_of_section: number;
  width_of_section: number;
  thickness_web: number;
  thickness_flange: number;
  root_radius: number;
  depth_between_fillets: number;
  ratios_for_local_buckling_web: number;
  ratios_for_local_buckling_flange: number;
  end_clearance: number;
  notch: number;
  dimensions_for_detailing_n: number;
  surface_area_per_metre: number;
  surface_area_per_tonne: number;
  second_moment_of_area_axis_y: number;
  second_moment_of_area_axis_z: number;
  radius_of_gyration_axis_y: number;
  radius_of_gyration_axis_z: number;
  elastic_modulus_axis_y: number;
  elastic_modulus_axis_z: number;
  plastic_modulus_axis_y: number;
  plastic_modulus_axis_z: number;
  buckling_parameter: number;
  torsional_index: number;
  warping_constant: number;
  torsional_constant: number;
  area_of_section: number;
}

export default function SteelBeams() {
  const [beams, setBeams] = useState<SteelBeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "/api/beams"
          : "https://api.itsformfunction.com/beams";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SteelBeam[] = await response.json();
      setBeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch beams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Steel Beam Database
        </h2>
        <Button onClick={fetchBeams} disabled={loading} className="mb-4">
          {loading ? "Loading..." : "Fetch Steel Beams"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
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
                {beams.map((beam, index) => (
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
