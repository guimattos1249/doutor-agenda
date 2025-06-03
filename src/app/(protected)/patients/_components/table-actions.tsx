import { Edit, MoreVerticalIcon, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";

import { UpsertPatientForm } from "./upsert-patient-form";

export function PatientTableActions({
  patient,
}: {
  patient: typeof patientsTable.$inferSelect;
}) {
  const [upsertPatientDialogIsOpen, setUpsertPatientDialogIsOpen] =
    useState(false);
  return (
    <Dialog
      open={upsertPatientDialogIsOpen}
      onOpenChange={setUpsertPatientDialogIsOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpsertPatientDialogIsOpen(true)}>
            <Edit className="h-4 w-4" />
            Editar paciente
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="h-4 w-4" />
            Deletar paciente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        isOpen={upsertPatientDialogIsOpen}
        patient={patient}
        onSuccess={() => setUpsertPatientDialogIsOpen(false)}
      />
    </Dialog>
  );
}
