import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/createReview.dto';
import { ReviewService } from './review.service';
import { reviewNotFound } from './review.constants';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { IdValidationPipe } from '../pipes/idValidation.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new NotFoundException(reviewNotFound);
    }
    return deletedDoc;
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async byProductId(@Param('productId', IdValidationPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }
}
