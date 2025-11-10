import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    const bookingNumber = `BK${Date.now()}`;
    return this.prisma.booking.create({
      data: {
        ...data,
        bookingNumber,
        createdBy: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        shipments: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
