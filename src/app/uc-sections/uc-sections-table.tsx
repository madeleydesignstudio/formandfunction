'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BeamRenderer } from '@/components/beam-renderer';

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

interface UCSectionsTableProps {
  sections: UCSection[];
}

export function UCSectionsTable({ sections }: UCSectionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'section',
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedSection, setSelectedSection] = useState<UCSection | null>(null);

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
      header: createSortableHeader('Radius Gyration Y (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'radius_gyration_z_mm',
      header: createSortableHeader('Radius Gyration Z (mm)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'polar_radius_gyration_mm',
      header: createSortableHeader('Polar Radius Gyration (mm)'),
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
      header: createSortableHeader('Torsional Constant St Venant (cm⁴)'),
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
      header: createSortableHeader('Warping Radius Gyration (mm)'),
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
      header: createSortableHeader('Mass Per Unit Length (kg/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'surface_area_per_unit_length_m2m',
      header: createSortableHeader('Surface Area Per Unit Length (m²/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'volume_per_unit_length_cm3m',
      header: createSortableHeader('Volume Per Unit Length (cm³/m)'),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'surface_area_to_volume_ratio_1m',
      header: createSortableHeader('Surface Area To Volume Ratio (1/m)'),
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

  const formatValue = (key: string, value: string) => {
    // Add units based on the property
    if (key.includes('_mm')) return `${value} mm`;
    if (key.includes('_cm2')) return `${value} cm²`;
    if (key.includes('_cm3')) return `${value} cm³`;
    if (key.includes('_cm4')) return `${value} cm⁴`;
    if (key.includes('_cm6')) return `${value} cm⁶`;
    if (key.includes('_kn')) return `${value} kN`;
    if (key.includes('_knm')) return `${value} kNm`;
    if (key.includes('_kgm')) return `${value} kg/m`;
    if (key.includes('_m2m')) return `${value} m²/m`;
    if (key.includes('_cm3m')) return `${value} cm³/m`;
    if (key.includes('_1m')) return `${value} 1/m`;
    return value;
  };

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter sections..."
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
                  <TableHead key={header.id} className="border-x">
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedSection(row.original)}
                >
                  {row.getVisibleCells().map((cell: Cell<UCSection, unknown>) => (
                    <TableCell key={cell.id} className="border-x">
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

      <Dialog open={!!selectedSection} onOpenChange={() => setSelectedSection(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSection?.section} - Detailed Information</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {selectedSection && Object.entries(selectedSection).map(([key, value]) => (
                  <div key={key} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatKey(key)}
                    </span>
                    <span className="text-sm">
                      {formatValue(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {selectedSection && (
                <BeamRenderer section={selectedSection} type="UC" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 