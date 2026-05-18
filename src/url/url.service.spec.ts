import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './url.entity';

describe('UrlService', () => {
    let urlService: UrlService;

    // mock repository so that i can access my db w/o actually accessing it
    const mockRepository = {
        save: jest.fn().mockResolvedValue({
            id: 1,
            shortCode: 'abc123',
            originalUrl: 'https://thisisosinachilearningnestjs.com',
            clicks: 0
        }),
        findOneBy: jest.fn().mockResolvedValue({
            id: 1,
            shortCode: 'abc123',
            originalUrl: 'https://thisisosinachilearningnestjs.com',
            clicks: 0
        })
    }

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                UrlService,
                {
                    provide: getRepositoryToken(Url),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        urlService = app.get<UrlService> (UrlService);
    });

    describe('shorten', () => {
        it('should return an object with a shortCode string', async () => {
            const result = await urlService.shorten('https://thisisosinachilearningnestjs.com');

            expect(result).toHaveProperty('shortCode');
            expect(typeof result.shortCode).toBe('string');
            expect(result.shortCode.length).toBeGreaterThan(0);
            expect(mockRepository.save).toHaveBeenCalled();
        })
    });

    describe('resolve', () => {
        it('should resolve the short code in the DB and return its entity', async () => {
            const resolved = await urlService.resolve('abc123');
            expect(resolved).toBeDefined();
            expect(resolved).toHaveProperty('id');
            expect(resolved).toHaveProperty('shortCode');
            expect(resolved).toHaveProperty('originalUrl');
            expect(resolved).toHaveProperty('clicks');
        });

        it('should return url stats with originalUrl and clicks', async () => {
            const result = await urlService.getStats('abc123');
            expect(result).toHaveProperty('originalUrl');
            expect(result).toHaveProperty('clicks');
        });

        it('should increment clicks and save', async () => {
            mockRepository.save.mockClear();
            await urlService.resolve('abc123');
            expect(mockRepository.save).toHaveBeenCalled();
        })
    })
});
