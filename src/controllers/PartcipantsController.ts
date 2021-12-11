import { participantes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const ParticipantsController = {
  create: async (req: Request, res: Response) => {
    prisma.$connect();
    const participant = req.body as participantes;
    if (participant.nomeCompleto) {
      const createdParticipant = await prisma.participantes.create({
        data: participant,
      });
      prisma.$disconnect();
      return res.json(createdParticipant).status(201);
    }
    prisma.$disconnect();
    return res.status(400);
  },
  findAll: async (req: Request, res: Response) => {
    prisma.$connect();
    const participantList = await prisma.participantes.findMany();

    return res.json(participantList);
  },
  find: async (req: Request, res: Response) => {
    prisma.$connect();
    const { id } = req.params;
    const participant = await prisma.participantes.findUnique({
      where: {
        id: Number(id),
      },
    });
    prisma.$disconnect();
    if (participant) {
      return res.json(participant);
    }
    return res.status(404).json({ message: "Participante não encontrado" });
  },
  update: async (req: Request, res: Response) => {
    prisma.$connect();
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id é obrigatório" });
    }
    const participantUpdated = req.body;
    const participant = await prisma.participantes.update({
      where: {
        id: Number(id),
      },
      data: participantUpdated,
    });
    prisma.$disconnect();

    if (participant) {
      return res.status(204);
    }
    return res.status(404).json({ message: "participante não encontrado" });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await prisma.participantes.delete({
      where: {
        id: Number(id),
      },
    });
    if (response) {
      return res.status(204);
    }
    return res.json({ message: "Não foi possível deletar este participante" });
  },
};
