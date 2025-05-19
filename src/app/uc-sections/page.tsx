'use client';

import { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  useReactTable,
  HeaderGroup,
  Row,
  Cell,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Column } from '@tanstack/react-table';

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

export default function UCSectionsPage() {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'section',
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sections, setSections] = useState<UCSection[]>([]);

  const createSortableHeader = (title: string) => {
    const SortableHeader = ({ column }: { column: Column<UCSection> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {title}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    };
    SortableHeader.displayName = `SortableHeader(${title})`;
    return SortableHeader;
  };

  const columns: ColumnDef<UCSection>[] = [
    {
      accessorKey: 'section',
      header: createSortableHeader('Section'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'height_mm',
      header: createSortableHeader('Height (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'width_mm',
      header: createSortableHeader('Width (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'web_thickness_mm',
      header: createSortableHeader('Web Thickness (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'flange_thickness_mm',
      header: createSortableHeader('Flange Thickness (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'internal_height_mm',
      header: createSortableHeader('Internal Height (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'root_radius_mm',
      header: createSortableHeader('Root Radius (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'depth_mm',
      header: createSortableHeader('Depth (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'cross_sectional_area_cm2',
      header: createSortableHeader('Cross Sectional Area (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'second_moment_y_cm4',
      header: createSortableHeader('Second Moment Y (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'second_moment_z_cm4',
      header: createSortableHeader('Second Moment Z (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'polar_moment_cm4',
      header: createSortableHeader('Polar Moment (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'radius_gyration_y_mm',
      header: createSortableHeader('Radius of Gyration Y (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'radius_gyration_z_mm',
      header: createSortableHeader('Radius of Gyration Z (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'polar_radius_gyration_mm',
      header: createSortableHeader('Polar Radius of Gyration (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'max_elastic_modulus_y_cm3',
      header: createSortableHeader('Max Elastic Modulus Y (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'max_elastic_modulus_z_cm3',
      header: createSortableHeader('Max Elastic Modulus Z (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'elastic_modulus_y_cm3',
      header: createSortableHeader('Elastic Modulus Y (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'elastic_modulus_z_cm3',
      header: createSortableHeader('Elastic Modulus Z (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'shear_area_y_cm2',
      header: createSortableHeader('Shear Area Y (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'shear_area_z_cm2',
      header: createSortableHeader('Shear Area Z (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'torsional_constant_cm4',
      header: createSortableHeader('Torsional Constant (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'torsional_constant_st_venant_cm4',
      header: createSortableHeader('Torsional Constant St. Venant (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'torsional_modulus_cm3',
      header: createSortableHeader('Torsional Modulus (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'max_warping_function_cm2',
      header: createSortableHeader('Max Warping Function (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'warping_constant_cm6',
      header: createSortableHeader('Warping Constant (cm⁶)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'warping_radius_gyration_mm',
      header: createSortableHeader('Warping Radius of Gyration (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'warping_modulus_cm4',
      header: createSortableHeader('Warping Modulus (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_modulus_y_cm3',
      header: createSortableHeader('Plastic Modulus Y (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_modulus_z_cm3',
      header: createSortableHeader('Plastic Modulus Z (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_warping_modulus_cm4',
      header: createSortableHeader('Plastic Warping Modulus (cm⁴)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_modulus_webs_y_cm3',
      header: createSortableHeader('Plastic Modulus Webs Y (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_modulus_flanges_z_cm3',
      header: createSortableHeader('Plastic Modulus Flanges Z (cm³)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_shape_factor_y',
      header: createSortableHeader('Plastic Shape Factor Y'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_shape_factor_z',
      header: createSortableHeader('Plastic Shape Factor Z'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_warping_shape_factor',
      header: createSortableHeader('Plastic Warping Shape Factor'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_area_y_cm2',
      header: createSortableHeader('Plastic Area Y (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_area_z_cm2',
      header: createSortableHeader('Plastic Area Z (cm²)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_axial_force_kn',
      header: createSortableHeader('Plastic Axial Force (kN)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_shear_force_y_kn',
      header: createSortableHeader('Plastic Shear Force Y (kN)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_shear_force_z_kn',
      header: createSortableHeader('Plastic Shear Force Z (kN)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_moment_y_knm',
      header: createSortableHeader('Plastic Moment Y (kNm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'plastic_moment_z_knm',
      header: createSortableHeader('Plastic Moment Z (kNm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'ultimate_axial_force_kn',
      header: createSortableHeader('Ultimate Axial Force (kN)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'mass_per_unit_length_kgm',
      header: createSortableHeader('Mass per Unit Length (kg/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'surface_area_per_unit_length_m2m',
      header: createSortableHeader('Surface Area per Unit Length (m²/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'volume_per_unit_length_cm3m',
      header: createSortableHeader('Volume per Unit Length (cm³/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'surface_area_to_volume_ratio_1m',
      header: createSortableHeader('Surface Area to Volume Ratio (1/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'web_area_cm2',
      header: createSortableHeader('Web Area (cm²)'),
      enableColumnFilter: true,
    },
  ];

  const table = useReactTable({
    data: sections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/uc-sections');
        const data = await response.json();
        console.log('Fetched sections:', data);
        console.log('First section:', data[0]);
        setSections(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter all columns..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<UCSection>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<UCSection>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell: Cell<UCSection, unknown>) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 