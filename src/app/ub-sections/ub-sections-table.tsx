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

interface UBSection {
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

interface UBSectionsTableProps {
  sections: UBSection[];
}

export function UBSectionsTable({ sections }: UBSectionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'section',
      desc: false,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedSection, setSelectedSection] = useState<UBSection | null>(null);

  const createSortableHeader = (title: string) => {
    const SortableHeader = ({ column }: { column: Column<UBSection> }) => {
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

  const columns: ColumnDef<UBSection>[] = [
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
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<UBSection>) => (
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
              table.getRowModel().rows.map((row: Row<UBSection>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedSection(row.original)}
                >
                  {row.getVisibleCells().map((cell: Cell<UBSection, unknown>) => (
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
                <BeamRenderer section={selectedSection} type="UB" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 