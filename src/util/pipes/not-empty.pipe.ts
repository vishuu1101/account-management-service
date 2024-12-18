import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const propertyName = metadata.data;
    if (!value || value.trim() === '') {
      throw new BadRequestException(`${propertyName} must not be empty`);
    }
    return value;
  }
}
