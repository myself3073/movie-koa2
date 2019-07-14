/*
业务核心
 */
import React, { Component } from 'react'
// routes.js===>component: AC(() => import('./views/home'))
export default (loadComponent, placeholder = '正在加载中') => {
  return class AsyncComponent extends Component {
    unmount = false

    constructor (props) {
      super(props)
      this.state = {
        Child: null
      }
    }

    componentWillUnmount () {
      this.unmount = true
    }

    async componentDidMount () {
      const { default: Child } = await loadComponent()

      if (this.unmount) return

      this.setState({
        Child
      })
    }

    render () {
      const { Child } = this.state

      return (
        Child
          ? <Child {...this.props} />
          : placeholder
      )
    }
  }
}
