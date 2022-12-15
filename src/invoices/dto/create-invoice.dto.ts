import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InvoicePaymentTerms, InvoiceStatus } from '../schemas/invoice.schema';
import { AddressDto } from './address.dto';
import { ClientDto } from './client.dto';
import { ItemDto } from './item.dto';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsEnum(InvoicePaymentTerms)
  readonly paymentTerms: number;

  @ApiProperty()
  @IsEnum(InvoiceStatus)
  readonly status: InvoiceStatus;

  @ApiProperty()
  @IsNumber()
  readonly total: number;

  @ApiProperty()
  @IsDateString()
  readonly createdAt: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => ClientDto)
  readonly client: ClientDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly sender: AddressDto;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];
}
