import { Stethoscope } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }[];
}

export function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card>
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-muted-foreground h-4 w-4" />
            <CardTitle className="text-base">Médicos</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            <Link href="/doctors">Ver todos</Link>
          </Button>
        </div>

        <div className="space-y-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Avatar className="h-10 w-10">
                  {doctor.avatarImageUrl ? (
                    <AvatarImage src={doctor.avatarImageUrl} />
                  ) : (
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-muted-foreground text-xs">
                  {doctor.specialty}
                </p>
              </div>
              <div className="ml-auto">
                <p className="text-muted-foreground font-medium">
                  {doctor.appointments} agend.
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
