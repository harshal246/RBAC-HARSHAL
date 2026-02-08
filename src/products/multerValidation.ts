import { ParseFilePipeBuilder } from '@nestjs/common';

export const imageValidationPipe = new ParseFilePipeBuilder()
.addFileTypeValidator({ 
    fileType: 'image/(jpeg|png|webp)',
    skipMagicNumbersValidation: true  
  })
  .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 }) 
  .build({ fileIsRequired: false}); 