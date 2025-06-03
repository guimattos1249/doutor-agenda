"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVerticalIcon, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";

export const columns: ColumnDef<typeof patientsTable.$inferSelect>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.original.phoneNumber;
      if (!phone) return "-";

      const ddd = phone.slice(0, 2);
      const firstPart = phone.slice(2, 7);
      const secondPart = phone.slice(7);

      return `(${ddd}) ${firstPart}-${secondPart}`;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      return params.row.original.sex === "male" ? "Masculino" : "Feminino";
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (params) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{params.row.original.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="h-4 w-4" />
              Editar paciente
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="h-4 w-4" />
              Deletar paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
