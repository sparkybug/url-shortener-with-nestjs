import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
    let urlController: UrlController;
    let mockService: any;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UrlController],
            providers: [
                {
                    provide: UrlService,
                    useValue: {
                        shorten: jest.fn().mockResolvedValue({
                            shortCode: 'abc123',
                        }),

                        resolve: jest.fn().mockResolvedValue({
                            originalUrl: 'https://thisisosinachilearningnestjs.com',
                            shortCode: 'abc123',
                            clicks: 0,
                        }),

                        getStats: jest.fn().mockResolvedValue({
                            originalUrl: 'https://thisisosinachilearningnestjs.com',
                            clicks: 0,
                        }),
                    },
                },
            ],
        }).compile();

        urlController = app.get<UrlController> (UrlController);
        mockService = app.get(UrlService);
    });

    describe('shorten', () => {
        it('should return an object with a shortCode', async () => {
            const result = await urlController.shorten({
                url: 'https://thisisosinachilearningnestjs.com'
            });

            expect(result).toHaveProperty('shortCode');
        })
    });

    describe('redirect', () => {
        it('should redirect to the original url', async () => {
            const result = await urlController.redirect('abc123');
            expect(result).toEqual({ url: 'https://thisisosinachilearningnestjs.com', statusCode: 302 });
        })
    });

    describe('redirect not found', () => {
        it('should throw NotFoundException for invalid short codes', async () => {
            jest.spyOn(mockService, 'resolve').mockResolvedValueOnce(null);
        
            await expect(urlController.redirect('invalid')).rejects.toThrow(NotFoundException);
        })
    });

    describe('getStats', () => {
        it('should return originalUrl and clicks', async () => {
            const result = await urlController.getStats('abc123');
            expect(result).toHaveProperty('originalUrl');
            expect(result).toHaveProperty('clicks');
        });
    });
})