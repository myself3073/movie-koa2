
const mongoose = require('mongoose')

const Movie = mongoose.model('Movie')

export const getAllMovies = async (type,year) => {
	let query = {}//可查询到所有的数据
	if(type){
		query.movieType = {
			$in:[type]
		}
	}

	if(year){
		query.year = year
	}

	const movies = await Movie.find(query)

	return movies

}

export const getMovieDetail = async id =>await Movie.findOne({_id: id})

export const getRelativeMovies = async movie => await Movie.find({
	movieTypes:{
		$in:movie.movieTypes
	}
})
