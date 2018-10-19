import { connect } from '@tarojs/redux'
import action from '../utils/action'

const pageWithData = (modelName) => {
  const effectName = name => `${modelName}/${name}`
  return function withDataComponent(Component) {
    @connect(({ loading }) => ({
      loading: loading.effects[effectName('init')],
      isLoadMore: loading.effects[effectName('loadMore')],
    }))
    class WithData extends Component {
      componentDidMount() {
        if (!this.$preloadData) {
          this.fetchData(this.$router.params)
        }
        super.componentDidMount && super.componentDidMount()
      }
      componentWillPreload(params) {
        super.componentWillPreload && super.componentWillPreload(params)
        return this.fetchData(params)
      }
      fetchData(params) {
        return this.props.dispatch(this.mappingAction('init', params))
      }
      mappingAction(name, payload) {
        return action(effectName(name), payload)
      }
    }
    return WithData
  }
}

export default pageWithData
