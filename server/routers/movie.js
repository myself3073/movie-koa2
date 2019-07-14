
const mongoose = require('mongoose')

const { 
	getAllMovies,
	getMovieDetail,
	getRelativeMovies
	 } = require('../service/movie.js')

const { 
	get,
	post,
	put,
	controller
 } = require('../lib/decorator.js')


@controller('/api/v0/movies')
export class movieController{
	@get('/')
	async getMovies (ctx,next) {
		
		let  { type,year } = ctx.query

		let movies = await getAllMovies(type,year)

		ctx.body = {
			success: true,
			data: movies
		}
	}

	@get('/:id')
	async getMoviesDetail (ctx,next){
	    const id = ctx.params.id
	    const movie = await getMovieDetail(id)
	    const RelativeMovies = getRelativeMovies(movie) 
	    ctx.body = {
	      success: true,
	      data: {
	      	movie,
	      	RelativeMovies
	      }
    	}
	}




}