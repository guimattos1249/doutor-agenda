import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { PageContainer } from "@/components/ui/page-container";
import { getDashboard } from "@/data/getDashboard";
import { auth } from "@/lib/auth";

import { columns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCard from "./_components/stats-card";
import { TopDoctors } from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const { from, to } = await searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs()
        .add(1, "month")
        .format("YYYY-MM-DD")}`,
    );
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    dailyAppointmentsData,
    todayAppointments,
    topSpecialties,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session.user.clinic.id,
        },
      },
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral dos pacientes e agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCard
          totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
        <div className="grid grid-cols-[2.25fr_1fr] gap-2">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-[2.25fr_1fr] gap-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="text-muted-foreground" />
                  <CardTitle className="text-base">
                    Agendamentos de Hoje
                  </CardTitle>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={todayAppointments} />
            </CardContent>
          </Card>
          <TopSpecialties specialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
