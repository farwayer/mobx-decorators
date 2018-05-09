import {createDecorator} from './save'
import {AsyncStorage} from 'react-native'


export function createSaveDecorator(baseOptions) {
  return createDecorator(AsyncStorage, baseOptions);
}

export default createSaveDecorator()
