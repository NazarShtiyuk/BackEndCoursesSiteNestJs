import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/findTopPage.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/createTopPage.dto';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { pageNotFoundError } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('topPage')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) {
      throw new NotFoundException(pageNotFoundError);
    }
    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) {
      throw new NotFoundException(pageNotFoundError);
    }
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedPage = await this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(pageNotFoundError);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: CreateTopPageDto) {
    const updatePage = await this.topPageService.update(id, dto);
    if (!updatePage) {
      throw new NotFoundException(pageNotFoundError);
    }
    return updatePage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('textSearch/:text')
  async findByText(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  }
}
