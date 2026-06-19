import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

function getStudentId(req) {
  return req.user.studentId;
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function formatEnrollment(enrollment) {
  return {
    id: enrollment.id,
    nome: enrollment.subject.name,
    cod: enrollment.subject.code,
    turma: enrollment.className,
    prof: enrollment.subject.professor,
    horario: enrollment.schedule,
    sala: enrollment.room,
    status: enrollment.status,
    nota: enrollment.finalNote?.toFixed(1),
    semestre: enrollment.semester,
  };
}

function formatGrade(grade) {
  return {
    id: grade.id,
    nome: grade.subject.name,
    cod: grade.subject.code,
    p1: grade.p1,
    p2: grade.p2,
    substitutiva: grade.substitutiva,
    freq: grade.frequency,
  };
}

function formatInvoice(invoice) {
  return {
    id: invoice.id,
    mes: invoice.month,
    vencimento: formatDate(invoice.dueDate),
    valor: formatCurrency(invoice.amount),
    status: invoice.status,
    dataPagamento: formatDate(invoice.paymentDate),
  };
}

router.get("/dashboard", async (req, res, next) => {
  try {
    const studentId = getStudentId(req);
    const [student, todayClass, pendingInvoice, activeLoan] = await Promise.all([
      prisma.student.findUniqueOrThrow({ where: { id: studentId } }),
      prisma.schedule.findFirst({
        where: { studentId, weekDay: "Sexta-feira" },
        include: { subject: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.invoice.findFirst({
        where: { studentId, status: "Pendente" },
        orderBy: { dueDate: "asc" },
      }),
      prisma.libraryLoan.findFirst({
        where: { studentId, returnedAt: null },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return res.json({
      student: {
        name: student.name,
        firstName: student.name.split(" ")[0],
        registration: student.registration,
        course: student.course,
        currentSemester: student.currentSemester,
      },
      dateLabel: "Sexta-feira, 13 de março de 2026",
      todayClass: todayClass
        ? {
            subjectName: todayClass.subject.name,
            professor: todayClass.subject.professor,
            timeRange: `${todayClass.startTime} - ${todayClass.endTime}`,
            room: todayClass.room,
          }
        : null,
      pendingInvoice: pendingInvoice ? formatInvoice(pendingInvoice) : null,
      activeLoan: activeLoan
        ? {
            id: activeLoan.id,
            title: activeLoan.title,
            dueDate: formatDate(activeLoan.dueDate),
            status: activeLoan.status,
            delayText:
              activeLoan.status === "Atrasado" ? "Atrasado 4 dias" : activeLoan.status,
          }
        : null,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/student-card", async (req, res, next) => {
  try {
    const student = await prisma.student.findUniqueOrThrow({
      where: { id: getStudentId(req) },
    });

    return res.json({
      id: student.id,
      name: student.name,
      firstName: student.name.split(" ")[0],
      registration: student.registration,
      course: student.course,
      currentSemester: student.currentSemester,
      validUntil: student.validUntil,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/disciplines", async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: getStudentId(req) },
      include: { subject: true },
      orderBy: [{ semester: "desc" }, { subject: { name: "asc" } }],
    });

    const current = enrollments
      .filter((enrollment) => enrollment.status === "Matriculado")
      .map(formatEnrollment);

    const history = enrollments
      .filter((enrollment) => enrollment.status !== "Matriculado")
      .map(formatEnrollment);

    return res.json({ current, history });
  } catch (error) {
    return next(error);
  }
});

router.get("/grades", async (req, res, next) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { studentId: getStudentId(req), semester: "2026.1" },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    });

    return res.json(grades.map(formatGrade));
  } catch (error) {
    return next(error);
  }
});

router.get("/invoices", async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { studentId: getStudentId(req) },
      orderBy: { dueDate: "desc" },
    });

    return res.json({
      pending: invoices
        .filter((invoice) => invoice.status === "Pendente")
        .map(formatInvoice),
      history: invoices
        .filter((invoice) => invoice.status !== "Pendente")
        .map(formatInvoice),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/library-loans", async (req, res, next) => {
  try {
    const loans = await prisma.libraryLoan.findMany({
      where: { studentId: getStudentId(req) },
      orderBy: { dueDate: "desc" },
    });

    return res.json(
      loans.map((loan) => ({
        id: loan.id,
        title: loan.title,
        dueDate: formatDate(loan.dueDate),
        returnedAt: formatDate(loan.returnedAt),
        status: loan.status,
      })),
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
