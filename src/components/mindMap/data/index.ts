import emitter from '@/mitt'
import { draw } from '../draw'
import { Data, IsMdata } from '../interface'
import { snapshot, updateTimeTravelState } from '../state'
import { mmcontext } from '../variable'
import ImData from './ImData'
// import * as selection from '../variable/selection'
export { ImData }

// 思维导图数据
export let mmdata: any
emitter.on('mmdata', (val) => {
    val ? mmdata = val : null
    // console.log('设置数据', mmdata)
})

export const afterOperation = (snap = true): void => {

    if (snap) { snapshot.snap(mmdata.data) }
    mmcontext.emit('update:modelValue', JSON.parse(JSON.stringify([mmdata.data.rawData])))
    updateTimeTravelState()

    draw(mmdata)
}
export const rename = (id: string, name: string): void => {
    mmdata.rename(id, name)
    afterOperation()
}
export const moveChild = (pid: string, id: string): void => {
    mmdata.moveChild(pid, id)
    afterOperation()
}
export const moveSibling = (id: string, referenceId: string, after = 0): void => {
    mmdata.moveSibling(id, referenceId, after)
    afterOperation()
}
export const add = (id: string, name: string | Data): IsMdata => {
    const d = mmdata.add(id, name)
    afterOperation()
    return d
}
export const del = (id: string): void => {
    mmdata.delete(id)
    afterOperation()
}
export const delOne = (id: string): void => {
    mmdata.deleteOne(id)
    afterOperation()
}
export const expand = (id: string): void => {
    mmdata.expand(id)
    afterOperation()
}
export const collapse = (id: string): void => {
    mmdata.collapse(id)
    afterOperation()
}
export const addSibling = (id: string, name: string, before = false): IsMdata => {
    const d = mmdata.addSibling(id, name, before)
    afterOperation()
    return d
}
export const addParent = (id: string, name: string): IsMdata => {
    const d = mmdata.addParent(id, name)
    afterOperation()
    return d
}
export const changeLeft = (id: string, left: boolean): void => {
    mmdata.changeLeft(id, left)
    afterOperation()
}