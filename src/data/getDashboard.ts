import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

interface Params {
  from: string;
  to: string;
  session: {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}

export const getDashboard = async ({ from, to, session }: Params) => {
  const chartStartData = dayjs(from)
    .subtract(10, "days")
    .startOf("day")
    .toDate();
  const chartEndData = dayjs(to).add(10, "days").endOf("day").toDate();

  const fromDate = dayjs(from).startOf("day").toDate();
  const toDate = dayjs(to).endOf("day").toDate();

  const [
    [totalRevenue],
    [totalAppointments],
    [totalPatients],
    [totalDoctors],
    topDoctors,
    dailyAppointmentsData,
    todayAppointments,
    topSpecialties,
  ] = await Promise.all([
    // Total de receita
    db
      .select({
        total: sum(appointmentsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      ),

    // Total de agendamentos
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      ),

    // Total de pacientes
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),

    // Total de médicos
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),

    // Top 5 médicos mais agendados
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      )
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(5),

    // Agendamentos por dia
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        appointments: count(appointmentsTable.id),
        revenue:
          sql<number>`SUM(${appointmentsTable.appointmentPriceInCents})`.as(
            "revenue",
          ),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, chartStartData),
          lte(appointmentsTable.date, chartEndData),
        ),
      )
      .groupBy(sql<string>`DATE(${appointmentsTable.date})`)
      .orderBy(sql<string>`DATE(${appointmentsTable.date})`),

    // Agendamentos de hoje
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        gte(appointmentsTable.date, dayjs().startOf("day").toDate()),
        lte(appointmentsTable.date, dayjs().endOf("day").toDate()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),

    // Top 5 especialidades mais agendadas
    db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(
        doctorsTable,
        and(eq(appointmentsTable.doctorId, doctorsTable.id)),
      )
      .where(
        and(
          eq(doctorsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, fromDate),
          lte(appointmentsTable.date, toDate),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(5),
  ]);

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    dailyAppointmentsData,
    todayAppointments,
    topSpecialties,
  };
};
