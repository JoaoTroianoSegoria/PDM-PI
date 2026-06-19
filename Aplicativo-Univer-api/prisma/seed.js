import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

const DEMO_CPF = "52998224725";

async function main() {
  await prisma.libraryLoan.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();

  const student = await prisma.student.create({
    data: {
      name: "João Pedro",
      registration: "2512130067",
      cpf: DEMO_CPF,
      course: "Ciência da Computação",
      currentSemester: "5º Semestre",
      validUntil: "12/2027",
    },
  });

  await prisma.user.create({
    data: {
      name: student.name,
      email: "joao.pedro@univer.edu.br",
      registration: student.registration,
      cpfHash: await bcrypt.hash(DEMO_CPF, 10),
      studentId: student.id,
    },
  });

  const subjectData = [
    {
      name: "Cálculo Numérico",
      code: "MAT201",
      professor: "Prof. Valnei Alves Fernandes",
    },
    {
      name: "Computação Gráfica",
      code: "MCA304",
      professor: "Prof. Sofia Mitsuyo Taguchi da Cunha",
    },
    {
      name: "Projeto Integrador",
      code: "BDC312",
      professor: "Prof. Marcelo Alves Farias",
    },
    {
      name: "Banco de Dados",
      code: "BDC205",
      professor: "Prof. Ana Beatriz Ribeiro",
    },
    {
      name: "Algoritmos e Estruturas de Dados",
      code: "ALG201",
      professor: "Prof. Carlos Henrique Lima",
    },
    {
      name: "Lógica de Programação",
      code: "LOG100",
      professor: "Prof. Fernanda Souza",
    },
    {
      name: "Matemática Discreta",
      code: "MAT105",
      professor: "Prof. Bruno Martins",
    },
  ];

  const subjects = await Promise.all(
    subjectData.map((data) => prisma.subject.create({ data })),
  );

  const subjectByCode = Object.fromEntries(
    subjects.map((subject) => [subject.code, subject]),
  );

  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student.id,
        subjectId: subjectByCode.MAT201.id,
        className: "Turma A",
        schedule: "Segunda-feira 8:15 - 11:00",
        room: "Sala PCA2",
        semester: "2026.1",
        status: "Matriculado",
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.MCA304.id,
        className: "Turma B",
        schedule: "Segunda-feira 11:00 - 12:15",
        room: "Sala PCB1",
        semester: "2026.1",
        status: "Matriculado",
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.BDC312.id,
        className: "Turma A",
        schedule: "Sexta-feira 11:00 - 12:15",
        room: "Sala PJB5",
        semester: "2026.1",
        status: "Matriculado",
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.ALG201.id,
        className: "Turma A",
        schedule: "Terça-feira 8:15 - 11:00",
        room: "Sala PCA1",
        semester: "2025.2",
        status: "Aprovado",
        finalNote: 8.5,
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.LOG100.id,
        className: "Turma A",
        schedule: "Quarta-feira 8:15 - 11:00",
        room: "Sala PCA3",
        semester: "2025.1",
        status: "Aprovado",
        finalNote: 9.0,
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.MAT105.id,
        className: "Turma B",
        schedule: "Quinta-feira 19:00 - 21:40",
        room: "Sala PCB2",
        semester: "2025.1",
        status: "Aprovado",
        finalNote: 7.8,
      },
    ],
  });

  await prisma.grade.createMany({
    data: [
      {
        studentId: student.id,
        subjectId: subjectByCode.MCA304.id,
        semester: "2026.1",
        p1: 7.5,
        p2: 8.0,
        substitutiva: null,
        frequency: 85,
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.MAT201.id,
        semester: "2026.1",
        p1: 9.0,
        p2: 8.2,
        substitutiva: null,
        frequency: 73,
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.BDC312.id,
        semester: "2026.1",
        p1: 8.5,
        p2: 9.7,
        substitutiva: null,
        frequency: 100,
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.BDC205.id,
        semester: "2026.1",
        p1: 6.5,
        p2: null,
        substitutiva: null,
        frequency: 82,
      },
    ],
  });

  await prisma.schedule.createMany({
    data: [
      {
        studentId: student.id,
        subjectId: subjectByCode.MAT201.id,
        weekDay: "Segunda-feira",
        startTime: "8:15",
        endTime: "11:00",
        room: "Sala PCA2",
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.MCA304.id,
        weekDay: "Segunda-feira",
        startTime: "11:00",
        endTime: "12:15",
        room: "Sala PCB1",
      },
      {
        studentId: student.id,
        subjectId: subjectByCode.BDC312.id,
        weekDay: "Sexta-feira",
        startTime: "11:00",
        endTime: "12:15",
        room: "Sala PJB5",
      },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      {
        studentId: student.id,
        month: "Março/2026",
        dueDate: new Date("2026-03-20T00:00:00.000Z"),
        amount: 850,
        status: "Pendente",
      },
      {
        studentId: student.id,
        month: "Fevereiro/2026",
        dueDate: new Date("2026-02-20T00:00:00.000Z"),
        amount: 850,
        status: "Pago",
        paymentDate: new Date("2026-02-19T00:00:00.000Z"),
      },
      {
        studentId: student.id,
        month: "Janeiro/2026",
        dueDate: new Date("2026-01-20T00:00:00.000Z"),
        amount: 850,
        status: "Pago",
        paymentDate: new Date("2026-01-15T00:00:00.000Z"),
      },
    ],
  });

  await prisma.libraryLoan.create({
    data: {
      studentId: student.id,
      title: "Algoritmos e Estruturas de Dados",
      dueDate: new Date("2026-03-19T00:00:00.000Z"),
      status: "Atrasado",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
