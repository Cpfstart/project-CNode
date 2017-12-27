import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Menu } from 'antd'
import queryString from 'query-string'
import { getTopics } from '../../redux/topic.reducer'
import TopicList from '../topic-list/topic-list'
import { tabSchema } from '../../utils/schema'

const style = {
  root: {
    padding: '40px 0',
    flex: 1,
  },
  menuPc: {
    lineHeight: '64px', 
    border: 'none', 
    textAlign: 'center',
  },
  menuMb: {
    paddingLeft: '10vw'
  },
}

@connect(
  state => state.topicReducer,
  { getTopics }
)
class TopicIndex extends Component {
  state = {
    initTab: 'all',
    defaultPage: 1,
    pageSize: 10,
    pageLen: 500
  }
  
  componentDidMount() {
    this.props.getTopics(this.getQueryData())
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.getTopics(this.getQueryData(nextProps.location.search))
    }
  }
  
  menuClick = (e) => {
    this.props.history.push({
      pathname: '/index',
      search: `?tab=${e.key}`
    })
  }
  
  pageChange = (page) => {
    const { tab } = this.getQueryData()
    
    this.props.history.push({
      pathname: '/index',
      search: `?tab=${tab}&page=${page}`
    })
  }
  
  getQueryData = (search) => {
    const s = search || this.props.location.search
    const q = s ? queryString.parse(s) : {}
    const { initTab, defaultPage, pageSize } = this.state
    return {
      tab: q.tab || initTab,
      page: q.page * 1 || defaultPage,
      limit: pageSize
    }
  }

  render() {
    const { topics, loading } = this.props
    const { tab: tabKey, page: currentPage, limit: pageSize } = this.getQueryData()

    const menuItems = Object.keys(tabSchema).map((itemKey) => (
      <Menu.Item key={itemKey}>{tabSchema[itemKey]}</Menu.Item>
    ))
    
    return (
      <div style={style.root}>
        <Row>
          <Col xxl={4} xl={5} lg={5} md={6} xs={0} sm={0}>
            <Menu
              mode="inline"
              style={style.menuPc}
              onClick={this.menuClick}
              selectedKeys={[tabKey]}
            >
              { menuItems }
            </Menu>
          </Col>
          <Col xxl={0} xl={0} lg={0} md={0} xs={24} sm={24}>
            <Menu
              mode="horizontal"
              style={style.menuMb}
              onClick={this.menuClick}
              selectedKeys={[tabKey]}
            >
              { menuItems }
            </Menu>
          </Col>
          <TopicList 
            topics={topics} 
            loading={loading} 
            currentPage={currentPage}
            pageSize={pageSize}
            pageLen={this.state.pageLen}
            pageChange={this.pageChange}
          />
        </Row>
      </div>
    )
  }

}

export default TopicIndex