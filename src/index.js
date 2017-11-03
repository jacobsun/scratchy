import '../node_modules/normalize.css/normalize.css'
import './styles/main.styl'
import {on} from './module/helpers'
import controller from './controller'

on(window, 'load', controller.render)
