/*! (c) Andrea Giammarchi */
let t=null;const e=e=>{let s=t;s||(t=new Set);try{e()}finally{if(!s){[t,s]=[null,t];for(const t of s)t._()}}},s=t=>{const e=[...t];return t.clear(),e};class r extends Set{constructor(t){super()._=t}dispose(){for(const t of s(this))t.delete(this),t.dispose?.()}}let n=null;const o=t=>{const e=new r((()=>{const s=n;n=e;try{t()}finally{n=s}}));return e},u=(t,e)=>{const s=o((()=>{e=t(e)}));return n&&n.add(s),s._(),()=>s.dispose()};class l extends Set{constructor(t){super()._=t}get value(){return n&&n.add(this.add(n)),this._}set value(e){if(this._!==e){this._=e;const r=!t;for(const e of s(this))r?e._():t.add(e)}}peek(){return this._}then(t){t(this.value)}toJSON(){return this.value}valueOf(){return this.value}toString(){return String(this.value)}}const i=t=>new l(t);class c extends l{constructor(t,e){super(e).f=t,this.e=null}get value(){return this.e||(this.e=o((()=>{super.value=this.f(this._)})))._(),super.value}set value(t){throw new Error("computed is read-only")}}const a=(t,e)=>new c(t,e);export{c as Computed,l as Signal,e as batch,a as computed,u as effect,i as signal};
