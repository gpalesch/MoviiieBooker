import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) {}
    
    @Get('/:page/:search')
    @ApiOperation({
        summary: 'Retrieve movies based on pagination and search query',
      })
      @ApiParam({
        name: 'page',
        type: 'number',
        description: 'Page number for pagination of the results.',
      })
      @ApiParam({
        name: 'search',
        type: 'string',
        description: 'Search term to filter movies.',
      })
      @ApiResponse({
        status: 200,
        description: 'A list of movies matching the provided search term and page.',
      })
      @ApiResponse({
        status: 404,
        description: 'No movies found for the given search term and page.',
      })
        allFilms(@Param('page') page: number, @Param('search') search: string ) {
            return this.movieService.allFilms(page, search);
        }
}
