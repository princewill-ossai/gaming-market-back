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
  UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';

import { FilesInterceptor } from '@nestjs/platform-express';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Patch(':id/sold')
  markAsSold(@Param('id') id: string) {
    return this.listingsService.markAsSold(id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.listingsService.deleteListing(id);
  }
}
