import * as d3 from '../d3'
import { Mdata, TwoNumber } from '../interface'
import emitter from '@/mitt'
import { EmitsOptions, Ref, ref, SetupContext } from 'vue'
import { onDragEnd, onDragMove, onZoomMove } from '../listener'
import * as selection from './selection'
import * as element from './element'
import { getDragContainer, moveView } from '../assistant'

export * as ctm from './contextmenu'
export { selection, element }

// 连线样式
type CurveStepLink = ({ source, target }: { source: TwoNumber, target: TwoNumber }) => string | null
type Link = d3.Link<unknown, d3.DefaultLinkObject, [number, number]> | CurveStepLink

const linkHorizontal = d3.linkHorizontal().source((d) => d.source).target((d) => d.target)
const curveStepLine = d3.line().curve(d3.curveStep)

export const curveStepLink: CurveStepLink = ({ source, target }) => curveStepLine([source, target])
export let sharpCorner = false
export let link: Link = linkHorizontal
export const changeSharpCorner = ref(false) // 指示是否需要使用attrTween('d', pathTween)
emitter.on('sharp-corner', (value: boolean) => {
    if (sharpCorner !== value) { changeSharpCorner.value = true }
    sharpCorner = !!value
    link = value ? curveStepLink : linkHorizontal
})

// 连线宽度
export let branch = 4
emitter.on('branch', (value: number) => branch = value || branch)

// 缩放程度
export let scaleExtent: TwoNumber = [0.1, 8]
emitter.on('scale-extent', (value: TwoNumber) => scaleExtent = value || scaleExtent)

// 可编辑指示
export let editFlag = true
emitter.on('edit-flag', (val: any) => {
    editFlag = !!val
    console.log('editFlag', editFlag)
})

// 节点边距与间隔
export const rootTextRectRadius = 6
export const rootTextRectPadding = 10
export let yGap = 18
export let xGap = 84
export let textRectPadding = Math.min(yGap / 2 - 1, rootTextRectPadding)
emitter.on('gap', (gap: { xGap: number; yGap: number }) => {
    if (!gap) { return }
    xGap = gap.xGap
    yGap = gap.yGap
    textRectPadding = Math.min(yGap / 2 - 1, rootTextRectPadding)
    textRectPadding = Math.min(xGap / 2 - 1, textRectPadding)
})

/**
 * 观察foreignDiv，改变foreignObject的宽度和高度，并使其保持可见
 */
export const observer = new ResizeObserver((arr: ResizeObserverEntry[]) => {
    const { foreign } = selection
    if (!foreign) { return }
    const temp = arr[0]
    const foreignDiv = temp.target
    const { width, height } = temp.contentRect
    const pl = parseInt(getComputedStyle(foreignDiv).paddingLeft || '0', 10)
    const b = parseInt(getComputedStyle(foreignDiv.parentNode as Element).borderTopWidth || '0', 10)
    const gap = (pl + b) * 2
    foreign.attr('width', width + gap).attr('height', height + gap)
    if (foreign.style('display') !== 'none') {
        moveView(foreignDiv)
    }
})

// 其他
export const addBtnRect = { side: 12, padding: 2, margin: 8 }
export const addBtnSide = addBtnRect.side + addBtnRect.padding * 2
export const expandBtnRect = { width: 16, height: 4, radius: 2 }
export const zoomTransform: Ref<d3.ZoomTransform> = ref(d3.zoomIdentity)
export const zoom = d3.zoom<SVGSVGElement, null>().on('zoom', onZoomMove).scaleExtent(scaleExtent)
export const drag = d3.drag<SVGGElement, Mdata>().container(getDragContainer).on('drag', onDragMove).on('end', onDragEnd)
export const addNodeBtn = ref(false)
export let mmcontext: SetupContext
emitter.on('mindmap-context', (val: SetupContext<EmitsOptions>) => val ? mmcontext = val : null)
export const mmprops = ref({
    drag: false,
    edit: false
})