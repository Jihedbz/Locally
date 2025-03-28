"use client"
import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import AddProjectDialog from "./addProjectDialog";  // Import the AddProjectDialog component

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

const PROJECTS_FILE = "projects/projects.json";

const Projects = () => {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Load projects from file on startup
  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await readTextFile(PROJECTS_FILE, { baseDir: BaseDirectory.AppData });
        setProjects(JSON.parse(data));
      } catch (error) {
        console.log("No projects found, initializing empty list.");
      }
    };

    loadProjects();
  }, []);

  // Define columns
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Project Name <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const projectName = row.getValue("name");
        return (
          <div className="flex items-center">
            {/* Add AngularJS icon if project type is Angular */}
            {row.getValue("type") === "Angular" && (
              <i className="devicon-angularjs-plain colored mr-2"></i>
            )}
    
            {/* Add React icon if project type is React */}
            {row.getValue("type") === "React" && (
              <i className="devicon-react-original colored mr-2"></i>
            )}
    
            {/* Display the project name */} 
            <span>{projectName as string}</span>
          </div>
        );
      },
    },    
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "path",
      header: "Path",
      cell: ({ row }) => <div>{row.getValue("path")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Actions</span>
            <MoreHorizontal />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });



  const handleAddProject = async (newProject: any) => {
    const updatedProjects = [...projects, newProject];  // Add the new project to the current list of projects
    setProjects(updatedProjects);  // Update the state with the new list

    try {
      // Attempt to write the updated list of projects back to the file
      await writeTextFile(PROJECTS_FILE, JSON.stringify(updatedProjects, null, 2), { baseDir: BaseDirectory.AppData });
    } catch (error) {
      // If writing fails, log the error and show an alert
      console.error("Failed to save project:", error);
      alert("Error saving project!");
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-6">
      <div className="min-h-[35%] p-4 flex items-center justify-center text-xl font-semibold">
        Welcome to the Projects Page!
      </div>

      {/* Add Project dialog and input for filtering */}
      <AddProjectDialog onAddProject={handleAddProject} />
      <Separator className="my-6 border-t border-gray-300" />
      <Input
        placeholder="Filter project names..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <Separator className="my-6 border-t border-gray-300" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
