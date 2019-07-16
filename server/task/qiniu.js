/*
把爬取来的{电影预告短片，boBanId,封面，海豹}存到七牛云
 */
const qiniu = require('qiniu')
const nanoID = require('nanoid')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const myConfig = require('../../config')

const mac = new qiniu.auth.digest.Mac(myConfig.qiniu.AK, myConfig.qiniu.SK)
let config = new qiniu.conf.Config()
let bucketManager = new qiniu.rs.BucketManager(mac, config)
const bucket = myConfig.qiniu.bucket


const uploadToQiniu = async (url,key)=>{
	return new Promise((resolve,reject)=>{
		bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
	  	if (err) {
	    	reject(err)
	  	} else {
		    if (respInfo.statusCode == 200) {
		      // console.log(respBody.key)
		      resolve({key})
		    } else {
		      reject(respInfo)
		    }
	  }
})
	})
}

;(async ()=>{
	
	let movies = await Movie.find({
		$or:[{videoKey:{ $exists: true }},{videoKey:''},{videoKey:null}]
	})
	for (let i = 0; i < movies.length; i++) {
		let movie = movies[i]
		if(movie.video && !movie.videoKey){
			try{
				console.log('开始传 video......')
        		let videoData = await uploadToQiniu(movie.video, nanoID() + '.mp4')
        		if(videoData){
        			movie.videoKey = videoData.key
        		}
        		await movie.save()
			}catch(e){
				console.log(e)
			}
		}
	}
})()