"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ShipmentsService = class ShipmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
        const trackingNumber = `TRK${Date.now()}`;
        return this.prisma.shipment.create({
            data: {
                ...data,
                trackingNumber,
                createdBy: userId,
            },
        });
    }
    async findAll(filters) {
        return this.prisma.shipment.findMany({
            include: {
                booking: true,
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.shipment.findUnique({
            where: { id },
            include: {
                booking: true,
                user: { select: { id: true, name: true, email: true } },
                manifestItems: {
                    include: {
                        manifest: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.shipment.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.shipment.delete({
            where: { id },
        });
    }
    async getStatistics() {
        const total = await this.prisma.shipment.count();
        const inTransit = await this.prisma.shipment.count({
            where: { status: 'IN_TRANSIT' },
        });
        const delivered = await this.prisma.shipment.count({
            where: { status: 'DELIVERED' },
        });
        const pending = await this.prisma.shipment.count({
            where: { status: 'CREATED' },
        });
        return { total, inTransit, delivered, pending };
    }
};
exports.ShipmentsService = ShipmentsService;
exports.ShipmentsService = ShipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShipmentsService);
//# sourceMappingURL=shipments.service.js.map