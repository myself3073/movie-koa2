import React from 'react'

import { Link } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/zh-cn'

import {
	Row,
	Col,
	Card,
	Badge,
	Icon,
	Modal,
	Spin

} from 'antd'

export default class Content extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			visible: false
		}

	}


	// 解决403图片缓存问题
	_getImages = (_url)=>{
	    if( _url !== undefined ){
	        let _u = _url.substring( 7 );
	        return 'https://images.weserv.nl/?url=' + _u;
	    }
	}

	_cancelHandle = ()=>{
		this.setState({
			visible: false
		})
	}

	// _showModal = (movie)=>{
	// 	this.setState({
	// 		visible: true
	// 	})
	// 	const { cover,video } = movie
	// 	setTimeout(()=>{
	// 		document.getElementById('videoPlayer').src = video
	// 		},500)
 //        }
 //        
 	_showModal = (movie) => {
    this.setState({
      visible: true
    })

    const { cover } = movie

    let video = movie.video.replace('http','https')
    console.log(video)

    if (!this.player) {
      setTimeout(() => {
        this.player = new DPlayer({
          container: document.getElementsByClassName('videoModal')[0],
          screenshot: true,
          autoplay: true,
          video: {
            url: 'http://pu1mgwmww.bkt.clouddn.com/THgmKpFOC5_P66NYAebfN.mp4',
            pic: cover,
            thumbnails: cover
          }
        })
      }, 500)
    } else {
      if (this.player.video.currentSrc !== video) {
        this.player.switchVideo({
          url: 'http://pu1mgwmww.bkt.clouddn.com/THgmKpFOC5_P66NYAebfN.mp4',
          autoplay: true,
          pic: cover,
          type: 'auto'
        })
      }

      this.player.play()
    }
  }

	_jumpToDetail = ()=>{
		// console.log(this)
		const { URL } = this.props
		URL && window.open(URL)
	}


	_renderContent = ()=>{
		const { movies } = this.props
		return(
			<div style={{padding:'5px'}}>
				<Row>
					{
						movies.map((e,i)=>(
						<Col key={i}
							xl={{span: 6}}
			                lg={{span: 8}}
			                md={{span: 12}}
			                sm={{span: 24}}
			                style={{marginBottom: '8px',boxSizing:'border-box'}}
						>
						<Card
						    hoverable
						    
						    style={{ width: '100%' }}
						    bodyStyle={{padding: '24px 0'}}
						    actions={[
		                    <Badge>
		                      <Icon style={{marginRight: '2px'}} type='clock-circle' />
		                      {moment(e.meta.createdAt).fromNow(true)} 前更新
		                    </Badge>,
		                    <Badge>
		                      <Icon style={{marginRight: '2px'}} type='star' />
		                      {e.rate} 分
		                    </Badge>
		                  	]}
						    // cover={<img alt={e.title} onClick={this._showModal(e)} src={e.poster} style={{ width:'100%',height:'426px' }}/>}
						    cover={<img alt={e.title} onClick={()=>{this._showModal(e)}} src={this._getImages(e.poster)} style={{ width:'100%',height:'426px' }}/>}
						  >
							<Card.Meta style={{height: '202px',width: '100%', overflow: 'hidden'}}
		                    title={<Link to={`/detail/${e._id}`}>{e.title}</Link>}
		                    onClick={this._jumpToDetail}
		                    description={<Link to={`/detail/${e._id}`}>{e.summary}</Link>} />
						 </Card>
						</Col>
						))
					}
				</Row>
				<Modal className='videoModal'
					closable={true}
					footer={null}
					visible={this.state.visible}
					onCancel={this._cancelHandle}
					style={{width: '1000px',height: '800px'}}
					bodyStyle={{ padding: '0px' }}
					>
					<video src="" id="videoPlayer" width={'100%'} height={'100%'} autobuffer="true" controls></video>
				</Modal>
			</div>
		)
	}

	render(){
		return (
			<div style={{ padding:'10px' }}>
				{this._renderContent()}
			</div>
		)
	}
}