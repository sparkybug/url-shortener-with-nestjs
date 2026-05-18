import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepository: Repository<Url>,
    ) {}

    async shorten(originalUrl: string) {
        const shortCode = Math.random().toString(36).substring(2, 8);
        const url = await this.urlRepository.save({ originalUrl, shortCode });

        return { shortCode: url.shortCode };
    }

    async resolve(shortCode: string) {
        const url = await this.urlRepository.findOneBy({ shortCode });
        if (!url) {
            return null;
        };

        url.clicks++;

        await this.urlRepository.save(url);
        return url;
    }

    async getStats(shortCode: string) {
        const url = await this.urlRepository.findOneBy({ shortCode });
        if (!url) {
            throw new NotFoundException();
        }

        return { 
            originalUrl: url.originalUrl,
            clicks: url.clicks
        };
    }
}
