import emitter from '@/mitt'

// import * as d3 from '../d3'

export let svg: any
export let g: any
export let asstSvg: any
export let foreign: any

emitter.on('selection-svg', (val) => svg = val)
emitter.on('selection-g', (val) => {

    g = val
})
emitter.on('selection-asstSvg', (val) => asstSvg = val)
emitter.on('selection-foreign', (val) => foreign = val)
