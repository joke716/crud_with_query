import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .addBearerAuth()
      .setTitle('MiHyuns blog API')
      .setDescription('The is a MiHyuns blog Rest API')
      .setVersion('1.0')
      .build();
  }
}
