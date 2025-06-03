"use client";

import { ColumnDef } from "@tanstack/react-table";

import { patientsTable } from "@/db/schema";

import { PatientTableActions } from "./table-actions";

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
      return <PatientTableActions patient={params.row.original} />;
    },
  },
];
