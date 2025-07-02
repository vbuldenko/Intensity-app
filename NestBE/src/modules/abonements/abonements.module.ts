import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbonementsService } from './abonements.service';
import { AbonementsController } from './abonements.controller';
import { Abonement, AbonementSchema } from './schemas/abonement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Abonement.name, schema: AbonementSchema },
    ]),
  ],
  controllers: [AbonementsController],
  providers: [AbonementsService],
  exports: [AbonementsService],
})
export class AbonementsModule {}
