import { Controller, Get, Post, Body, Param, NotFoundException, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) {}

    @Post('shorten')
    shorten(@Body() body: CreateUrlDto) {
        return this.urlService.shorten(body.url);
    };

    @Get('stats/:code')
    async getStats(@Param('code') code: string) {
        return this.urlService.getStats(code);
    }

    @Get(':code')
    @Redirect()
    async redirect(@Param('code') code: string) {
        const url = await this.urlService.resolve(code);

        if (!url) {
            throw new NotFoundException();
        }

        return { url: url.originalUrl, statusCode: 302 };
    }
}