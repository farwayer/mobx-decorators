import {createDecorator} from './save'
import AsyncStorage from "@react-native-community/async-storage"


export function createSaveDecorator(baseOptions) {
  return createDecorator(AsyncStorage, baseOptions);
}

export default createSaveDecorator()
