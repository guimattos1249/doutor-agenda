import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./_components/form";

const ClinicFormPage = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar um clínica</DialogTitle>
          <DialogDescription>
            Adicione uma clínica para começar a usar o sistema.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm />
      </DialogContent>
    </Dialog>
  );
};

export default ClinicFormPage;
