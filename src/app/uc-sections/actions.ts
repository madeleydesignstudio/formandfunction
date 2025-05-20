'use server';

import { db } from '@/app/db';
import { ucSections } from '@/app/db/schema/schema.uc';

interface UCSection {
  section: string;
  height_mm: string;
  width_mm: string;
  web_thickness_mm: string;
  flange_thickness_mm: string;
  internal_height_mm: string;
  root_radius_mm: string;
  depth_mm: string;
  cross_sectional_area_cm2: string;
  second_moment_y_cm4: string;
  second_moment_z_cm4: string;
  polar_moment_cm4: string;
  radius_gyration_y_mm: string;
  radius_gyration_z_mm: string;
  polar_radius_gyration_mm: string;
  max_elastic_modulus_y_cm3: string;
  max_elastic_modulus_z_cm3: string;
  elastic_modulus_y_cm3: string;
  elastic_modulus_z_cm3: string;
  shear_area_y_cm2: string;
  shear_area_z_cm2: string;
  torsional_constant_cm4: string;
  torsional_constant_st_venant_cm4: string;
  torsional_modulus_cm3: string;
  max_warping_function_cm2: string;
  warping_constant_cm6: string;
  warping_radius_gyration_mm: string;
  warping_modulus_cm4: string;
  plastic_modulus_y_cm3: string;
  plastic_modulus_z_cm3: string;
  plastic_warping_modulus_cm4: string;
  plastic_modulus_webs_y_cm3: string;
  plastic_modulus_flanges_z_cm3: string;
  plastic_shape_factor_y: string;
  plastic_shape_factor_z: string;
  plastic_warping_shape_factor: string;
  plastic_area_y_cm2: string;
  plastic_area_z_cm2: string;
  plastic_axial_force_kn: string;
  plastic_shear_force_y_kn: string;
  plastic_shear_force_z_kn: string;
  plastic_moment_y_knm: string;
  plastic_moment_z_knm: string;
  ultimate_axial_force_kn: string;
  mass_per_unit_length_kgm: string;
  surface_area_per_unit_length_m2m: string;
  volume_per_unit_length_cm3m: string;
  surface_area_to_volume_ratio_1m: string;
  web_area_cm2: string;
}

export async function getUCSections(): Promise<UCSection[]> {
  try {
    const sections = await db.select().from(ucSections);
    return sections.map(section => {
      const formattedSection = {} as UCSection;
      Object.entries(section).forEach(([key, value]) => {
        formattedSection[key as keyof UCSection] = value?.toString() ?? '';
      });
      return formattedSection;
    });
  } catch (error) {
    console.error('Error fetching UC sections:', error);
    throw new Error('Failed to fetch UC sections');
  }
} 