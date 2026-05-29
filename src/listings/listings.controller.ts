import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createListing(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    console.log('REQUEST HIT');
    console.log(body);
    console.log(files);

    return this.listingsService.createListing(body, files);
  }

  @Get()
  async getAll() {
    return this.listingsService.getAll();
  }

  @Patch(':id/sold')
  markAsSold(@Param('id') id: string) {
    return this.listingsService.markAsSold(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.listingsService.deleteListing(id);
  }
}
