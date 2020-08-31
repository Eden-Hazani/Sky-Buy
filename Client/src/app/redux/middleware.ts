import {Store} from 'redux'
import {AppState} from './app-state'
import {Action} from './action'



export const saveToSessionStorage = store => next =>action=>{
             // here we are before the reducer
             next(action);
             localStorage.setItem("userInfo",JSON.stringify(store.getState().user))
}