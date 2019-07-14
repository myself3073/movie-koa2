import React,{Component} from 'react'

import { Menu } from 'antd'

import Layout from '../../layouts/default.js'

import { request } from '../../lib/'

import Content from './contents.js'

export default class Home extends Component{

	constructor(props){
		super(props)
		this.state = {
			movies:[],
			years: [2025,2024,2023,2022,2021,2020,2019,2018],
			type: this.props.match.params.type,
      		year: this.props.match.params.year
		}
	}

	componentDidMount(){
		this._getAllMovies()
	}

	_selectItem = ({ key })=>{
		this.setState({
			selectedKey:key
		})
	}

	_getAllMovies = ()=>{
		request(window.__LOADING__)({
			method: 'GET',
			url: `/api/v0/movies?type=${this.state.type ||''}&year=${this.state.year ||''}`
		}).then(res=>{
			this.setState({
				movies:res
			})
		}).catch(()=>{
			this.setState({
				movies:[]
			})
		})
	}

	_renderContent = ()=>{
		const { movies } = this.state
		if(!movies || movies.length === 0) return null

		return (<Content movies={movies} />)
	}

	render (){
		const { years,selectedKey } = this.state

		return (
			<Layout {...this.props}>
				<div className='flex-row full' style={{ width:'15%' }}>
					<Menu className='align-self-start'
						mode='inline' 
						theme='dark'
						defaultSelectedKeys={[selectedKey]}
						onSelect={this._selectItem}
						style={{height:'100%',maxWidth:220,minWidth:100,overflowY: 'scroll',}}
					>
					{
						years.map((e,i)=>(
							<Menu.Item key={i}>
							<a href={`/year/${e}`} style={{textAlign:'center'}}>{e}年上映</a>
							</Menu.Item>
						))
					}
					</Menu>
				</div>
				<div className='flex-1 scroll-y align-self-start' style={{width:'85%',position:'absolute',
					right:0,top:0}}>
		            {this._renderContent()}
		        </div>
			</Layout>
		)
	}
}