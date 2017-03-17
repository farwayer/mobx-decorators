import {createSaveDecorator} from './save'
import {AsyncStorage} from 'react-native'


export default createSaveDecorator({
  storage: AsyncStorage
})

export {createSaveDecorator}
