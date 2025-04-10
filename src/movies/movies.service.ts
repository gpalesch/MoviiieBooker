import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) { }
    
    async allFilms(page: number, search: string): Promise<AxiosResponse> {
        const API_KEY = this.configService.get<string>('API_KEY');
        const API_URL = this.configService.get<string>('API_URL');

        const response = await firstValueFrom(
            this.httpService.get(API_URL +
                `search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
              {
                headers: {
                  accept: 'application/json',
                  Authorization:
                    `Bearer ${API_KEY}`,
                }
              },
            ),
          );

          return response.data;
        }
    }