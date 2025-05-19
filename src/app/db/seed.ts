import 'dotenv/config';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from './index';
import { ubSections } from './schema/schema.ub';

interface UBRecord {
  Section: string;
  'h[mm]': string;
  'b[mm]': string;
  'tw[mm]': string;
  'tf[mm]': string;
  'hi[mm]': string;
  'r1[mm]': string;
  'd[mm]': string;
  'A[cm2]': string;
  'Iy[cm4]': string;
  'Iz[cm4]': string;
  'Ip[cm4]': string;
  'iy[mm]': string;
  'iz[mm]': string;
  'ip[mm]': string;
  'max Sy[cm3]': string;
  'max Sz[cm3]': string;
  'Wy[cm3]': string;
  'Wz[cm3]': string;
  'Ay[cm2]': string;
  'Az[cm2]': string;
  'It[cm4]': string;
  'It,s[cm4]': string;
  'Wt[cm3]': string;
  'max ω[cm2]': string;
  'Iω[cm6]': string;
  'iω[mm]': string;
  'Wω[cm4]': string;
  'Wpl,y[cm3]': string;
  'Wpl,z[cm3]': string;
  'Wpl,ω[cm4]': string;
  'Wpl,y,webs[cm3]': string;
  'Wpl,z,flanges[cm3]': string;
  'αpl,y': string;
  'αpl,z': string;
  'αpl,ω': string;
  'Apl,y[cm2]': string;
  'Apl,z[cm2]': string;
  'Npl[kN]': string;
  'Vpl,y[kN]': string;
  'Vpl,z[kN]': string;
  'Mpl,y[kNm]': string;
  'Mpl,z[kNm]': string;
  'Nu[kN]': string;
  'G[kg/m]': string;
  'Am[m2/m]': string;
  'V[cm3/m]': string;
  'Am/V[1/m]': string;
  'Aw[cm2]': string;
}

async function seed() {
  try {
    // Read the CSV file
    const csvFilePath = join(process.cwd(), 'src/app/databases/ub-sections.csv');
    const fileContent = readFileSync(csvFilePath, 'utf-8');

    // Parse CSV data with explicit column mapping
    const records = parse(fileContent, {
      columns: (headers) => headers.map((header: string) => header.trim()),
      skip_empty_lines: true,
      trim: true,
    }) as UBRecord[];

    console.log(`Found ${records.length} records in CSV`);

    // Transform the data to match the database schema
    const sections = records.map((record) => {
      if (!record.Section) {
        throw new Error(`Missing section data in record: ${JSON.stringify(record)}`);
      }

      return {
        section: record.Section,
        height_mm: record['h[mm]'],
        width_mm: record['b[mm]'],
        web_thickness_mm: record['tw[mm]'],
        flange_thickness_mm: record['tf[mm]'],
        internal_height_mm: record['hi[mm]'],
        root_radius_mm: record['r1[mm]'],
        depth_mm: record['d[mm]'],
        cross_sectional_area_cm2: record['A[cm2]'],
        second_moment_y_cm4: record['Iy[cm4]'],
        second_moment_z_cm4: record['Iz[cm4]'],
        polar_moment_cm4: record['Ip[cm4]'],
        radius_gyration_y_mm: record['iy[mm]'],
        radius_gyration_z_mm: record['iz[mm]'],
        polar_radius_gyration_mm: record['ip[mm]'],
        max_elastic_modulus_y_cm3: record['max Sy[cm3]'],
        max_elastic_modulus_z_cm3: record['max Sz[cm3]'],
        elastic_modulus_y_cm3: record['Wy[cm3]'],
        elastic_modulus_z_cm3: record['Wz[cm3]'],
        shear_area_y_cm2: record['Ay[cm2]'],
        shear_area_z_cm2: record['Az[cm2]'],
        torsional_constant_cm4: record['It[cm4]'],
        torsional_constant_st_venant_cm4: record['It,s[cm4]'],
        torsional_modulus_cm3: record['Wt[cm3]'],
        max_warping_function_cm2: record['max ω[cm2]'],
        warping_constant_cm6: record['Iω[cm6]'],
        warping_radius_gyration_mm: record['iω[mm]'],
        warping_modulus_cm4: record['Wω[cm4]'],
        plastic_modulus_y_cm3: record['Wpl,y[cm3]'],
        plastic_modulus_z_cm3: record['Wpl,z[cm3]'],
        plastic_warping_modulus_cm4: record['Wpl,ω[cm4]'],
        plastic_modulus_webs_y_cm3: record['Wpl,y,webs[cm3]'],
        plastic_modulus_flanges_z_cm3: record['Wpl,z,flanges[cm3]'],
        plastic_shape_factor_y: record['αpl,y'],
        plastic_shape_factor_z: record['αpl,z'],
        plastic_warping_shape_factor: record['αpl,ω'],
        plastic_area_y_cm2: record['Apl,y[cm2]'],
        plastic_area_z_cm2: record['Apl,z[cm2]'],
        plastic_axial_force_kn: record['Npl[kN]'],
        plastic_shear_force_y_kn: record['Vpl,y[kN]'],
        plastic_shear_force_z_kn: record['Vpl,z[kN]'],
        plastic_moment_y_knm: record['Mpl,y[kNm]'],
        plastic_moment_z_knm: record['Mpl,z[kNm]'],
        ultimate_axial_force_kn: record['Nu[kN]'],
        mass_per_unit_length_kgm: record['G[kg/m]'],
        surface_area_per_unit_length_m2m: record['Am[m2/m]'],
        volume_per_unit_length_cm3m: record['V[cm3/m]'],
        surface_area_to_volume_ratio_1m: record['Am/V[1/m]'],
        web_area_cm2: record['Aw[cm2]'],
      };
    });

    console.log(`Transformed ${sections.length} sections`);

    // Insert the data into the database
    console.log('Inserting UB sections data...');
    await db.insert(ubSections).values(sections);
    console.log('Successfully inserted UB sections data!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 