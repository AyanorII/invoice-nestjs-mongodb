import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
  readonly code: string;

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
  @ValidateNested()
  @Type(() => ClientDto)
  readonly client: ClientDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  readonly sender: AddressDto;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];
}
