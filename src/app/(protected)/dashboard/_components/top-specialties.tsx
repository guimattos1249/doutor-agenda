import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  Hospital,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopSpecialtiesProps {
  specialties: {
    specialty: string;
    appointments: number;
  }[];
}

const getSpecialtyIcon = (specialty: string) => {
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (
    specialtyLower.includes("ginecolog") ||
    specialtyLower.includes("obstetri")
  )
    return Baby;
  if (specialtyLower.includes("pediatr")) return Activity;
  if (specialtyLower.includes("dermatolog")) return Hand;
  if (
    specialtyLower.includes("ortoped") ||
    specialtyLower.includes("traumatolog")
  )
    return Bone;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("neurolog")) return Brain;

  return Stethoscope;
};

function TopSpecialties({ specialties }: TopSpecialtiesProps) {
  const maxAppointments = specialties.reduce(
    (sum, item) => sum + item.appointments,
    0,
  );

  return (
    <Card>
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hospital className="text-muted-foreground" />
            <CardTitle className="text-base">Especialidades</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </div>

        <div className="space-y-8">
          {specialties.map((specialty) => {
            const Icon = getSpecialtyIcon(specialty.specialty);
            const percentage = (specialty.appointments / maxAppointments) * 100;
            return (
              <div
                key={specialty.specialty}
                className="flex items-center gap-2"
              >
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <div className="flex w-full flex-col justify-center">
                  <div className="flex w-full justify-between">
                    <h3 className="text-sm">{specialty.specialty}</h3>
                    <div className="text-right">
                      <span className="text-muted-foregrond text-sm font-medium">
                        {specialty.appointments} agend.
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="w-full" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopSpecialties;
