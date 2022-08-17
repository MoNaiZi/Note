import mitt from 'mitt';
type Events = any
const emitter = mitt<Events>();
export default emitter