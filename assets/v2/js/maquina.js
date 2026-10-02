/* D-Code · la máquina de la portada. Fuente: scripts/v4/maquina/ · incluye three.js (MIT, © three.js authors) */
var ih=0,Tl=1,sh=2;var ki=1,rh=2,Ms=3,Ci=0,en=1,Ln=2,An=0,Ss=1,Mr=2,Al=3,wl=4,ah=5;var Hi=100,oh=101,lh=102,ch=103,hh=104,uh=200,dh=201,fh=202,ph=203,El=204,Cl=205,mh=206,gh=207,xh=208,_h=209,vh=210,yh=211,Mh=212,Sh=213,bh=214,aa=0,oa=1,la=2,hs=3,ca=4,ha=5,ua=6,da=7,Rl=0,Th=1,Ah=2,wn=0,Il=1,Pl=2,Ll=3,Dl=4,Ul=5,Nl=6,Fl=7;var Ol=300,Ri=301,Wi=302,Wa=303,Xa=304,Sr=306,Vi=1e3,Yn=1001,fa=1002,We=1003,wh=1004;var br=1005;var Ve=1006,qa=1007;var jn=1008;var cn=1009,Bl=1010,zl=1011,bs=1012,Ya=1013,En=1014,Dn=1015,Cn=1016,Za=1017,Ja=1018,Ts=1020,Vl=35902,Gl=35899,kl=1021,Hl=1022,mn=1023,Zn=1026,Ii=1027,$a=1028,Ka=1029,Pi=1030,ja=1031;var Qa=1033,Tr=33776,Ar=33777,wr=33778,Er=33779,to=35840,eo=35841,no=35842,io=35843,so=36196,ro=37492,ao=37496,oo=37488,lo=37489,Cr=37490,co=37491,ho=37808,uo=37809,fo=37810,po=37811,mo=37812,go=37813,xo=37814,_o=37815,vo=37816,yo=37817,Mo=37818,So=37819,bo=37820,To=37821,Ao=36492,wo=36494,Eo=36495,Co=36283,Ro=36284,Rr=36285,Io=36286;var qs=2300,pa=2301,sa=2302,pl=2303,ml=2400,gl=2401,xl=2402;var Eh=3200;var Po=0,Ch=1,Un="",an="srgb",Ys="srgb-linear",Zs="linear",Ie="srgb";var ra=7680;var Rh=519,Ih=512,Ph=513,Lh=514,Lo=515,Dh=516,Uh=517,Do=518,Nh=519,Fh=35044,Wl=35048;var Xl="300 es",Vn=2e3,us=2001;function td(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ed(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Js(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Oh(){let i=Js("canvas");return i.style.display="block",i}var Cc={},ds=null;function ql(...i){let t="THREE."+i.shift();ds?ds("log",t,...i):console.log(t,...i)}function Bh(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ee(...i){i=Bh(i);let t="THREE."+i.shift();if(ds)ds("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function ie(...i){i=Bh(i);let t="THREE."+i.shift();if(ds)ds("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function zi(...i){let t=i.join(" ");t in Cc||(Cc[t]=!0,ee(...i))}function zh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Vh={[aa]:oa,[la]:ua,[ca]:da,[hs]:ha,[oa]:aa,[ua]:la,[da]:ca,[ha]:hs},Jn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var ko=Math.PI/180,ma=180/Math.PI;function As(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]+"-"+sn[t&255]+sn[t>>8&255]+"-"+sn[t>>16&15|64]+sn[t>>24&255]+"-"+sn[e&63|128]+sn[e>>8&255]+"-"+sn[e>>16&255]+sn[e>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function _e(i,t,e){return Math.max(t,Math.min(e,i))}function nd(i,t){return(i%t+t)%t}function Ho(i,t,e){return(1-e)*i+e*t}function Fs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var jl=class jl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};jl.prototype.isVector2=!0;var yt=jl,Pn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],x=r[a+2],S=r[a+3];if(d!==S||l!==u||c!==f||h!==x){let g=l*u+c*f+h*x+d*S;g<0&&(u=-u,f=-f,x=-x,S=-S,g=-g);let m=1-o;if(g<.9995){let A=Math.acos(g),E=Math.sin(A);m=Math.sin(m*A)/E,o=Math.sin(o*A)/E,l=l*m+u*o,c=c*m+f*o,h=h*m+x*o,d=d*m+S*o}else{l=l*m+u*o,c=c*m+f*o,h=h*m+x*o,d=d*m+S*o;let A=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=A,c*=A,h*=A,d*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],x=r[a+3];return t[e]=o*x+h*d+l*f-c*u,t[e+1]=l*x+h*u+c*d-o*f,t[e+2]=c*x+h*f+o*u-l*d,t[e+3]=h*x-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*x,this._y=c*f*d-u*h*x,this._z=c*h*x+u*f*d,this._w=c*h*d-u*f*x;break;case"YXZ":this._x=u*h*d+c*f*x,this._y=c*f*d-u*h*x,this._z=c*h*x-u*f*d,this._w=c*h*d+u*f*x;break;case"ZXY":this._x=u*h*d-c*f*x,this._y=c*f*d+u*h*x,this._z=c*h*x+u*f*d,this._w=c*h*d-u*f*x;break;case"ZYX":this._x=u*h*d-c*f*x,this._y=c*f*d+u*h*x,this._z=c*h*x-u*f*d,this._w=c*h*d+u*f*x;break;case"YZX":this._x=u*h*d+c*f*x,this._y=c*f*d+u*h*x,this._z=c*h*x-u*f*d,this._w=c*h*d-u*f*x;break;case"XZY":this._x=u*h*d-c*f*x,this._y=c*f*d-u*h*x,this._z=c*h*x+u*f*d,this._w=c*h*d+u*f*x;break;default:ee("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ql=class Ql{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this.z=_e(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this.z=_e(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Wo.copy(this).projectOnVector(t),this.sub(Wo)}reflect(t){return this.sub(Wo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ql.prototype.isVector3=!0;var z=Ql,Wo=new z,Rc=new Pn,tc=class tc{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],x=n[8],S=s[0],g=s[3],m=s[6],A=s[1],E=s[4],v=s[7],b=s[2],M=s[5],C=s[8];return r[0]=a*S+o*A+l*b,r[3]=a*g+o*E+l*M,r[6]=a*m+o*v+l*C,r[1]=c*S+h*A+d*b,r[4]=c*g+h*E+d*M,r[7]=c*m+h*v+d*C,r[2]=u*S+f*A+x*b,r[5]=u*g+f*E+x*M,r[8]=u*m+f*v+x*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,x=e*d+n*u+s*f;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/x;return t[0]=d*S,t[1]=(s*c-h*n)*S,t[2]=(o*n-s*a)*S,t[3]=u*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-o*e)*S,t[6]=f*S,t[7]=(n*l-c*e)*S,t[8]=(a*e-n*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xo.makeScale(t,e)),this}rotate(t){return zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xo.makeRotation(-t)),this}translate(t,e){return zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};tc.prototype.isMatrix3=!0;var le=tc,Xo=new le,Ic=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pc=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function id(){let i={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ie&&(s.r=oi(s.r),s.g=oi(s.g),s.b=oi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ie&&(s.r=cs(s.r),s.g=cs(s.g),s.b=cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Un?Zs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ys]:{primaries:t,whitePoint:n,transfer:Zs,toXYZ:Ic,fromXYZ:Pc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:t,whitePoint:n,transfer:Ie,toXYZ:Ic,fromXYZ:Pc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:an}}}),i}var Se=id();function oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ji,ga=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ji===void 0&&(Ji=Js("canvas")),Ji.width=t.width,Ji.height=t.height;let s=Ji.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ji}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Js("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=oi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(oi(e[n]/255)*255):e[n]=oi(e[n]);return{data:e,width:t.width,height:t.height}}else return ee("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},sd=0,fs=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=As(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(qo(s[a].image)):r.push(qo(s[a]))}else r=qo(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function qo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ga.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ee("Texture: Unable to serialize Texture."),{})}var rd=0,Yo=new z,dn=class i extends Jn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Yn,s=Yn,r=Ve,a=jn,o=mn,l=cn,c=i.DEFAULT_ANISOTROPY,h=Un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=As(),this.name="",this.source=new fs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new yt(0,0),this.repeat=new yt(1,1),this.center=new yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){ee(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ee(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ol)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Vi:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case fa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Vi:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case fa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=Ol;dn.DEFAULT_ANISOTROPY=1;var ec=class ec{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],x=l[9],S=l[2],g=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-S)<.01&&Math.abs(x-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+S)<.1&&Math.abs(x+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let E=(c+1)/2,v=(f+1)/2,b=(m+1)/2,M=(h+u)/4,C=(d+S)/4,_=(x+g)/4;return E>v&&E>b?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=M/n,r=C/n):v>b?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=M/s,r=_/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=C/r,s=_/r),this.set(n,s,r,e),this}let A=Math.sqrt((g-x)*(g-x)+(d-S)*(d-S)+(u-h)*(u-h));return Math.abs(A)<.001&&(A=1),this.x=(g-x)/A,this.y=(d-S)/A,this.z=(u-h)/A,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this.z=_e(this.z,t.z,e.z),this.w=_e(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this.z=_e(this.z,t,e),this.w=_e(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ec.prototype.isVector4=!0;var Fe=ec,xa=class extends Jn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ve,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Fe(0,0,t,e),this.scissorTest=!1,this.viewport=new Fe(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new dn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ve,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new fs(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qe=class extends xa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},$s=class extends dn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var _a=class extends dn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Ha=class Ha{constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,x,S,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,x,S,g)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,x,S,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=x,m[11]=S,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ha().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/$i.setFromMatrixColumn(t,0).length(),r=1/$i.setFromMatrixColumn(t,1).length(),a=1/$i.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=a*h,f=a*d,x=o*h,S=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+x*c,e[5]=u-S*c,e[9]=-o*l,e[2]=S-u*c,e[6]=x+f*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,x=c*h,S=c*d;e[0]=u+S*o,e[4]=x*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-x,e[6]=S+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,x=c*h,S=c*d;e[0]=u-S*o,e[4]=-a*d,e[8]=x+f*o,e[1]=f+x*o,e[5]=a*h,e[9]=S-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,f=a*d,x=o*h,S=o*d;e[0]=l*h,e[4]=x*c-f,e[8]=u*c+S,e[1]=l*d,e[5]=S*c+u,e[9]=f*c-x,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,f=a*c,x=o*l,S=o*c;e[0]=l*h,e[4]=S-u*d,e[8]=x*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+x,e[10]=u-S*d}else if(t.order==="XZY"){let u=a*l,f=a*c,x=o*l,S=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+S,e[5]=a*h,e[9]=f*d-x,e[2]=x*d-f,e[6]=o*h,e[10]=S*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ad,t,od)}lookAt(t,e,n){let s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),fi.crossVectors(n,Mn),fi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),fi.crossVectors(n,Mn)),fi.normalize(),Fr.crossVectors(Mn,fi),s[0]=fi.x,s[4]=Fr.x,s[8]=Mn.x,s[1]=fi.y,s[5]=Fr.y,s[9]=Mn.y,s[2]=fi.z,s[6]=Fr.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],x=n[2],S=n[6],g=n[10],m=n[14],A=n[3],E=n[7],v=n[11],b=n[15],M=s[0],C=s[4],_=s[8],T=s[12],R=s[1],I=s[5],O=s[9],G=s[13],L=s[2],V=s[6],q=s[10],Y=s[14],rt=s[3],Z=s[7],tt=s[11],Q=s[15];return r[0]=a*M+o*R+l*L+c*rt,r[4]=a*C+o*I+l*V+c*Z,r[8]=a*_+o*O+l*q+c*tt,r[12]=a*T+o*G+l*Y+c*Q,r[1]=h*M+d*R+u*L+f*rt,r[5]=h*C+d*I+u*V+f*Z,r[9]=h*_+d*O+u*q+f*tt,r[13]=h*T+d*G+u*Y+f*Q,r[2]=x*M+S*R+g*L+m*rt,r[6]=x*C+S*I+g*V+m*Z,r[10]=x*_+S*O+g*q+m*tt,r[14]=x*T+S*G+g*Y+m*Q,r[3]=A*M+E*R+v*L+b*rt,r[7]=A*C+E*I+v*V+b*Z,r[11]=A*_+E*O+v*q+b*tt,r[15]=A*T+E*G+v*Y+b*Q,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],x=t[3],S=t[7],g=t[11],m=t[15],A=l*f-c*u,E=o*f-c*d,v=o*u-l*d,b=a*f-c*h,M=a*u-l*h,C=a*d-o*h;return e*(S*A-g*E+m*v)-n*(x*A-g*b+m*M)+s*(x*E-S*b+m*C)-r*(x*v-S*M+g*C)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],x=t[12],S=t[13],g=t[14],m=t[15],A=e*o-n*a,E=e*l-s*a,v=e*c-r*a,b=n*l-s*o,M=n*c-r*o,C=s*c-r*l,_=h*S-d*x,T=h*g-u*x,R=h*m-f*x,I=d*g-u*S,O=d*m-f*S,G=u*m-f*g,L=A*G-E*O+v*I+b*R-M*T+C*_;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/L;return t[0]=(o*G-l*O+c*I)*V,t[1]=(s*O-n*G-r*I)*V,t[2]=(S*C-g*M+m*b)*V,t[3]=(u*M-d*C-f*b)*V,t[4]=(l*R-a*G-c*T)*V,t[5]=(e*G-s*R+r*T)*V,t[6]=(g*v-x*C-m*E)*V,t[7]=(h*C-u*v+f*E)*V,t[8]=(a*O-o*R+c*_)*V,t[9]=(n*R-e*O-r*_)*V,t[10]=(x*M-S*v+m*A)*V,t[11]=(d*v-h*M-f*A)*V,t[12]=(o*T-a*I-l*_)*V,t[13]=(e*I-n*T+s*_)*V,t[14]=(S*E-x*b-g*A)*V,t[15]=(h*b-d*E+u*A)*V,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,x=r*d,S=a*h,g=a*d,m=o*d,A=l*c,E=l*h,v=l*d,b=n.x,M=n.y,C=n.z;return s[0]=(1-(S+m))*b,s[1]=(f+v)*b,s[2]=(x-E)*b,s[3]=0,s[4]=(f-v)*M,s[5]=(1-(u+m))*M,s[6]=(g+A)*M,s[7]=0,s[8]=(x+E)*C,s[9]=(g-A)*C,s[10]=(1-(u+S))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=$i.set(s[0],s[1],s[2]).length(),o=$i.set(s[4],s[5],s[6]).length(),l=$i.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Fn.copy(this);let c=1/a,h=1/o,d=1/l;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=d,Fn.elements[9]*=d,Fn.elements[10]*=d,e.setFromRotationMatrix(Fn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=Vn,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s),x,S;if(l)x=r/(a-r),S=a*r/(a-r);else if(o===Vn)x=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===us)x=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Vn,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s),x,S;if(l)x=1/(a-r),S=a/(a-r);else if(o===Vn)x=-2/(a-r),S=-(a+r)/(a-r);else if(o===us)x=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Ha.prototype.isMatrix4=!0;var Le=Ha,$i=new z,Fn=new Le,ad=new z(0,0,0),od=new z(1,1,1),fi=new z,Fr=new z,Mn=new z,Lc=new Le,Dc=new Pn,Gn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(_e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-_e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(_e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:ee("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Lc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Lc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dc.setFromEuler(this),this.setFromQuaternion(Dc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gn.DEFAULT_ORDER="XYZ";var Ks=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},ld=0,Uc=new z,Ki=new Pn,ni=new Le,Or=new z,Os=new z,cd=new z,hd=new Pn,Nc=new z(1,0,0),Fc=new z(0,1,0),Oc=new z(0,0,1),Bc={type:"added"},ud={type:"removed"},ji={type:"childadded",child:null},Zo={type:"childremoved",child:null},fn=class i extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=As(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new z,e=new Gn,n=new Pn,s=new z(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Le},normalMatrix:{value:new le}}),this.matrix=new Le,this.matrixWorld=new Le,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ks,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.premultiply(Ki),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(Fc,t)}rotateZ(t){return this.rotateOnAxis(Oc,t)}translateOnAxis(t,e){return Uc.copy(t).applyQuaternion(this.quaternion),this.position.add(Uc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(Fc,t)}translateZ(t){return this.translateOnAxis(Oc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ni.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Or.copy(t):Or.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ni.lookAt(Os,Or,this.up):ni.lookAt(Or,Os,this.up),this.quaternion.setFromRotationMatrix(ni),s&&(ni.extractRotation(s.matrixWorld),Ki.setFromRotationMatrix(ni),this.quaternion.premultiply(Ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(ie("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bc),ji.child=t,this.dispatchEvent(ji),ji.child=null):ie("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ud),Zo.child=t,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ni.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ni.multiply(t.parent.matrixWorld)),t.applyMatrix4(ni),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bc),ji.child=t,this.dispatchEvent(ji),ji.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,t,cd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,hd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),x=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};fn.DEFAULT_UP=new z(0,1,0);fn.DEFAULT_MATRIX_AUTO_UPDATE=!0;fn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Oi=class extends fn{constructor(){super(),this.isGroup=!0,this.type="Group"}},dd={type:"move"},ps=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let S of t.hand.values()){let g=e.getJointPose(S,n),m=this._getHandJoint(c,S);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,x=.005;c.inputState.pinching&&u>f+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Oi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Gh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pi={h:0,s:0,l:0},Br={h:0,s:0,l:0};function Jo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var re=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=an){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Se.workingColorSpace){return this.r=t,this.g=e,this.b=n,Se.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Se.workingColorSpace){if(t=nd(t,1),e=_e(e,0,1),n=_e(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Jo(a,r,t+1/3),this.g=Jo(a,r,t),this.b=Jo(a,r,t-1/3)}return Se.colorSpaceToWorking(this,s),this}setStyle(t,e=an){function n(r){r!==void 0&&parseFloat(r)<1&&ee("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:ee("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);ee("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=an){let n=Gh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ee("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=oi(t.r),this.g=oi(t.g),this.b=oi(t.b),this}copyLinearToSRGB(t){return this.r=cs(t.r),this.g=cs(t.g),this.b=cs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=an){return Se.workingToColorSpace(rn.copy(this),t),Math.round(_e(rn.r*255,0,255))*65536+Math.round(_e(rn.g*255,0,255))*256+Math.round(_e(rn.b*255,0,255))}getHexString(t=an){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Se.workingColorSpace){Se.workingToColorSpace(rn.copy(this),e);let n=rn.r,s=rn.g,r=rn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Se.workingColorSpace){return Se.workingToColorSpace(rn.copy(this),e),t.r=rn.r,t.g=rn.g,t.b=rn.b,t}getStyle(t=an){Se.workingToColorSpace(rn.copy(this),t);let e=rn.r,n=rn.g,s=rn.b;return t!==an?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(pi),this.setHSL(pi.h+t,pi.s+e,pi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(pi),t.getHSL(Br);let n=Ho(pi.h,Br.h,e),s=Ho(pi.s,Br.s,e),r=Ho(pi.l,Br.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},rn=new re;re.NAMES=Gh;var js=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new re(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var vi=class extends fn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gn,this.environmentIntensity=1,this.environmentRotation=new Gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},On=new z,ii=new z,$o=new z,si=new z,Qi=new z,ts=new z,zc=new z,Ko=new z,jo=new z,Qo=new z,tl=new Fe,el=new Fe,nl=new Fe,_i=class i{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),On.subVectors(t,e),s.cross(On);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){On.subVectors(s,e),ii.subVectors(n,e),$o.subVectors(t,e);let a=On.dot(On),o=On.dot(ii),l=On.dot($o),c=ii.dot(ii),h=ii.dot($o),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,x=(a*h-o*l)*u;return r.set(1-f-x,x,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,si)===null?!1:si.x>=0&&si.y>=0&&si.x+si.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,si.x),l.addScaledVector(a,si.y),l.addScaledVector(o,si.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return tl.setScalar(0),el.setScalar(0),nl.setScalar(0),tl.fromBufferAttribute(t,e),el.fromBufferAttribute(t,n),nl.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(tl,r.x),a.addScaledVector(el,r.y),a.addScaledVector(nl,r.z),a}static isFrontFacing(t,e,n,s){return On.subVectors(n,e),ii.subVectors(t,e),On.cross(ii).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),ii.subVectors(this.a,this.b),On.cross(ii).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;Qi.subVectors(s,n),ts.subVectors(r,n),Ko.subVectors(t,n);let l=Qi.dot(Ko),c=ts.dot(Ko);if(l<=0&&c<=0)return e.copy(n);jo.subVectors(t,s);let h=Qi.dot(jo),d=ts.dot(jo);if(h>=0&&d<=h)return e.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Qi,a);Qo.subVectors(t,r);let f=Qi.dot(Qo),x=ts.dot(Qo);if(x>=0&&f<=x)return e.copy(r);let S=f*c-l*x;if(S<=0&&c>=0&&x<=0)return o=c/(c-x),e.copy(n).addScaledVector(ts,o);let g=h*x-f*d;if(g<=0&&d-h>=0&&f-x>=0)return zc.subVectors(r,s),o=(d-h)/(d-h+(f-x)),e.copy(s).addScaledVector(zc,o);let m=1/(g+S+u);return a=S*m,o=u*m,e.copy(n).addScaledVector(Qi,a).addScaledVector(ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},$n=class{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Bn):Bn.fromBufferAttribute(r,a),Bn.applyMatrix4(t.matrixWorld),this.expandByPoint(Bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zr.copy(n.boundingBox)),zr.applyMatrix4(t.matrixWorld),this.union(zr)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Bn),Bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bs),Vr.subVectors(this.max,Bs),es.subVectors(t.a,Bs),ns.subVectors(t.b,Bs),is.subVectors(t.c,Bs),mi.subVectors(ns,es),gi.subVectors(is,ns),Di.subVectors(es,is);let e=[0,-mi.z,mi.y,0,-gi.z,gi.y,0,-Di.z,Di.y,mi.z,0,-mi.x,gi.z,0,-gi.x,Di.z,0,-Di.x,-mi.y,mi.x,0,-gi.y,gi.x,0,-Di.y,Di.x,0];return!il(e,es,ns,is,Vr)||(e=[1,0,0,0,1,0,0,0,1],!il(e,es,ns,is,Vr))?!1:(Gr.crossVectors(mi,gi),e=[Gr.x,Gr.y,Gr.z],il(e,es,ns,is,Vr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ri),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ri=[new z,new z,new z,new z,new z,new z,new z,new z],Bn=new z,zr=new $n,es=new z,ns=new z,is=new z,mi=new z,gi=new z,Di=new z,Bs=new z,Vr=new z,Gr=new z,Ui=new z;function il(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ui.fromArray(i,r);let o=s.x*Math.abs(Ui.x)+s.y*Math.abs(Ui.y)+s.z*Math.abs(Ui.z),l=t.dot(Ui),c=e.dot(Ui),h=n.dot(Ui);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var He=new z,kr=new yt,fd=0,ln=class extends Jn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fh,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)kr.fromBufferAttribute(this,e),kr.applyMatrix3(t),this.setXY(e,kr.x,kr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Fs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fs(e,this.array)),e}setX(t,e){return this.normalized&&(e=xn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fs(e,this.array)),e}setY(t,e){return this.normalized&&(e=xn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fs(e,this.array)),e}setW(t,e){return this.normalized&&(e=xn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xn(e,this.array),n=xn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=xn(e,this.array),n=xn(n,this.array),s=xn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=xn(e,this.array),n=xn(n,this.array),s=xn(s,this.array),r=xn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Qs=class extends ln{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var tr=class extends ln{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Re=class extends ln{constructor(t,e,n){super(new Float32Array(t),e,n)}},pd=new $n,zs=new z,sl=new z,yi=class{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):pd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zs.subVectors(t,this.center);let e=zs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(zs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(sl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zs.copy(t.center).add(sl)),this.expandByPoint(zs.copy(t.center).sub(sl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},md=0,In=new Le,rl=new fn,ss=new z,Sn=new $n,Vs=new $n,Ke=new z,qe=class i extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=As(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(td(t)?tr:Qs)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new le().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return In.makeRotationFromQuaternion(t),this.applyMatrix4(In),this}rotateX(t){return In.makeRotationX(t),this.applyMatrix4(In),this}rotateY(t){return In.makeRotationY(t),this.applyMatrix4(In),this}rotateZ(t){return In.makeRotationZ(t),this.applyMatrix4(In),this}translate(t,e,n){return In.makeTranslation(t,e,n),this.applyMatrix4(In),this}scale(t,e,n){return In.makeScale(t,e,n),this.applyMatrix4(In),this}lookAt(t){return rl.lookAt(t),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Re(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&ee("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $n);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ie("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ke.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(Ke),Ke.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(Ke)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ie('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ie("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){let n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Vs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ke.addVectors(Sn.min,Vs.min),Sn.expandByPoint(Ke),Ke.addVectors(Sn.max,Vs.max),Sn.expandByPoint(Ke)):(Sn.expandByPoint(Vs.min),Sn.expandByPoint(Vs.max))}Sn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ke.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ke));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ke.fromBufferAttribute(o,c),l&&(ss.fromBufferAttribute(t,c),Ke.add(ss)),s=Math.max(s,n.distanceToSquared(Ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ie('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){ie("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ln(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new z,l[_]=new z;let c=new z,h=new z,d=new z,u=new yt,f=new yt,x=new yt,S=new z,g=new z;function m(_,T,R){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,R),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),x.fromBufferAttribute(r,R),h.sub(c),d.sub(c),f.sub(u),x.sub(u);let I=1/(f.x*x.y-x.x*f.y);isFinite(I)&&(S.copy(h).multiplyScalar(x.y).addScaledVector(d,-f.y).multiplyScalar(I),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-x.x).multiplyScalar(I),o[_].add(S),o[T].add(S),o[R].add(S),l[_].add(g),l[T].add(g),l[R].add(g))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let _=0,T=A.length;_<T;++_){let R=A[_],I=R.start,O=R.count;for(let G=I,L=I+O;G<L;G+=3)m(t.getX(G+0),t.getX(G+1),t.getX(G+2))}let E=new z,v=new z,b=new z,M=new z;function C(_){b.fromBufferAttribute(s,_),M.copy(b);let T=o[_];E.copy(T),E.sub(b.multiplyScalar(b.dot(T))).normalize(),v.crossVectors(M,T);let I=v.dot(l[_])<0?-1:1;a.setXYZW(_,E.x,E.y,E.z,I)}for(let _=0,T=A.length;_<T;++_){let R=A[_],I=R.start,O=R.count;for(let G=I,L=I+O;G<L;G+=3)C(t.getX(G+0)),C(t.getX(G+1)),C(t.getX(G+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new ln(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new z,r=new z,a=new z,o=new z,l=new z,c=new z,h=new z,d=new z;if(t)for(let u=0,f=t.count;u<f;u+=3){let x=t.getX(u+0),S=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ke.fromBufferAttribute(t,e),Ke.normalize(),t.setXYZ(e,Ke.x,Ke.y,Ke.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,x=0;for(let S=0,g=l.length;S<g;S++){o.isInterleavedBufferAttribute?f=l[S]*o.data.stride+o.offset:f=l[S]*h;for(let m=0;m<h;m++)u[x++]=c[f++]}return new ln(u,h,d)}if(this.index===null)return ee("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var al=new z,gd=new z,xd=new le,zn=class{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=al.subVectors(n,e).cross(gd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(al),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||xd.getNormalMatrix(t),s=this.coplanarPoint(al).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},_d=0,Mi=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=As(),this.name="",this.type="Material",this.blending=Ss,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=El,this.blendDst=Cl,this.blendEquation=Hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new re(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ra,this.stencilZFail=ra,this.stencilZPass=ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){ee(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ee(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new re().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new zn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new yt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new yt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var ai=new z,ol=new z,Hr=new z,Wr=new z,va=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ai.copy(this.origin).addScaledVector(this.direction,e),ai.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ol.copy(t).add(e).multiplyScalar(.5),Hr.copy(e).sub(t).normalize(),Wr.copy(this.origin).sub(ol);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Hr),o=Wr.dot(this.direction),l=-Wr.dot(Hr),c=Wr.lengthSq(),h=Math.abs(1-a*a),d,u,f,x;if(h>0)if(d=a*l-o,u=a*o-l,x=r*h,d>=0)if(u>=-x)if(u<=x){let S=1/h;d*=S,u*=S,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-x?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=x?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ol).addScaledVector(Hr,u),f}intersectSphere(t,e){if(t.radius<0)return null;ai.subVectors(t.center,this.origin);let n=ai.dot(this.direction),s=ai.dot(ai)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,ai)!==null}intersectTriangle(t,e,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,x=e.x-a.x,S=e.y-a.y,g=e.z-a.z,m=n.x-a.x,A=n.y-a.y,E=n.z-a.z,v=Math.abs(l),b=Math.abs(c),M=Math.abs(h),C,_,T,R,I,O,G,L,V,q,Y,rt;if(v>=b&&v>=M?(T=l,O=d,V=x,rt=m,l>=0?(C=c,_=h,R=u,I=f,G=S,L=g,q=A,Y=E):(C=h,_=c,R=f,I=u,G=g,L=S,q=E,Y=A)):b>=M?(T=c,O=u,V=S,rt=A,c>=0?(C=h,_=l,R=f,I=d,G=g,L=x,q=E,Y=m):(C=l,_=h,R=d,I=f,G=x,L=g,q=m,Y=E)):(T=h,O=f,V=g,rt=E,h>=0?(C=l,_=c,R=d,I=u,G=x,L=S,q=m,Y=A):(C=c,_=l,R=u,I=d,G=S,L=x,q=A,Y=m)),T===0)return null;let Z=C/T,tt=_/T,Q=1/T,Dt=R-Z*O,It=I-tt*O,ae=G-Z*V,ue=L-tt*V,se=q-Z*rt,$=Y-tt*rt,st=se*ue-$*ae,Tt=Dt*$-It*se,Jt=ae*It-ue*Dt;if(s){if(st<0||Tt<0||Jt<0)return null}else if((st<0||Tt<0||Jt<0)&&(st>0||Tt>0||Jt>0))return null;let wt=st+Tt+Jt;if(wt===0)return null;let jt=Q*(st*O+Tt*V+Jt*rt);return(wt>0?jt<0:jt>0)?null:this.at(jt/wt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Si=class extends Mi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=Rl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Vc=new Le,Ni=new va,Xr=new yi,Gc=new z,qr=new z,Yr=new z,Zr=new z,ll=new z,Jr=new z,kc=new z,$r=new z,Ge=class extends fn{constructor(t=new qe,e=new Si){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Jr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(ll.fromBufferAttribute(d,t),a?Jr.addScaledVector(ll,h):Jr.addScaledVector(ll.sub(e),h))}e.add(Jr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(r),Ni.copy(t.ray).recast(t.near),!(Xr.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(Xr,Gc)===null||Ni.origin.distanceToSquared(Gc)>(t.far-t.near)**2))&&(Vc.copy(r).invert(),Ni.copy(t.ray).applyMatrix4(Vc),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ni)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,S=u.length;x<S;x++){let g=u[x],m=a[g.materialIndex],A=Math.max(g.start,f.start),E=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=A,b=E;v<b;v+=3){let M=o.getX(v),C=o.getX(v+1),_=o.getX(v+2);s=Kr(this,m,t,n,c,h,d,M,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let x=Math.max(0,f.start),S=Math.min(o.count,f.start+f.count);for(let g=x,m=S;g<m;g+=3){let A=o.getX(g),E=o.getX(g+1),v=o.getX(g+2);s=Kr(this,a,t,n,c,h,d,A,E,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,S=u.length;x<S;x++){let g=u[x],m=a[g.materialIndex],A=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=A,b=E;v<b;v+=3){let M=v,C=v+1,_=v+2;s=Kr(this,m,t,n,c,h,d,M,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let x=Math.max(0,f.start),S=Math.min(l.count,f.start+f.count);for(let g=x,m=S;g<m;g+=3){let A=g,E=g+1,v=g+2;s=Kr(this,a,t,n,c,h,d,A,E,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function vd(i,t,e,n,s,r,a,o){let l;if(t.side===en?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Ci,o),l===null)return null;$r.copy(o),$r.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo($r);return c<e.near||c>e.far?null:{distance:c,point:$r.clone(),object:i}}function Kr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,qr),i.getVertexPosition(l,Yr),i.getVertexPosition(c,Zr);let h=vd(i,t,e,n,qr,Yr,Zr,kc);if(h){let d=new z;_i.getBarycoord(kc,qr,Yr,Zr,d),s&&(h.uv=_i.getInterpolatedAttribute(s,o,l,c,d,new yt)),r&&(h.uv1=_i.getInterpolatedAttribute(r,o,l,c,d,new yt)),a&&(h.normal=_i.getInterpolatedAttribute(a,o,l,c,d,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new z,materialIndex:0};_i.getNormal(qr,Yr,Zr,u.normal),h.face=u,h.barycoord=d}return h}var er=class extends dn{constructor(t=null,e=1,n=1,s,r,a,o,l,c=We,h=We,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bi=class extends ln{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},rs=new Le,Hc=new Le,jr=[],Wc=new $n,yd=new Le,Gs=new Ge,ks=new yi,nr=class extends Ge{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new bi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,yd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,rs),Wc.copy(t.boundingBox).applyMatrix4(rs),this.boundingBox.union(Wc)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new yi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,rs),ks.copy(t.boundingSphere).applyMatrix4(rs),this.boundingSphere.union(ks)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Gs.geometry=this.geometry,Gs.material=this.material,Gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ks.copy(this.boundingSphere),ks.applyMatrix4(n),t.ray.intersectsSphere(ks)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,rs),Hc.multiplyMatrices(n,rs),Gs.matrixWorld=Hc,Gs.raycast(t,jr);for(let a=0,o=jr.length;a<o;a++){let l=jr[a];l.instanceId=r,l.object=this,e.push(l)}jr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new bi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new er(new Float32Array(s*this.count),s,this.count,$a,Dn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fi=new yi,Md=new yt(.5,.5),Qr=new z,ms=class{constructor(t=new zn,e=new zn,n=new zn,s=new zn,r=new zn,a=new zn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Vn,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],x=r[8],S=r[9],g=r[10],m=r[11],A=r[12],E=r[13],v=r[14],b=r[15];if(s[0].setComponents(c-a,f-h,m-x,b-A).normalize(),s[1].setComponents(c+a,f+h,m+x,b+A).normalize(),s[2].setComponents(c+o,f+d,m+S,b+E).normalize(),s[3].setComponents(c-o,f-d,m-S,b-E).normalize(),n)s[4].setComponents(l,u,g,v).normalize(),s[5].setComponents(c-l,f-u,m-g,b-v).normalize();else if(s[4].setComponents(c-l,f-u,m-g,b-v).normalize(),e===Vn)s[5].setComponents(c+l,f+u,m+g,b+v).normalize();else if(e===us)s[5].setComponents(l,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Fi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Fi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Fi)}intersectsSprite(t){Fi.center.set(0,0,0);let e=Md.distanceTo(t.center);return Fi.radius=.7071067811865476+e,Fi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Fi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Qr.x=s.normal.x>0?t.max.x:t.min.x,Qr.y=s.normal.y>0?t.max.y:t.min.y,Qr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ir=class extends dn{constructor(t=[],e=Ri,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},li=class extends dn{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Kn=class extends dn{constructor(t,e,n=En,s,r,a,o=We,l=We,c,h=Zn,d=1){if(h!==Zn&&h!==Ii)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new fs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},ya=class extends Kn{constructor(t,e=En,n=Ri,s,r,a=We,o=We,l,c=Zn){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},sr=class extends dn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},gs=class i extends qe{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;x("z","y","x",-1,-1,n,e,t,a,r,0),x("z","y","x",1,-1,n,e,-t,a,r,1),x("x","z","y",1,1,t,n,e,s,a,2),x("x","z","y",1,-1,t,n,-e,s,a,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(h,3)),this.setAttribute("uv",new Re(d,2));function x(S,g,m,A,E,v,b,M,C,_,T){let R=v/C,I=b/_,O=v/2,G=b/2,L=M/2,V=C+1,q=_+1,Y=0,rt=0,Z=new z;for(let tt=0;tt<q;tt++){let Q=tt*I-G;for(let Dt=0;Dt<V;Dt++){let It=Dt*R-O;Z[S]=It*A,Z[g]=Q*E,Z[m]=L,c.push(Z.x,Z.y,Z.z),Z[S]=0,Z[g]=0,Z[m]=M>0?1:-1,h.push(Z.x,Z.y,Z.z),d.push(Dt/C),d.push(1-tt/_),Y+=1}}for(let tt=0;tt<_;tt++)for(let Q=0;Q<C;Q++){let Dt=u+Q+V*tt,It=u+Q+V*(tt+1),ae=u+(Q+1)+V*(tt+1),ue=u+(Q+1)+V*tt;l.push(Dt,It,ue),l.push(It,ae,ue),rt+=6}o.addGroup(f,rt,T),f+=rt,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var rr=class i extends qe{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],x=0,S=[],g=n/2,m=0;A(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Re(d,3)),this.setAttribute("normal",new Re(u,3)),this.setAttribute("uv",new Re(f,2));function A(){let v=new z,b=new z,M=0,C=(e-t)/n;for(let _=0;_<=r;_++){let T=[],R=_/r,I=R*(e-t)+t;for(let O=0;O<=s;O++){let G=O/s,L=G*l+o,V=Math.sin(L),q=Math.cos(L);b.x=I*V,b.y=-R*n+g,b.z=I*q,d.push(b.x,b.y,b.z),v.set(V,C,q).normalize(),u.push(v.x,v.y,v.z),f.push(G,1-R),T.push(x++)}S.push(T)}for(let _=0;_<s;_++)for(let T=0;T<r;T++){let R=S[T][_],I=S[T+1][_],O=S[T+1][_+1],G=S[T][_+1];(t>0||T!==0)&&(h.push(R,I,G),M+=3),(e>0||T!==r-1)&&(h.push(I,O,G),M+=3)}c.addGroup(m,M,0),m+=M}function E(v){let b=x,M=new yt,C=new z,_=0,T=v===!0?t:e,R=v===!0?1:-1;for(let O=1;O<=s;O++)d.push(0,g*R,0),u.push(0,R,0),f.push(.5,.5),x++;let I=x;for(let O=0;O<=s;O++){let L=O/s*l+o,V=Math.cos(L),q=Math.sin(L);C.x=T*q,C.y=g*R,C.z=T*V,d.push(C.x,C.y,C.z),u.push(0,R,0),M.x=V*.5+.5,M.y=q*.5*R+.5,f.push(M.x,M.y),x++}for(let O=0;O<s;O++){let G=b+O,L=I+O;v===!0?h.push(L,L+1,G):h.push(L+1,L,G),_+=3}c.addGroup(m,_,v===!0?1:2),m+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var bn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ee("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new yt:new z);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new z,s=[],r=[],a=[],o=new z,l=new Le;for(let f=0;f<=t;f++){let x=f/t;s[f]=this.getTangentAt(x,new z)}r[0]=new z,a[0]=new z;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let x=Math.acos(_e(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,x))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(_e(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let x=1;x<=t;x++)r[x].applyMatrix4(l.makeRotationAxis(s[x],f*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},xs=class extends bn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new yt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ma=class extends xs{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Yl(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Xc=new z,qc=new z,cl=new Yl,hl=new Yl,ul=new Yl,_s=class extends bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new z){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(qc.subVectors(s[0],s[1]).add(s[0]),c=qc);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Xc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Xc),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,x=Math.pow(c.distanceToSquared(d),f),S=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);S<1e-4&&(S=1),x<1e-4&&(x=S),g<1e-4&&(g=S),cl.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,x,S,g),hl.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,x,S,g),ul.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,x,S,g)}else this.curveType==="catmullrom"&&(cl.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),hl.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),ul.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(cl.calc(l),hl.calc(l),ul.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new z().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Yc(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Sd(i,t){let e=1-i;return e*e*t}function bd(i,t){return 2*(1-i)*i*t}function Td(i,t){return i*i*t}function Ws(i,t,e,n){return Sd(i,t)+bd(i,e)+Td(i,n)}function Ad(i,t){let e=1-i;return e*e*e*t}function wd(i,t){let e=1-i;return 3*e*e*i*t}function Ed(i,t){return 3*(1-i)*i*i*t}function Cd(i,t){return i*i*i*t}function Xs(i,t,e,n,s){return Ad(i,t)+wd(i,e)+Ed(i,n)+Cd(i,s)}var ar=class extends bn{constructor(t=new yt,e=new yt,n=new yt,s=new yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new yt){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xs(t,s.x,r.x,a.x,o.x),Xs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Sa=class extends bn{constructor(t=new z,e=new z,n=new z,s=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new z){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xs(t,s.x,r.x,a.x,o.x),Xs(t,s.y,r.y,a.y,o.y),Xs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},or=class extends bn{constructor(t=new yt,e=new yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new yt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ba=class extends bn{constructor(t=new z,e=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new z){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},lr=class extends bn{constructor(t=new yt,e=new yt,n=new yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new yt){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ws(t,s.x,r.x,a.x),Ws(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},cr=class extends bn{constructor(t=new z,e=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new z){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ws(t,s.x,r.x,a.x),Ws(t,s.y,r.y,a.y),Ws(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},hr=class extends bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new yt){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Yc(o,l.x,c.x,h.x,d.x),Yc(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new yt().fromArray(s))}return this}},Ta=Object.freeze({__proto__:null,ArcCurve:Ma,CatmullRomCurve3:_s,CubicBezierCurve:ar,CubicBezierCurve3:Sa,EllipseCurve:xs,LineCurve:or,LineCurve3:ba,QuadraticBezierCurve:lr,QuadraticBezierCurve3:cr,SplineCurve:hr}),Aa=class extends bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ta[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Ta[s.type]().fromJSON(s))}return this}},ci=class extends Aa{constructor(t){super(),this.type="Path",this.currentPoint=new yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new or(this.currentPoint.clone(),new yt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new lr(this.currentPoint.clone(),new yt(t,e),new yt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new ar(this.currentPoint.clone(),new yt(t,e),new yt(n,s),new yt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new hr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let c=new xs(t,e,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},tn=class extends ci{constructor(t){super(t),this.uuid=As(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new ci().fromJSON(s))}return this}};function Rd(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=kh(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Ud(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,d=l;for(let u=e;u<s;u+=e){let f=i[u],x=i[u+1];f<o&&(o=f),x<l&&(l=x),f>h&&(h=f),x>d&&(d=x)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return ur(r,a,e,o,l,c,0),a}function kh(i,t,e,n,s){let r;if(s===Xd(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Zc(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Zc(a/n|0,i[a],i[a+1],r);return r&&vs(r,r.next)&&(fr(r),r=r.next),r}function Gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(vs(e,e.next)||Be(e.prev,e,e.next)===0)){if(fr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ur(i,t,e,n,s,r,a){if(!i)return;!a&&r&&zd(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Pd(i,n,s,r):Id(i)){t.push(l.i,i.i,c.i),fr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Ld(Gi(i),t),ur(i,t,e,n,s,r,2)):a===2&&Dd(i,t,e,n,s,r):ur(Gi(i),t,e,n,s,r,1);break}}}function Id(i){let t=i.prev,e=i,n=i.next;if(Be(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),f=Math.max(o,l,c),x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=u&&x.y>=d&&x.y<=f&&Hs(s,o,r,l,a,c,x.x,x.y)&&Be(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Pd(i,t,e,n){let s=i.prev,r=i,a=i.next;if(Be(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,l,c),x=Math.min(h,d,u),S=Math.max(o,l,c),g=Math.max(h,d,u),m=_l(f,x,t,e,n),A=_l(S,g,t,e,n),E=i.prevZ,v=i.nextZ;for(;E&&E.z>=m&&v&&v.z<=A;){if(E.x>=f&&E.x<=S&&E.y>=x&&E.y<=g&&E!==s&&E!==a&&Hs(o,h,l,d,c,u,E.x,E.y)&&Be(E.prev,E,E.next)>=0||(E=E.prevZ,v.x>=f&&v.x<=S&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Hs(o,h,l,d,c,u,v.x,v.y)&&Be(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;E&&E.z>=m;){if(E.x>=f&&E.x<=S&&E.y>=x&&E.y<=g&&E!==s&&E!==a&&Hs(o,h,l,d,c,u,E.x,E.y)&&Be(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;v&&v.z<=A;){if(v.x>=f&&v.x<=S&&v.y>=x&&v.y<=g&&v!==s&&v!==a&&Hs(o,h,l,d,c,u,v.x,v.y)&&Be(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Ld(i,t){let e=i;do{let n=e.prev,s=e.next.next;!vs(n,s)&&Wh(n,e,e.next,s)&&dr(n,s)&&dr(s,n)&&(t.push(n.i,e.i,s.i),fr(e),fr(e.next),e=i=s),e=e.next}while(e!==i);return Gi(e)}function Dd(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&kd(a,o)){let l=Xh(a,o);a=Gi(a,a.next),l=Gi(l,l.next),ur(a,t,e,n,s,r,0),ur(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Ud(i,t,e,n){let s=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=kh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Gd(c))}s.sort(Nd);for(let r=0;r<s.length;r++)e=Fd(s[r],e);return e}function Nd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Fd(i,t){let e=Od(i,t);if(!e)return t;let n=Xh(e,i);return Gi(n,n.next),Gi(e,e.next)}function Od(i,t){let e=t,n=i.x,s=i.y,r=-1/0,a;if(vs(i,e))return e;do{if(vs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Hh(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);dr(e,i)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&Bd(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function Bd(i,t){return Be(i.prev,i,t.prev)<0&&Be(t.next,i,i.next)<0}function zd(i,t,e,n){let s=i;do s.z===0&&(s.z=_l(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Vd(s)}function Vd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function _l(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Gd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Hh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Hs(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Hh(i,t,e,n,s,r,a,o)}function kd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Hd(i,t)&&(dr(i,t)&&dr(t,i)&&Wd(i,t)&&(Be(i.prev,i,t.prev)||Be(i,t.prev,t))||vs(i,t)&&Be(i.prev,i,i.next)>0&&Be(t.prev,t,t.next)>0)}function Be(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function vs(i,t){return i.x===t.x&&i.y===t.y}function Wh(i,t,e,n){let s=ea(Be(i,t,e)),r=ea(Be(i,t,n)),a=ea(Be(e,n,i)),o=ea(Be(e,n,t));return!!(s!==r&&a!==o||s===0&&ta(i,e,t)||r===0&&ta(i,n,t)||a===0&&ta(e,i,n)||o===0&&ta(e,t,n))}function ta(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ea(i){return i>0?1:i<0?-1:0}function Hd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Wh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function dr(i,t){return Be(i.prev,i,i.next)<0?Be(i,t,i.next)>=0&&Be(i,i.prev,t)>=0:Be(i,t,i.prev)<0||Be(i,i.next,t)<0}function Wd(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Xh(i,t){let e=vl(i.i,i.x,i.y),n=vl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Zc(i,t,e,n){let s=vl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function fr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function vl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Xd(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var yl=class{static triangulate(t,e,n=2){return Rd(t,e,n)}},Bi=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Jc(t),$c(n,t);let a=t.length;e.forEach(Jc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,$c(n,e[l]);let o=yl.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Jc(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function $c(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var pr=class i extends qe{constructor(t=new tn([new yt(.5,.5),new yt(-.5,.5),new yt(-.5,-.5),new yt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new Re(s,3)),this.setAttribute("uv",new Re(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:f-.1,S=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:qd,E,v=!1,b,M,C,_;if(m){E=m.getSpacedPoints(h),v=!0,u=!1;let it=m.isCatmullRomCurve3?m.closed:!1;b=m.computeFrenetFrames(h,it),M=new z,C=new z,_=new z}u||(g=0,f=0,x=0,S=0);let T=o.extractPoints(c),R=T.shape,I=T.holes;if(!Bi.isClockWise(R)){R=R.reverse();for(let it=0,ot=I.length;it<ot;it++){let ut=I[it];Bi.isClockWise(ut)&&(I[it]=ut.reverse())}}function G(it){let ut=10000000000000001e-36,dt=it[0];for(let pt=1;pt<=it.length;pt++){let Kt=pt%it.length,Yt=it[Kt],$t=Yt.x-dt.x,Qt=Yt.y-dt.y,P=$t*$t+Qt*Qt,Me=Math.max(Math.abs(Yt.x),Math.abs(Yt.y),Math.abs(dt.x),Math.abs(dt.y)),ne=ut*Me*Me;if(P<=ne){it.splice(Kt,1),pt--;continue}dt=Yt}}G(R),I.forEach(G);let L=I.length,V=R;for(let it=0;it<L;it++){let ot=I[it];R=R.concat(ot)}function q(it,ot,ut){return ot||ie("ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(ot,ut)}let Y=R.length;function rt(it,ot,ut){let dt,pt,Kt,Yt=it.x-ot.x,$t=it.y-ot.y,Qt=ut.x-it.x,P=ut.y-it.y,Me=Yt*Yt+$t*$t,ne=Yt*P-$t*Qt;if(Math.abs(ne)>Number.EPSILON){let w=Math.sqrt(Me),p=Math.sqrt(Qt*Qt+P*P),B=ot.x-$t/w,U=ot.y+Yt/w,K=ut.x-P/p,_t=ut.y+Qt/p,Mt=((K-B)*P-(_t-U)*Qt)/(Yt*P-$t*Qt);dt=B+Yt*Mt-it.x,pt=U+$t*Mt-it.y;let j=dt*dt+pt*pt;if(j<=2)return new yt(dt,pt);Kt=Math.sqrt(j/2)}else{let w=!1;Yt>Number.EPSILON?Qt>Number.EPSILON&&(w=!0):Yt<-Number.EPSILON?Qt<-Number.EPSILON&&(w=!0):Math.sign($t)===Math.sign(P)&&(w=!0),w?(dt=-$t,pt=Yt,Kt=Math.sqrt(Me)):(dt=Yt,pt=$t,Kt=Math.sqrt(Me/2))}return new yt(dt/Kt,pt/Kt)}let Z=[];for(let it=0,ot=V.length,ut=ot-1,dt=it+1;it<ot;it++,ut++,dt++)ut===ot&&(ut=0),dt===ot&&(dt=0),Z[it]=rt(V[it],V[ut],V[dt]);let tt=[],Q,Dt=Z.concat();for(let it=0,ot=L;it<ot;it++){let ut=I[it];Q=[];for(let dt=0,pt=ut.length,Kt=pt-1,Yt=dt+1;dt<pt;dt++,Kt++,Yt++)Kt===pt&&(Kt=0),Yt===pt&&(Yt=0),Q[dt]=rt(ut[dt],ut[Kt],ut[Yt]);tt.push(Q),Dt=Dt.concat(Q)}let It;if(g===0)It=Bi.triangulateShape(V,I);else{let it=[],ot=[];for(let ut=0;ut<g;ut++){let dt=ut/g,pt=f*Math.cos(dt*Math.PI/2),Kt=x*Math.sin(dt*Math.PI/2)+S;for(let Yt=0,$t=V.length;Yt<$t;Yt++){let Qt=q(V[Yt],Z[Yt],Kt);Tt(Qt.x,Qt.y,-pt),dt===0&&it.push(Qt)}for(let Yt=0,$t=L;Yt<$t;Yt++){let Qt=I[Yt];Q=tt[Yt];let P=[];for(let Me=0,ne=Qt.length;Me<ne;Me++){let w=q(Qt[Me],Q[Me],Kt);Tt(w.x,w.y,-pt),dt===0&&P.push(w)}dt===0&&ot.push(P)}}It=Bi.triangulateShape(it,ot)}let ae=It.length,ue=x+S;for(let it=0;it<Y;it++){let ot=u?q(R[it],Dt[it],ue):R[it];v?(C.copy(b.normals[0]).multiplyScalar(ot.x),M.copy(b.binormals[0]).multiplyScalar(ot.y),_.copy(E[0]).add(C).add(M),Tt(_.x,_.y,_.z)):Tt(ot.x,ot.y,0)}for(let it=1;it<=h;it++)for(let ot=0;ot<Y;ot++){let ut=u?q(R[ot],Dt[ot],ue):R[ot];v?(C.copy(b.normals[it]).multiplyScalar(ut.x),M.copy(b.binormals[it]).multiplyScalar(ut.y),_.copy(E[it]).add(C).add(M),Tt(_.x,_.y,_.z)):Tt(ut.x,ut.y,d/h*it)}for(let it=g-1;it>=0;it--){let ot=it/g,ut=f*Math.cos(ot*Math.PI/2),dt=x*Math.sin(ot*Math.PI/2)+S;for(let pt=0,Kt=V.length;pt<Kt;pt++){let Yt=q(V[pt],Z[pt],dt);Tt(Yt.x,Yt.y,d+ut)}for(let pt=0,Kt=I.length;pt<Kt;pt++){let Yt=I[pt];Q=tt[pt];for(let $t=0,Qt=Yt.length;$t<Qt;$t++){let P=q(Yt[$t],Q[$t],dt);v?Tt(P.x,P.y+E[h-1].y,E[h-1].x+ut):Tt(P.x,P.y,d+ut)}}}se(),$();function se(){let it=s.length/3;if(u){let ot=0,ut=Y*ot;for(let dt=0;dt<ae;dt++){let pt=It[dt];Jt(pt[2]+ut,pt[1]+ut,pt[0]+ut)}ot=h+g*2,ut=Y*ot;for(let dt=0;dt<ae;dt++){let pt=It[dt];Jt(pt[0]+ut,pt[1]+ut,pt[2]+ut)}}else{for(let ot=0;ot<ae;ot++){let ut=It[ot];Jt(ut[2],ut[1],ut[0])}for(let ot=0;ot<ae;ot++){let ut=It[ot];Jt(ut[0]+Y*h,ut[1]+Y*h,ut[2]+Y*h)}}n.addGroup(it,s.length/3-it,0)}function $(){let it=s.length/3,ot=0;st(V,ot),ot+=V.length;for(let ut=0,dt=I.length;ut<dt;ut++){let pt=I[ut];st(pt,ot),ot+=pt.length}n.addGroup(it,s.length/3-it,1)}function st(it,ot){let ut=it.length;for(;--ut>=0;){let dt=ut,pt=ut-1;pt<0&&(pt=it.length-1);for(let Kt=0,Yt=h+g*2;Kt<Yt;Kt++){let $t=Y*Kt,Qt=Y*(Kt+1),P=ot+dt+$t,Me=ot+pt+$t,ne=ot+pt+Qt,w=ot+dt+Qt;wt(P,Me,ne,w)}}}function Tt(it,ot,ut){l.push(it),l.push(ot),l.push(ut)}function Jt(it,ot,ut){jt(it),jt(ot),jt(ut);let dt=s.length/3,pt=A.generateTopUV(n,s,dt-3,dt-2,dt-1);te(pt[0]),te(pt[1]),te(pt[2])}function wt(it,ot,ut,dt){jt(it),jt(ot),jt(dt),jt(ot),jt(ut),jt(dt);let pt=s.length/3,Kt=A.generateSideWallUV(n,s,pt-6,pt-3,pt-2,pt-1);te(Kt[0]),te(Kt[1]),te(Kt[3]),te(Kt[1]),te(Kt[2]),te(Kt[3])}function jt(it){s.push(l[it*3+0]),s.push(l[it*3+1]),s.push(l[it*3+2])}function te(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Yd(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ta[s.type]().fromJSON(s)),new i(n,t.options)}},qd={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new yt(r,a),new yt(o,l),new yt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],x=t[s*3+2],S=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new yt(a,1-l),new yt(c,1-d),new yt(u,1-x),new yt(S,1-m)]:[new yt(o,1-l),new yt(h,1-d),new yt(f,1-x),new yt(g,1-m)]}};function Yd(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var mr=class i extends qe{constructor(t=[new yt(0,-.5),new yt(.5,0),new yt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=_e(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/e,d=new z,u=new yt,f=new z,x=new z,S=new z,g=0,m=0;for(let A=0;A<=t.length-1;A++)switch(A){case 0:g=t[A+1].x-t[A].x,m=t[A+1].y-t[A].y,f.x=m*1,f.y=-g,f.z=m*0,S.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(S.x,S.y,S.z);break;default:g=t[A+1].x-t[A].x,m=t[A+1].y-t[A].y,f.x=m*1,f.y=-g,f.z=m*0,x.copy(f),f.x+=S.x,f.y+=S.y,f.z+=S.z,f.normalize(),l.push(f.x,f.y,f.z),S.copy(x)}for(let A=0;A<=e;A++){let E=n+A*h*s,v=Math.sin(E),b=Math.cos(E);for(let M=0;M<=t.length-1;M++){d.x=t[M].x*v,d.y=t[M].y,d.z=t[M].x*b,a.push(d.x,d.y,d.z),u.x=A/e,u.y=M/(t.length-1),o.push(u.x,u.y);let C=l[3*M+0]*v,_=l[3*M+1],T=l[3*M+0]*b;c.push(C,_,T)}}for(let A=0;A<e;A++)for(let E=0;E<t.length-1;E++){let v=E+A*t.length,b=v,M=v+t.length,C=v+t.length+1,_=v+1;r.push(b,M,_),r.push(C,_,M)}this.setIndex(r),this.setAttribute("position",new Re(a,3)),this.setAttribute("uv",new Re(o,2)),this.setAttribute("normal",new Re(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var hi=class i extends qe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],x=[],S=[],g=[];for(let m=0;m<h;m++){let A=m*u-a;for(let E=0;E<c;E++){let v=E*d-r;x.push(v,-A,0),S.push(0,0,1),g.push(E/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let A=0;A<o;A++){let E=A+c*m,v=A+c*(m+1),b=A+1+c*(m+1),M=A+1+c*m;f.push(E,v,M),f.push(v,b,M)}this.setIndex(f),this.setAttribute("position",new Re(x,3)),this.setAttribute("normal",new Re(S,3)),this.setAttribute("uv",new Re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var gr=class i extends qe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new z,u=new z,f=[],x=[],S=[],g=[];for(let m=0;m<=n;m++){let A=[],E=m/n,v=a+E*o,b=t*Math.cos(v),M=Math.sqrt(t*t-b*b),C=0;m===0&&a===0?C=.5/e:m===n&&l===Math.PI&&(C=-.5/e);for(let _=0;_<=e;_++){let T=_/e,R=s+T*r;d.x=-M*Math.cos(R),d.y=b,d.z=M*Math.sin(R),x.push(d.x,d.y,d.z),u.copy(d).normalize(),S.push(u.x,u.y,u.z),g.push(T+C,1-E),A.push(c++)}h.push(A)}for(let m=0;m<n;m++)for(let A=0;A<e;A++){let E=h[m][A+1],v=h[m][A],b=h[m+1][A],M=h[m+1][A+1];(m!==0||a>0)&&f.push(E,v,M),(m!==n-1||l<Math.PI)&&f.push(v,b,M)}this.setIndex(f),this.setAttribute("position",new Re(x,3)),this.setAttribute("normal",new Re(S,3)),this.setAttribute("uv",new Re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var xr=class i extends qe{constructor(t=new cr(new z(-1,-1,0),new z(-1,1,0),new z(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new z,l=new z,c=new yt,h=new z,d=[],u=[],f=[],x=[];S(),this.setIndex(x),this.setAttribute("position",new Re(d,3)),this.setAttribute("normal",new Re(u,3)),this.setAttribute("uv",new Re(f,2));function S(){for(let E=0;E<e;E++)g(E);g(r===!1?e:0),A(),m()}function g(E){h=t.getPointAt(E/e,h);let v=a.normals[E],b=a.binormals[E];for(let M=0;M<=s;M++){let C=M/s*Math.PI*2,_=Math.sin(C),T=-Math.cos(C);l.x=T*v.x+_*b.x,l.y=T*v.y+_*b.y,l.z=T*v.z+_*b.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function m(){for(let E=1;E<=e;E++)for(let v=1;v<=s;v++){let b=(s+1)*(E-1)+(v-1),M=(s+1)*E+(v-1),C=(s+1)*E+v,_=(s+1)*(E-1)+v;x.push(b,M,_),x.push(M,C,_)}}function A(){for(let E=0;E<=e;E++)for(let v=0;v<=s;v++)c.x=E/e,c.y=v/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Ta[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function Xi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Kc(s))s.isRenderTargetTexture?(ee("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Kc(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function hn(i){let t={};for(let e=0;e<i.length;e++){let n=Xi(i[e]);for(let s in n)t[s]=n[s]}return t}function Kc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Zd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zl(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Se.workingColorSpace}var qh={clone:Xi,merge:hn},Jd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$d=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,pn=class extends Mi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jd,this.fragmentShader=$d,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=Zd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new re().setHex(s.value);break;case"v2":this.uniforms[n].value=new yt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new z().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Fe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new le().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Le().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},wa=class extends pn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ui=class extends Mi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Po,this.normalScale=new yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ys=class extends ui{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new yt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return _e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new re(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new re(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new re(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Ea=class extends Mi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ca=class extends Mi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function as(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ti=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ra=class extends Ti{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ml,endingEnd:ml}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case gl:r=t,o=2*e-n;break;case xl:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case gl:a=t,l=2*n-e;break;case xl:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,x=(n-e)/(s-e),S=x*x,g=S*x,m=-u*g+2*u*S-u*x,A=(1+u)*g+(-1.5-2*u)*S+(-.5+u)*x+1,E=(-1-f)*g+(1.5+f)*S+.5*x,v=f*g-f*S;for(let b=0;b!==o;++b)r[b]=m*a[h+b]+A*a[c+b]+E*a[l+b]+v*a[d+b];return r}},Ia=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},Pa=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},La=class extends Ti{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let x=(n-e)/(s-e),S=1-x;for(let g=0;g!==o;++g)r[g]=a[c+g]*S+a[l+g]*x;return r}let u=o*2,f=t-1;for(let x=0;x!==o;++x){let S=a[c+x],g=a[l+x],m=f*u+x*2,A=d[m],E=d[m+1],v=t*u+x*2,b=h[v],M=h[v+1],C=jd(n,e,A,b,s);r[x]=Yh(C,S,E,M,g)}return r}};function Yh(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function Kd(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function jd(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){let o=Yh(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Kd(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Tn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=as(e,this.TimeBufferType),this.values=as(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:as(t.times,Array),values:as(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),dl(t.settings)&&(n.settings={inTangents:as(t.settings.inTangents,Array),outTangents:as(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Pa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ia(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ra(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new La(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case qs:e=this.InterpolantFactoryMethodDiscrete;break;case pa:e=this.InterpolantFactoryMethodLinear;break;case sa:e=this.InterpolantFactoryMethodSmooth;break;case pl:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ee("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qs;case this.InterpolantFactoryMethodLinear:return pa;case this.InterpolantFactoryMethodSmooth:return sa;case this.InterpolantFactoryMethodBezier:return pl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;dl(this.settings)&&(jc(this.settings.inTangents,t),jc(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(ie("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(ie("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){ie("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){ie("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&ed(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){ie("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===sa,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let x=0;x!==n;++x){let S=e[d+x];if(S!==e[u+x]||S!==e[f+x]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,dl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function jc(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Tn.prototype.ValueTypeName="";Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=pa;var Ai=class extends Tn{constructor(t,e,n){super(t,e,n)}};Ai.prototype.ValueTypeName="bool";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=qs;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Da=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};Da.prototype.ValueTypeName="color";var Ua=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};Ua.prototype.ValueTypeName="number";var Na=class extends Ti{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)Pn.slerpFlat(r,0,a,c-o,a,c,l);return r}},_r=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Na(this.times,this.values,this.getValueSize(),t)}};_r.prototype.ValueTypeName="quaternion";_r.prototype.InterpolantFactoryMethodSmooth=void 0;var wi=class extends Tn{constructor(t,e,n){super(t,e,n)}};wi.prototype.ValueTypeName="string";wi.prototype.ValueBufferType=Array;wi.prototype.DefaultInterpolation=qs;wi.prototype.InterpolantFactoryMethodLinear=void 0;wi.prototype.InterpolantFactoryMethodSmooth=void 0;var Fa=class extends Tn{constructor(t,e,n,s){super(t,e,n,s)}};Fa.prototype.ValueTypeName="vector";var Oa=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],x=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Zh=new Oa,Ba=class{constructor(t){this.manager=t!==void 0?t:Zh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ba.DEFAULT_MATERIAL_NAME="__DEFAULT";var za=class extends fn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new re(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var fl=new Le,Qc=new z,th=new z,Va=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new yt(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new Le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ms,this._frameExtents=new yt(1,1),this._viewportCount=1,this._viewports=[new Fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Qc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qc),th.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(th),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){fl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(fl,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===us||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(fl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},na=new z,ia=new Pn,qn=new z,vr=class extends fn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Le,this.projectionMatrix=new Le,this.projectionMatrixInverse=new Le,this.coordinateSystem=Vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(na,ia,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(na,ia,qn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(na,ia,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(na,ia,qn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xi=new z,eh=new yt,nh=new yt,on=class extends vr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ma*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ko*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ma*2*Math.atan(Math.tan(ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(xi.x,xi.y).multiplyScalar(-t/xi.z),xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xi.x,xi.y).multiplyScalar(-t/xi.z)}getViewSize(t,e){return this.getViewBounds(t,eh,nh),e.subVectors(nh,eh)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ko*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Ei=class extends vr{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ml=class extends Va{constructor(){super(new Ei(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},yr=class extends za{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(fn.DEFAULT_UP),this.updateMatrix(),this.target=new fn,this.shadow=new Ml}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var os=-90,ls=1,Ga=class extends fn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new on(os,ls,t,e);s.layers=this.layers,this.add(s);let r=new on(os,ls,t,e);r.layers=this.layers,this.add(r);let a=new on(os,ls,t,e);a.layers=this.layers,this.add(a);let o=new on(os,ls,t,e);o.layers=this.layers,this.add(o);let l=new on(os,ls,t,e);l.layers=this.layers,this.add(l);let c=new on(os,ls,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===Vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}},ka=class extends on{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Jl="\\[\\]\\.:\\/",Qd=new RegExp("["+Jl+"]","g"),$l="[^"+Jl+"]",tf="[^"+Jl.replace("\\.","")+"]",ef=/((?:WC+[\/:])*)/.source.replace("WC",$l),nf=/(WCOD+)?/.source.replace("WCOD",tf),sf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$l),rf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$l),af=new RegExp("^"+ef+nf+sf+rf+"$"),of=["material","materials","bones","map"],Sl=class{constructor(t,e,n){let s=n||Ne.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ne=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Qd,"")}static parseTrackName(t){let e=af.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);of.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){ee("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){ie("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){ie("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){ie("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){ie("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){ie("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){ie("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){ie("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;ie("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){ie("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){ie("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ne.Composite=Sl;Ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ne.prototype.GetterByBindingType=[Ne.prototype._getValue_direct,Ne.prototype._getValue_array,Ne.prototype._getValue_arrayElement,Ne.prototype._getValue_toArray];Ne.prototype.SetterByBindingTypeAndVersioning=[[Ne.prototype._setValue_direct,Ne.prototype._setValue_direct_setNeedsUpdate,Ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_array,Ne.prototype._setValue_array_setNeedsUpdate,Ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_arrayElement,Ne.prototype._setValue_arrayElement_setNeedsUpdate,Ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_fromArray,Ne.prototype._setValue_fromArray_setNeedsUpdate,Ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yx=new Float32Array(1);var nc=class nc{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};nc.prototype.isMatrix2=!0;var bl=nc;function Kl(i,t,e,n){let s=lf(n);switch(e){case kl:return i*t;case $a:return i*t/s.components*s.byteLength;case Ka:return i*t/s.components*s.byteLength;case Pi:return i*t*2/s.components*s.byteLength;case ja:return i*t*2/s.components*s.byteLength;case Hl:return i*t*3/s.components*s.byteLength;case mn:return i*t*4/s.components*s.byteLength;case Qa:return i*t*4/s.components*s.byteLength;case Tr:case Ar:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case wr:case Er:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:case io:return Math.max(i,16)*Math.max(t,8)/4;case to:case no:return Math.max(i,8)*Math.max(t,8)/2;case so:case ro:case oo:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ao:case Cr:case co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case fo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case go:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case _o:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case vo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case bo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ao:case wo:case Eo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Co:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Rr:case Io:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function lf(i){switch(i){case cn:case Bl:return{byteLength:1,components:1};case bs:case zl:case Cn:return{byteLength:2,components:1};case Za:case Ja:return{byteLength:2,components:4};case En:case Ya:case Dn:return{byteLength:4,components:1};case Vl:case Gl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ee("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function gu(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function mf(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,x)=>f.start-x.start);let u=0;for(let f=1;f<d.length;f++){let x=d[u],S=d[f];S.start<=x.start+x.count+1?x.count=Math.max(x.count,S.start+S.count-x.start):(++u,d[u]=S)}d.length=u+1;for(let f=0,x=d.length;f<x;f++){let S=d[f];i.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,_f=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Mf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,bf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Af=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ef=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Rf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,If=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Uf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ff=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Of=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Bf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,zf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,kf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Jf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Kf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,np=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ip=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,sp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ap=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,op=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,cp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,pp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,mp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,gp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_p=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,vp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ap=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ep=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Pp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Lp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Dp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Up=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Np=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Op=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,zp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Qp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,tm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,em=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,nm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,im=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,am=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,um=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,mm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,gm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,bm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Tm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Am=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Em=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Im=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Pm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Um=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Nm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Om=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Gm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,km=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ym=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ge={alphahash_fragment:gf,alphahash_pars_fragment:xf,alphamap_fragment:_f,alphamap_pars_fragment:vf,alphatest_fragment:yf,alphatest_pars_fragment:Mf,aomap_fragment:Sf,aomap_pars_fragment:bf,batching_pars_vertex:Tf,batching_vertex:Af,begin_vertex:wf,beginnormal_vertex:Ef,bsdfs:Cf,iridescence_fragment:Rf,bumpmap_pars_fragment:If,clipping_planes_fragment:Pf,clipping_planes_pars_fragment:Lf,clipping_planes_pars_vertex:Df,clipping_planes_vertex:Uf,color_fragment:Nf,color_pars_fragment:Ff,color_pars_vertex:Of,color_vertex:Bf,common:zf,cube_uv_reflection_fragment:Vf,defaultnormal_vertex:Gf,displacementmap_pars_vertex:kf,displacementmap_vertex:Hf,emissivemap_fragment:Wf,emissivemap_pars_fragment:Xf,colorspace_fragment:qf,colorspace_pars_fragment:Yf,envmap_fragment:Zf,envmap_common_pars_fragment:Jf,envmap_pars_fragment:$f,envmap_pars_vertex:Kf,envmap_physical_pars_fragment:lp,envmap_vertex:jf,fog_vertex:Qf,fog_pars_vertex:tp,fog_fragment:ep,fog_pars_fragment:np,gradientmap_pars_fragment:ip,lightmap_pars_fragment:sp,lights_lambert_fragment:rp,lights_lambert_pars_fragment:ap,lights_pars_begin:op,lights_toon_fragment:cp,lights_toon_pars_fragment:hp,lights_phong_fragment:up,lights_phong_pars_fragment:dp,lights_physical_fragment:fp,lights_physical_pars_fragment:pp,lights_fragment_begin:mp,lights_fragment_maps:gp,lights_fragment_end:xp,lightprobes_pars_fragment:_p,logdepthbuf_fragment:vp,logdepthbuf_pars_fragment:yp,logdepthbuf_pars_vertex:Mp,logdepthbuf_vertex:Sp,map_fragment:bp,map_pars_fragment:Tp,map_particle_fragment:Ap,map_particle_pars_fragment:wp,metalnessmap_fragment:Ep,metalnessmap_pars_fragment:Cp,morphinstance_vertex:Rp,morphcolor_vertex:Ip,morphnormal_vertex:Pp,morphtarget_pars_vertex:Lp,morphtarget_vertex:Dp,normal_fragment_begin:Up,normal_fragment_maps:Np,normal_pars_fragment:Fp,normal_pars_vertex:Op,normal_vertex:Bp,normalmap_pars_fragment:zp,clearcoat_normal_fragment_begin:Vp,clearcoat_normal_fragment_maps:Gp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:Hp,opaque_fragment:Wp,packing:Xp,premultiplied_alpha_fragment:qp,project_vertex:Yp,dithering_fragment:Zp,dithering_pars_fragment:Jp,roughnessmap_fragment:$p,roughnessmap_pars_fragment:Kp,shadowmap_pars_fragment:jp,shadowmap_pars_vertex:Qp,shadowmap_vertex:tm,shadowmask_pars_fragment:em,skinbase_vertex:nm,skinning_pars_vertex:im,skinning_vertex:sm,skinnormal_vertex:rm,specularmap_fragment:am,specularmap_pars_fragment:om,tonemapping_fragment:lm,tonemapping_pars_fragment:cm,transmission_fragment:hm,transmission_pars_fragment:um,uv_pars_fragment:dm,uv_pars_vertex:fm,uv_vertex:pm,worldpos_vertex:mm,background_vert:gm,background_frag:xm,backgroundCube_vert:_m,backgroundCube_frag:vm,cube_vert:ym,cube_frag:Mm,depth_vert:Sm,depth_frag:bm,distance_vert:Tm,distance_frag:Am,equirect_vert:wm,equirect_frag:Em,linedashed_vert:Cm,linedashed_frag:Rm,meshbasic_vert:Im,meshbasic_frag:Pm,meshlambert_vert:Lm,meshlambert_frag:Dm,meshmatcap_vert:Um,meshmatcap_frag:Nm,meshnormal_vert:Fm,meshnormal_frag:Om,meshphong_vert:Bm,meshphong_frag:zm,meshphysical_vert:Vm,meshphysical_frag:Gm,meshtoon_vert:km,meshtoon_frag:Hm,points_vert:Wm,points_frag:Xm,shadow_vert:qm,shadow_frag:Ym,sprite_vert:Zm,sprite_frag:Jm},Ut={common:{diffuse:{value:new re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new re(16777215)},opacity:{value:1},center:{value:new yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},ti={basic:{uniforms:hn([Ut.common,Ut.specularmap,Ut.envmap,Ut.aomap,Ut.lightmap,Ut.fog]),vertexShader:ge.meshbasic_vert,fragmentShader:ge.meshbasic_frag},lambert:{uniforms:hn([Ut.common,Ut.specularmap,Ut.envmap,Ut.aomap,Ut.lightmap,Ut.emissivemap,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,Ut.fog,Ut.lights,{emissive:{value:new re(0)},envMapIntensity:{value:1}}]),vertexShader:ge.meshlambert_vert,fragmentShader:ge.meshlambert_frag},phong:{uniforms:hn([Ut.common,Ut.specularmap,Ut.envmap,Ut.aomap,Ut.lightmap,Ut.emissivemap,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,Ut.fog,Ut.lights,{emissive:{value:new re(0)},specular:{value:new re(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ge.meshphong_vert,fragmentShader:ge.meshphong_frag},standard:{uniforms:hn([Ut.common,Ut.envmap,Ut.aomap,Ut.lightmap,Ut.emissivemap,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,Ut.roughnessmap,Ut.metalnessmap,Ut.fog,Ut.lights,{emissive:{value:new re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag},toon:{uniforms:hn([Ut.common,Ut.aomap,Ut.lightmap,Ut.emissivemap,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,Ut.gradientmap,Ut.fog,Ut.lights,{emissive:{value:new re(0)}}]),vertexShader:ge.meshtoon_vert,fragmentShader:ge.meshtoon_frag},matcap:{uniforms:hn([Ut.common,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,Ut.fog,{matcap:{value:null}}]),vertexShader:ge.meshmatcap_vert,fragmentShader:ge.meshmatcap_frag},points:{uniforms:hn([Ut.points,Ut.fog]),vertexShader:ge.points_vert,fragmentShader:ge.points_frag},dashed:{uniforms:hn([Ut.common,Ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ge.linedashed_vert,fragmentShader:ge.linedashed_frag},depth:{uniforms:hn([Ut.common,Ut.displacementmap]),vertexShader:ge.depth_vert,fragmentShader:ge.depth_frag},normal:{uniforms:hn([Ut.common,Ut.bumpmap,Ut.normalmap,Ut.displacementmap,{opacity:{value:1}}]),vertexShader:ge.meshnormal_vert,fragmentShader:ge.meshnormal_frag},sprite:{uniforms:hn([Ut.sprite,Ut.fog]),vertexShader:ge.sprite_vert,fragmentShader:ge.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ge.background_vert,fragmentShader:ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:ge.backgroundCube_vert,fragmentShader:ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ge.cube_vert,fragmentShader:ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ge.equirect_vert,fragmentShader:ge.equirect_frag},distance:{uniforms:hn([Ut.common,Ut.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ge.distance_vert,fragmentShader:ge.distance_frag},shadow:{uniforms:hn([Ut.lights,Ut.fog,{color:{value:new re(0)},opacity:{value:1}}]),vertexShader:ge.shadow_vert,fragmentShader:ge.shadow_frag}};ti.physical={uniforms:hn([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new re(0)},specularColor:{value:new re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag};var Uo={r:0,b:0,g:0},$m=new Le,xu=new le;xu.set(-1,0,0,0,1,0,0,0,1);function Km(i,t,e,n,s,r){let a=new re(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(A){let E=A.isScene===!0?A.background:null;if(E&&E.isTexture){let v=A.backgroundBlurriness>0;E=t.get(E,v)}return E}function x(A){let E=!1,v=f(A);v===null?g(a,o):v&&v.isColor&&(g(v,1),E=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(A,E){let v=f(E);v&&(v.isCubeTexture||v.mapping===Sr)?(c===void 0&&(c=new Ge(new gs(1,1,1),new pn({name:"BackgroundCubeMaterial",uniforms:Xi(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,M,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($m.makeRotationFromEuler(E.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(xu),c.material.toneMapped=Se.getTransfer(v.colorSpace)!==Ie,(h!==v||d!==v.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Ge(new hi(2,2),new pn({name:"BackgroundMaterial",uniforms:Xi(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Se.getTransfer(v.colorSpace)!==Ie,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,d=v.version,u=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null))}function g(A,E){A.getRGB(Uo,Zl(i)),e.buffers.color.setClear(Uo.r,Uo.g,Uo.b,E,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,E=1){a.set(A),o=E,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,g(a,o)},render:x,addToRenderList:S,dispose:m}}function jm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(I,O,G,L,V){let q=!1,Y=d(I,L,G,O);r!==Y&&(r=Y,c(r.object)),q=f(I,L,G,V),q&&x(I,L,G,V),V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,v(I,O,G,L),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function d(I,O,G,L){let V=L.wireframe===!0,q=n[O.id];q===void 0&&(q={},n[O.id]=q);let Y=I.isInstancedMesh===!0?I.id:0,rt=q[Y];rt===void 0&&(rt={},q[Y]=rt);let Z=rt[G.id];Z===void 0&&(Z={},rt[G.id]=Z);let tt=Z[V];return tt===void 0&&(tt=u(l()),Z[V]=tt),tt}function u(I){let O=[],G=[],L=[];for(let V=0;V<e;V++)O[V]=0,G[V]=0,L[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:G,attributeDivisors:L,object:I,attributes:{},index:null}}function f(I,O,G,L){let V=r.attributes,q=O.attributes,Y=0,rt=G.getAttributes();for(let Z in rt)if(rt[Z].location>=0){let Q=V[Z],Dt=q[Z];if(Dt===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(Dt=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(Dt=I.instanceColor)),Q===void 0||Q.attribute!==Dt||Dt&&Q.data!==Dt.data)return!0;Y++}return r.attributesNum!==Y||r.index!==L}function x(I,O,G,L){let V={},q=O.attributes,Y=0,rt=G.getAttributes();for(let Z in rt)if(rt[Z].location>=0){let Q=q[Z];Q===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor));let Dt={};Dt.attribute=Q,Q&&Q.data&&(Dt.data=Q.data),V[Z]=Dt,Y++}r.attributes=V,r.attributesNum=Y,r.index=L}function S(){let I=r.newAttributes;for(let O=0,G=I.length;O<G;O++)I[O]=0}function g(I){m(I,0)}function m(I,O){let G=r.newAttributes,L=r.enabledAttributes,V=r.attributeDivisors;G[I]=1,L[I]===0&&(i.enableVertexAttribArray(I),L[I]=1),V[I]!==O&&(i.vertexAttribDivisor(I,O),V[I]=O)}function A(){let I=r.newAttributes,O=r.enabledAttributes;for(let G=0,L=O.length;G<L;G++)O[G]!==I[G]&&(i.disableVertexAttribArray(G),O[G]=0)}function E(I,O,G,L,V,q,Y){Y===!0?i.vertexAttribIPointer(I,O,G,V,q):i.vertexAttribPointer(I,O,G,L,V,q)}function v(I,O,G,L){S();let V=L.attributes,q=G.getAttributes(),Y=O.defaultAttributeValues;for(let rt in q){let Z=q[rt];if(Z.location>=0){let tt=V[rt];if(tt===void 0&&(rt==="instanceMatrix"&&I.instanceMatrix&&(tt=I.instanceMatrix),rt==="instanceColor"&&I.instanceColor&&(tt=I.instanceColor)),tt!==void 0){let Q=tt.normalized,Dt=tt.itemSize,It=t.get(tt);if(It===void 0)continue;let ae=It.buffer,ue=It.type,se=It.bytesPerElement,$=ue===i.INT||ue===i.UNSIGNED_INT||tt.gpuType===Ya;if(tt.isInterleavedBufferAttribute){let st=tt.data,Tt=st.stride,Jt=tt.offset;if(st.isInstancedInterleavedBuffer){for(let wt=0;wt<Z.locationSize;wt++)m(Z.location+wt,st.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let wt=0;wt<Z.locationSize;wt++)g(Z.location+wt);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let wt=0;wt<Z.locationSize;wt++)E(Z.location+wt,Dt/Z.locationSize,ue,Q,Tt*se,(Jt+Dt/Z.locationSize*wt)*se,$)}else{if(tt.isInstancedBufferAttribute){for(let st=0;st<Z.locationSize;st++)m(Z.location+st,tt.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let st=0;st<Z.locationSize;st++)g(Z.location+st);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let st=0;st<Z.locationSize;st++)E(Z.location+st,Dt/Z.locationSize,ue,Q,Dt*se,Dt/Z.locationSize*st*se,$)}}else if(Y!==void 0){let Q=Y[rt];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(Z.location,Q);break;case 3:i.vertexAttrib3fv(Z.location,Q);break;case 4:i.vertexAttrib4fv(Z.location,Q);break;default:i.vertexAttrib1fv(Z.location,Q)}}}}A()}function b(){T();for(let I in n){let O=n[I];for(let G in O){let L=O[G];for(let V in L){let q=L[V];for(let Y in q)h(q[Y].object),delete q[Y];delete L[V]}}delete n[I]}}function M(I){if(n[I.id]===void 0)return;let O=n[I.id];for(let G in O){let L=O[G];for(let V in L){let q=L[V];for(let Y in q)h(q[Y].object),delete q[Y];delete L[V]}}delete n[I.id]}function C(I){for(let O in n){let G=n[O];for(let L in G){let V=G[L];if(V[I.id]===void 0)continue;let q=V[I.id];for(let Y in q)h(q[Y].object),delete q[Y];delete V[I.id]}}}function _(I){for(let O in n){let G=n[O],L=I.isInstancedMesh===!0?I.id:0,V=G[L];if(V!==void 0){for(let q in V){let Y=V[q];for(let rt in Y)h(Y[rt].object),delete Y[rt];delete V[q]}delete G[L],Object.keys(G).length===0&&delete n[O]}}}function T(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:S,enableAttribute:g,disableUnusedAttributes:A}}function Qm(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function t0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==mn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Cn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==cn&&C!==Dn&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(ee("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ee("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),M=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:x,maxTextureSize:S,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:A,maxVaryings:E,maxFragmentUniforms:v,maxSamples:b,samples:M}}function e0(i){let t=this,e=null,n=0,s=!1,r=!1,a=new zn,o=new le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let x=d.clippingPlanes,S=d.clipIntersection,g=d.clipShadows,m=i.get(d);if(!s||x===null||x.length===0||r&&!g)r?h(null):c();else{let A=r?0:n,E=A*4,v=m.clippingState||null;l.value=v,v=h(x,u,E,f);for(let b=0;b!==E;++b)v[b]=e[b];m.clippingState=v,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,x){let S=d!==null?d.length:0,g=null;if(S!==0){if(g=l.value,x!==!0||g===null){let m=f+S*4,A=u.matrixWorldInverse;o.getNormalMatrix(A),(g===null||g.length<m)&&(g=new Float32Array(m));for(let E=0,v=f;E!==S;++E,v+=4)a.copy(d[E]).applyMatrix4(A,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,g}}var Es=4,n0=6,i0=20,s0=256,Ir=new Ei,Jh=new re,ic=null,sc=0,rc=0,ac=!1,r0=new z,qi=new z,Rs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=r0}=r;ic=this._renderer.getRenderTarget(),sc=this._renderer.getActiveCubeFace(),rc=this._renderer.getActiveMipmapLevel(),ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ic,sc,rc),this._renderer.xr.enabled=ac,t.scissorTest=!1,ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ri||t.mapping===Wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ic=this._renderer.getRenderTarget(),sc=this._renderer.getActiveCubeFace(),rc=this._renderer.getActiveMipmapLevel(),ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ve,minFilter:Ve,generateMipmaps:!1,type:Cn,format:mn,colorSpace:Ys,depthBuffer:!1},s=$h(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$h(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=a0(r)),this._blurMaterial=l0(r,t,e),this._ggxMaterial=o0(r,t,e)}return s}_compileMaterial(t){let e=new Ge(new qe,t);this._renderer.compile(e,Ir)}_sceneToCubeUV(t,e,n,s,r){let l=new on(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Jh),d.toneMapping=wn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ge(new gs,new Si({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,g=S.material,m=!1,A=t.background;A?A.isColor&&(g.color.copy(A),t.background=null,m=!0):(g.color.copy(Jh),m=!0);for(let E=0;E<6;E++){let v=E%3;v===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):v===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let b=this._cubeSize;ws(s,v*b,E>2?b:0,b,b),d.setRenderTarget(s),m&&d.render(S,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=A}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ri||t.mapping===Wi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=jh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;ws(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Ir)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:x}=this,S=this._sizeLods[n],g=3*S*(n>x-Es?n-x+Es:0),m=4*(this._cubeSize-S);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=x-e,ws(r,g,m,3*S,2*S),s.setRenderTarget(r),s.render(o,Ir),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-n,ws(t,g,m,3*S,2*S),s.setRenderTarget(t),s.render(o,Ir)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Es?s-this._lodMax+Es:0),u=4*(this._cubeSize-h);ws(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(l,Ir)}};function a0(i){let t=[],e=[],n=i,s=i-Es+1+n0;for(let r=0;r<s;r++){let a=Math.pow(2,n);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,x=new Float32Array(f*u*d),S=new Float32Array(f*u*d);for(let m=0;m<d;m++){let A=m%3*2/3-1,E=m>2?0:-1,v=[A,E,0,A+2/3,E,0,A+2/3,E+1,0,A,E,0,A+2/3,E+1,0,A,E+1,0];x.set(v,f*u*m);for(let b=0;b<u;b++){let M=h[b*2]*2-1,C=h[b*2+1]*2-1;m===0?qi.set(1,C,M):m===1?qi.set(-M,1,-C):m===2?qi.set(-M,C,1):m===3?qi.set(-1,C,-M):m===4?qi.set(-M,-1,C):qi.set(M,C,-1),qi.toArray(S,(m*u+b)*f)}}let g=new qe;g.setAttribute("position",new ln(x,f)),g.setAttribute("outputDirection",new ln(S,f)),e.push(new Ge(g,null)),n>Es&&n--}return{lodMeshes:e,sizeLods:t}}function $h(i,t,e){let n=new Qe(i,t,e);return n.texture.mapping=Sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ws(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function o0(i,t,e){return new pn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:s0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Bo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function l0(i,t,e){return new pn({name:"SphericalGaussianBlur",defines:{SAMPLES:i0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Bo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Kh(){return new pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function jh(){return new pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Bo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Fo=class extends Qe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ir(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new gs(5,5,5),r=new pn({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:An});r.uniforms.tEquirect.value=e;let a=new Ge(s,r),o=e.minFilter;return e.minFilter===jn&&(e.minFilter=Ve),new Ga(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function c0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Wa||f===Xa)if(t.has(u)){let x=t.get(u).texture;return o(x,u.mapping)}else{let x=u.image;if(x&&x.height>0){let S=new Fo(x.height);return S.fromEquirectangularTexture(i,u),t.set(u,S),u.addEventListener("dispose",c),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,x=f===Wa||f===Xa,S=f===Ri||f===Wi;if(x||S){let g=e.get(u),m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new Rs(i)),g=x?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let A=u.image;return x&&A&&A.height>0||S&&A&&l(A)?(n===null&&(n=new Rs(i)),g=x?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,f){return f===Wa?u.mapping=Ri:f===Xa&&(u.mapping=Wi),u}function l(u){let f=0,x=6;for(let S=0;S<x;S++)u[S]!==void 0&&f++;return f===x}function c(u){let f=u.target;f.removeEventListener("dispose",c);let x=t.get(f);x!==void 0&&(t.delete(f),x.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let x=e.get(f);x!==void 0&&(e.delete(f),x.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function h0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&zi("WebGLRenderer: "+n+" extension not supported."),s}}}function u0(i,t,e,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&t.remove(u.index);for(let x in u.attributes)t.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete s[u.id];let f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,x=d.attributes.position,S=0;if(x===void 0)return;if(f!==null){let A=f.array;S=f.version;for(let E=0,v=A.length;E<v;E+=3){let b=A[E+0],M=A[E+1],C=A[E+2];u.push(b,M,M,C,C,b)}}else{let A=x.array;S=x.version;for(let E=0,v=A.length/3-1;E<v;E+=3){let b=E+0,M=E+1,C=E+2;u.push(b,M,M,C,C,b)}}let g=new(x.count>=65535?tr:Qs)(u,1);g.version=S;let m=r.get(d);m&&t.remove(m),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function d0(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let S=0;for(let g=0;g<f;g++)S+=u[g];e.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function f0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:ie("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function p0(i,t,e){let n=new WeakMap,s=new Fe;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let T=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],E=0;f===!0&&(E=1),x===!0&&(E=2),S===!0&&(E=3);let v=o.attributes.position.count*E,b=1;v>t.maxTextureSize&&(b=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let M=new Float32Array(v*b*4*d),C=new $s(M,v,b,d);C.type=Dn,C.needsUpdate=!0;let _=E*4;for(let R=0;R<d;R++){let I=g[R],O=m[R],G=A[R],L=v*b*4*R;for(let V=0;V<I.count;V++){let q=V*_;f===!0&&(s.fromBufferAttribute(I,V),M[L+q+0]=s.x,M[L+q+1]=s.y,M[L+q+2]=s.z,M[L+q+3]=0),x===!0&&(s.fromBufferAttribute(O,V),M[L+q+4]=s.x,M[L+q+5]=s.y,M[L+q+6]=s.z,M[L+q+7]=0),S===!0&&(s.fromBufferAttribute(G,V),M[L+q+8]=s.x,M[L+q+9]=s.y,M[L+q+10]=s.z,M[L+q+11]=G.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new yt(v,b)},n.set(o,u),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let S=0;S<c.length;S++)f+=c[S];let x=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function m0(i,t,e,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var g0={[Il]:"LINEAR_TONE_MAPPING",[Pl]:"REINHARD_TONE_MAPPING",[Ll]:"CINEON_TONE_MAPPING",[Dl]:"ACES_FILMIC_TONE_MAPPING",[Nl]:"AGX_TONE_MAPPING",[Fl]:"NEUTRAL_TONE_MAPPING",[Ul]:"CUSTOM_TONE_MAPPING"};function x0(i,t,e,n,s,r){let a=new Qe(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new qe;c.setAttribute("position",new Re([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Re([0,2,0,0,2,0],2));let h=new wa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Ge(c,h),u=new Ei(-1,1,1,-1,0,1),f=null,x=null,S=!1,g,m=null,A=[],E=!1;this.setSize=function(v,b){a.setSize(v,b),o!==null&&o.setSize(v,b),l!==null&&l.setSize(v,b);for(let M=0;M<A.length;M++){let C=A[M];C.setSize&&C.setSize(v,b)}},this.setEffects=function(v){A=v,E=A.length>0&&A[0].isRenderPass===!0;let b=a.width,M=a.height;A.length>0&&o===null&&(o=new Qe(b,M,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),l=new Qe(b,M,{type:Cn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<A.length;C++){let _=A[C];_.setSize&&_.setSize(b,M)}},this.begin=function(v,b){if(S||v.toneMapping===wn&&A.length===0)return!1;if(m=b,b!==null){let M=b.width,C=b.height;(a.width!==M||a.height!==C)&&this.setSize(M,C)}return E===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=wn,!0},this.hasRenderPass=function(){return E},this.end=function(v,b){v.toneMapping=g,S=!0;let M=a,C=o;for(let _=0;_<A.length;_++){let T=A[_];T.enabled!==!1&&(T.render(v,C,M,b),T.needsSwap!==!1&&(M=C,C=C===o?l:o))}if(f!==v.outputColorSpace||x!==v.toneMapping){f=v.outputColorSpace,x=v.toneMapping,h.defines={},Se.getTransfer(f)===Ie&&(h.defines.SRGB_TRANSFER="");let _=g0[x];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,v.setRenderTarget(m),v.render(d,u),m=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var _u=new dn,cc=new Kn(1,1),vu=new $s,yu=new _a,Mu=new ir,Qh=[],tu=[],eu=new Float32Array(16),nu=new Float32Array(9),iu=new Float32Array(4);function Is(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Qh[s];if(r===void 0&&(r=new Float32Array(s),Qh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ze(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function zo(i,t){let e=tu[t];e===void 0&&(e=new Int32Array(t),tu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function _0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function v0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2fv(this.addr,t),Ze(e,t)}}function y0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ye(e,t))return;i.uniform3fv(this.addr,t),Ze(e,t)}}function M0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4fv(this.addr,t),Ze(e,t)}}function S0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ze(e,t)}else{if(Ye(e,n))return;iu.set(n),i.uniformMatrix2fv(this.addr,!1,iu),Ze(e,n)}}function b0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ze(e,t)}else{if(Ye(e,n))return;nu.set(n),i.uniformMatrix3fv(this.addr,!1,nu),Ze(e,n)}}function T0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ze(e,t)}else{if(Ye(e,n))return;eu.set(n),i.uniformMatrix4fv(this.addr,!1,eu),Ze(e,n)}}function A0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function w0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2iv(this.addr,t),Ze(e,t)}}function E0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;i.uniform3iv(this.addr,t),Ze(e,t)}}function C0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4iv(this.addr,t),Ze(e,t)}}function R0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function I0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2uiv(this.addr,t),Ze(e,t)}}function P0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;i.uniform3uiv(this.addr,t),Ze(e,t)}}function L0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4uiv(this.addr,t),Ze(e,t)}}function D0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(cc.compareFunction=e.isReversedDepthBuffer()?Do:Lo,r=cc):r=_u,e.setTexture2D(t||r,s)}function U0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||yu,s)}function N0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Mu,s)}function F0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||vu,s)}function O0(i){switch(i){case 5126:return _0;case 35664:return v0;case 35665:return y0;case 35666:return M0;case 35674:return S0;case 35675:return b0;case 35676:return T0;case 5124:case 35670:return A0;case 35667:case 35671:return w0;case 35668:case 35672:return E0;case 35669:case 35673:return C0;case 5125:return R0;case 36294:return I0;case 36295:return P0;case 36296:return L0;case 35678:case 36198:case 36298:case 36306:case 35682:return D0;case 35679:case 36299:case 36307:return U0;case 35680:case 36300:case 36308:case 36293:return N0;case 36289:case 36303:case 36311:case 36292:return F0}}function B0(i,t){i.uniform1fv(this.addr,t)}function z0(i,t){let e=Is(t,this.size,2);i.uniform2fv(this.addr,e)}function V0(i,t){let e=Is(t,this.size,3);i.uniform3fv(this.addr,e)}function G0(i,t){let e=Is(t,this.size,4);i.uniform4fv(this.addr,e)}function k0(i,t){let e=Is(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function H0(i,t){let e=Is(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function W0(i,t){let e=Is(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function X0(i,t){i.uniform1iv(this.addr,t)}function q0(i,t){i.uniform2iv(this.addr,t)}function Y0(i,t){i.uniform3iv(this.addr,t)}function Z0(i,t){i.uniform4iv(this.addr,t)}function J0(i,t){i.uniform1uiv(this.addr,t)}function $0(i,t){i.uniform2uiv(this.addr,t)}function K0(i,t){i.uniform3uiv(this.addr,t)}function j0(i,t){i.uniform4uiv(this.addr,t)}function Q0(i,t,e){let n=this.cache,s=t.length,r=zo(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=cc:a=_u;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function tg(i,t,e){let n=this.cache,s=t.length,r=zo(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||yu,r[a])}function eg(i,t,e){let n=this.cache,s=t.length,r=zo(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Mu,r[a])}function ng(i,t,e){let n=this.cache,s=t.length,r=zo(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||vu,r[a])}function ig(i){switch(i){case 5126:return B0;case 35664:return z0;case 35665:return V0;case 35666:return G0;case 35674:return k0;case 35675:return H0;case 35676:return W0;case 5124:case 35670:return X0;case 35667:case 35671:return q0;case 35668:case 35672:return Y0;case 35669:case 35673:return Z0;case 5125:return J0;case 36294:return $0;case 36295:return K0;case 36296:return j0;case 35678:case 36198:case 36298:case 36306:case 35682:return Q0;case 35679:case 36299:case 36307:return tg;case 35680:case 36300:case 36308:case 36293:return eg;case 36289:case 36303:case 36311:case 36292:return ng}}var hc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=O0(e.type)}},uc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ig(e.type)}},dc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},oc=/(\w+)(\])?(\[|\.)?/g;function su(i,t){i.seq.push(t),i.map[t.id]=t}function sg(i,t,e){let n=i.name,s=n.length;for(oc.lastIndex=0;;){let r=oc.exec(n),a=oc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){su(e,c===void 0?new hc(o,i,t):new uc(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new dc(o),su(e,d)),e=d}}}var Cs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);sg(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function ru(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var rg=37297,ag=0;function og(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var au=new le;function lg(i){Se._getMatrix(au,Se.workingColorSpace,i);let t=`mat3( ${au.elements.map(e=>e.toFixed(4))} )`;switch(Se.getTransfer(i)){case Zs:return[t,"LinearTransferOETF"];case Ie:return[t,"sRGBTransferOETF"];default:return ee("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ou(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+og(i.getShaderSource(t),o)}else return r}function cg(i,t){let e=lg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var hg={[Il]:"Linear",[Pl]:"Reinhard",[Ll]:"Cineon",[Dl]:"ACESFilmic",[Nl]:"AgX",[Fl]:"Neutral",[Ul]:"Custom"};function ug(i,t){let e=hg[t];return e===void 0?(ee("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var No=new z;function dg(){Se.getLuminanceCoefficients(No);let i=No.x.toFixed(4),t=No.y.toFixed(4),e=No.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Lr).join(`
`)}function pg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mg(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Lr(i){return i!==""}function lu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function cu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var gg=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(i){return i.replace(gg,_g)}var xg=new Map;function _g(i,t){let e=ge[t];if(e===void 0){let n=xg.get(t);if(n!==void 0)e=ge[n],ee('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return fc(e)}var vg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hu(i){return i.replace(vg,yg)}function yg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function uu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Mg={[ki]:"SHADOWMAP_TYPE_PCF",[Ms]:"SHADOWMAP_TYPE_VSM"};function Sg(i){return Mg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var bg={[Ri]:"ENVMAP_TYPE_CUBE",[Wi]:"ENVMAP_TYPE_CUBE",[Sr]:"ENVMAP_TYPE_CUBE_UV"};function Tg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":bg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ag={[Wi]:"ENVMAP_MODE_REFRACTION"};function wg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Ag[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Eg={[Rl]:"ENVMAP_BLENDING_MULTIPLY",[Th]:"ENVMAP_BLENDING_MIX",[Ah]:"ENVMAP_BLENDING_ADD"};function Cg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Eg[i.combine]||"ENVMAP_BLENDING_NONE"}function Rg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Ig(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Sg(e),c=Tg(e),h=wg(e),d=Cg(e),u=Rg(e),f=fg(e),x=pg(r),S=s.createProgram(),g,m,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Lr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Lr).join(`
`),m.length>0&&(m+=`
`)):(g=[uu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Lr).join(`
`),m=[uu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==wn?"#define TONE_MAPPING":"",e.toneMapping!==wn?ge.tonemapping_pars_fragment:"",e.toneMapping!==wn?ug("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ge.colorspace_pars_fragment,cg("linearToOutputTexel",e.outputColorSpace),dg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Lr).join(`
`)),a=fc(a),a=lu(a,e),a=cu(a,e),o=fc(o),o=lu(o,e),o=cu(o,e),a=hu(a),o=hu(o),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let E=A+g+a,v=A+m+o,b=ru(s,s.VERTEX_SHADER,E),M=ru(s,s.FRAGMENT_SHADER,v);s.attachShader(S,b),s.attachShader(S,M),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function C(I){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(S)||"",G=s.getShaderInfoLog(b)||"",L=s.getShaderInfoLog(M)||"",V=O.trim(),q=G.trim(),Y=L.trim(),rt=!0,Z=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(rt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,b,M);else{let tt=ou(s,b,"vertex"),Q=ou(s,M,"fragment");ie("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+V+`
`+tt+`
`+Q)}else V!==""?ee("WebGLProgram: Program Info Log:",V):(q===""||Y==="")&&(Z=!1);Z&&(I.diagnostics={runnable:rt,programLog:V,vertexShader:{log:q,prefix:g},fragmentShader:{log:Y,prefix:m}})}s.deleteShader(b),s.deleteShader(M),_=new Cs(s,S),T=mg(s,S)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(S,rg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ag++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=M,this}var Pg=0,pc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new mc(t),e.set(t,n)),n}},mc=class{constructor(t){this.id=Pg++,this.code=t,this.usedTimes=0}};function Lg(i){return i===Pi||i===Cr||i===Rr}function Dg(i,t,e,n,s,r){let a=new Ks,o=new pc,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return l.add(_),_===0?"uv":`uv${_}`}function S(_,T,R,I,O,G){let L=I.fog,V=O.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,rt=t.get(_.envMap||q,Y),Z=rt&&rt.mapping===Sr?rt.image.height:null,tt=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&ee("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let Q=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Dt=Q!==void 0?Q.length:0,It=0;V.morphAttributes.position!==void 0&&(It=1),V.morphAttributes.normal!==void 0&&(It=2),V.morphAttributes.color!==void 0&&(It=3);let ae,ue,se,$;if(tt){let Ae=ti[tt];ae=Ae.vertexShader,ue=Ae.fragmentShader}else{ae=_.vertexShader,ue=_.fragmentShader;let Ae=o.getVertexShaderStage(_),ye=o.getFragmentShaderStage(_);o.update(_,Ae,ye),se=Ae.id,$=ye.id}let st=i.getRenderTarget(),Tt=i.state.buffers.depth.getReversed(),Jt=O.isInstancedMesh===!0,wt=O.isBatchedMesh===!0,jt=!!_.map,te=!!_.matcap,it=!!rt,ot=!!_.aoMap,ut=!!_.lightMap,dt=!!_.bumpMap&&_.wireframe===!1,pt=!!_.normalMap,Kt=!!_.displacementMap,Yt=!!_.emissiveMap,$t=!!_.metalnessMap,Qt=!!_.roughnessMap,P=_.anisotropy>0,Me=_.clearcoat>0,ne=_.dispersion>0,w=_.retroreflectivity>0,p=_.iridescence>0,B=_.sheen>0,U=_.transmission>0,K=P&&!!_.anisotropyMap,_t=Me&&!!_.clearcoatMap,Mt=Me&&!!_.clearcoatNormalMap,j=Me&&!!_.clearcoatRoughnessMap,nt=p&&!!_.iridescenceMap,At=p&&!!_.iridescenceThicknessMap,Ot=B&&!!_.sheenColorMap,Et=B&&!!_.sheenRoughnessMap,St=!!_.specularMap,Ht=!!_.specularColorMap,Wt=!!_.specularIntensityMap,Bt=U&&!!_.transmissionMap,D=U&&!!_.thicknessMap,gt=!!_.gradientMap,et=!!_.alphaMap,xt=_.alphaTest>0,bt=!!_.alphaHash,ct=!!_.extensions,Xt=wn;_.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(Xt=i.toneMapping);let zt={shaderID:tt,shaderType:_.type,shaderName:_.name,vertexShader:ae,fragmentShader:ue,defines:_.defines,customVertexShaderID:se,customFragmentShaderID:$,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:wt,batchingColor:wt&&O._colorsTexture!==null,instancing:Jt,instancingColor:Jt&&O.instanceColor!==null,instancingMorph:Jt&&O.morphTexture!==null,outputColorSpace:st===null?i.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:Se.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:jt,matcap:te,envMap:it,envMapMode:it&&rt.mapping,envMapCubeUVHeight:Z,aoMap:ot,lightMap:ut,bumpMap:dt,normalMap:pt,displacementMap:Kt,emissiveMap:Yt,normalMapObjectSpace:pt&&_.normalMapType===Ch,normalMapTangentSpace:pt&&_.normalMapType===Po,packedNormalMap:pt&&_.normalMapType===Po&&Lg(_.normalMap.format),metalnessMap:$t,roughnessMap:Qt,anisotropy:P,anisotropyMap:K,clearcoat:Me,clearcoatMap:_t,clearcoatNormalMap:Mt,clearcoatRoughnessMap:j,dispersion:ne,retroreflection:w,iridescence:p,iridescenceMap:nt,iridescenceThicknessMap:At,sheen:B,sheenColorMap:Ot,sheenRoughnessMap:Et,specularMap:St,specularColorMap:Ht,specularIntensityMap:Wt,transmission:U,transmissionMap:Bt,thicknessMap:D,gradientMap:gt,opaque:_.transparent===!1&&_.blending===Ss&&_.alphaToCoverage===!1,alphaMap:et,alphaTest:xt,alphaHash:bt,combine:_.combine,mapUv:jt&&x(_.map.channel),aoMapUv:ot&&x(_.aoMap.channel),lightMapUv:ut&&x(_.lightMap.channel),bumpMapUv:dt&&x(_.bumpMap.channel),normalMapUv:pt&&x(_.normalMap.channel),displacementMapUv:Kt&&x(_.displacementMap.channel),emissiveMapUv:Yt&&x(_.emissiveMap.channel),metalnessMapUv:$t&&x(_.metalnessMap.channel),roughnessMapUv:Qt&&x(_.roughnessMap.channel),anisotropyMapUv:K&&x(_.anisotropyMap.channel),clearcoatMapUv:_t&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:Mt&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:At&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:Et&&x(_.sheenRoughnessMap.channel),specularMapUv:St&&x(_.specularMap.channel),specularColorMapUv:Ht&&x(_.specularColorMap.channel),specularIntensityMapUv:Wt&&x(_.specularIntensityMap.channel),transmissionMapUv:Bt&&x(_.transmissionMap.channel),thicknessMapUv:D&&x(_.thicknessMap.channel),alphaMapUv:et&&x(_.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(pt||P),vertexNormals:!!V.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!V.attributes.uv&&(jt||et),fog:!!L,useFog:_.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||V.attributes.normal===void 0&&pt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Tt,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Dt,morphTextureStride:It,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Xt,decodeVideoTexture:jt&&_.map.isVideoTexture===!0&&Se.getTransfer(_.map.colorSpace)===Ie,decodeVideoTextureEmissive:Yt&&_.emissiveMap.isVideoTexture===!0&&Se.getTransfer(_.emissiveMap.colorSpace)===Ie,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ln,flipSided:_.side===en,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ct&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ct&&_.extensions.multiDraw===!0||wt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return zt.vertexUv1s=l.has(1),zt.vertexUv2s=l.has(2),zt.vertexUv3s=l.has(3),l.clear(),zt}function g(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)T.push(R),T.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(m(T,_),A(T,_),T.push(i.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function m(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function A(_,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function E(_){let T=f[_.type],R;if(T){let I=ti[T];R=qh.clone(I.uniforms)}else R=_.uniforms;return R}function v(_,T){let R=h.get(T);return R!==void 0?++R.usedTimes:(R=new Ig(i,T,_,s),c.push(R),h.set(T,R)),R}function b(_){if(--_.usedTimes===0){let T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function M(_){o.remove(_)}function C(){o.dispose()}return{getParameters:S,getProgramCacheKey:g,getUniforms:E,acquireProgram:v,releaseProgram:b,releaseShaderCache:M,programs:c,dispose:C}}function Ug(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Ng(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function du(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function fu(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,x,S,g,m){let A=i[t];return A===void 0?(A={id:u.id,object:u,geometry:f,material:x,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:g,group:m},i[t]=A):(A.id=u.id,A.object=u,A.geometry=f,A.material=x,A.materialVariant=a(u),A.groupOrder=S,A.renderOrder=u.renderOrder,A.z=g,A.group=m),t++,A}function l(u,f,x,S,g,m,A){A.reversedDepth===!0&&(g=-g);let E=o(u,f,x,S,g,m);x.transmission>0?n.push(E):x.transparent===!0?s.push(E):e.push(E)}function c(u,f,x,S,g,m){let A=o(u,f,x,S,g,m);x.transmission>0?n.unshift(A):x.transparent===!0?s.unshift(A):e.unshift(A)}function h(u,f){e.length>1&&e.sort(u||Ng),n.length>1&&n.sort(f||du),s.length>1&&s.sort(f||du)}function d(){for(let u=t,f=i.length;u<f;u++){let x=i[u];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Fg(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new fu,i.set(n,[a])):s>=r.length?(a=new fu,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Og(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new z,color:new re};break;case"SpotLight":e={position:new z,direction:new z,color:new re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new re,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new re,groundColor:new re};break;case"RectAreaLight":e={color:new re,position:new z,halfWidth:new z,halfHeight:new z};break}return i[t.id]=e,e}}}function Bg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var zg=0;function Vg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Gg(i){let t=new Og,e=Bg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);let s=new z,r=new Le,a=new Le;function o(c){let h=0,d=0,u=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let f=0,x=0,S=0,g=0,m=0,A=0,E=0,v=0,b=0,M=0,C=0,_=0,T=0,R=0;c.sort(Vg);for(let O=0,G=c.length;O<G;O++){let L=c[O],V=L.color,q=L.intensity,Y=L.distance,rt=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Pi?rt=L.shadow.map.texture:rt=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=V.r*q,d+=V.g*q,u+=V.b*q;else if(L.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(L.sh.coefficients[Z],q);R++}else if(L.isSunLight){let Z=t.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,Q=e.get(L);Q.shadowIntensity=tt.intensity,Q.shadowBias=tt.bias,Q.shadowNormalBias=tt.normalBias,Q.shadowRadius=tt.radius,Q.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),n.sunShadow[x]=Q,n.sunShadowMap[x]=rt;let Dt=tt.getViewportCount();for(let It=0;It<Dt;It++)n.sunShadowMatrix[S+It]=tt.getMatrix(It),n.sunShadowCascade[S+It]=tt._cascadeData[It];S+=Dt,x++}n.sun[f]=Z,f++}else if(L.isDirectionalLight){let Z=t.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,Q=e.get(L);Q.shadowIntensity=tt.intensity,Q.shadowBias=tt.bias,Q.shadowNormalBias=tt.normalBias,Q.shadowRadius=tt.radius,Q.shadowMapSize=tt.mapSize,n.directionalShadow[g]=Q,n.directionalShadowMap[g]=rt,n.directionalShadowMatrix[g]=L.shadow.matrix,b++}n.directional[g]=Z,g++}else if(L.isSpotLight){let Z=t.get(L);Z.position.setFromMatrixPosition(L.matrixWorld),Z.color.copy(V).multiplyScalar(q),Z.distance=Y,Z.coneCos=Math.cos(L.angle),Z.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Z.decay=L.decay,n.spot[A]=Z;let tt=L.shadow;if(L.map&&(n.spotLightMap[_]=L.map,_++,tt.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[A]=tt.matrix,L.castShadow){let Q=e.get(L);Q.shadowIntensity=tt.intensity,Q.shadowBias=tt.bias,Q.shadowNormalBias=tt.normalBias,Q.shadowRadius=tt.radius,Q.shadowMapSize=tt.mapSize,n.spotShadow[A]=Q,n.spotShadowMap[A]=rt,C++}A++}else if(L.isRectAreaLight){let Z=t.get(L);Z.color.copy(V).multiplyScalar(q),Z.halfWidth.set(L.width*.5,0,0),Z.halfHeight.set(0,L.height*.5,0),n.rectArea[E]=Z,E++}else if(L.isPointLight){let Z=t.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),Z.distance=L.distance,Z.decay=L.decay,L.castShadow){let tt=L.shadow,Q=e.get(L);Q.shadowIntensity=tt.intensity,Q.shadowBias=tt.bias,Q.shadowNormalBias=tt.normalBias,Q.shadowRadius=tt.radius,Q.shadowMapSize=tt.mapSize,Q.shadowCameraNear=tt.camera.near,Q.shadowCameraFar=tt.camera.far,n.pointShadow[m]=Q,n.pointShadowMap[m]=rt,n.pointShadowMatrix[m]=L.shadow.matrix,M++}n.point[m]=Z,m++}else if(L.isHemisphereLight){let Z=t.get(L);Z.skyColor.copy(L.color).multiplyScalar(q),Z.groundColor.copy(L.groundColor).multiplyScalar(q),n.hemi[v]=Z,v++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ut.LTC_FLOAT_1,n.rectAreaLTC2=Ut.LTC_FLOAT_2):(n.rectAreaLTC1=Ut.LTC_HALF_1,n.rectAreaLTC2=Ut.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==m||I.spotLength!==A||I.rectAreaLength!==E||I.hemiLength!==v||I.numSunShadows!==x||I.numDirectionalShadows!==b||I.numPointShadows!==M||I.numSpotShadows!==C||I.numSpotMaps!==_||I.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=g,n.spot.length=A,n.rectArea.length=E,n.point.length=m,n.hemi.length=v,n.sunShadow.length=x,n.sunShadowMap.length=x,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-T,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,I.sunLength=f,I.directionalLength=g,I.pointLength=m,I.spotLength=A,I.rectAreaLength=E,I.hemiLength=v,I.numSunShadows=x,I.numDirectionalShadows=b,I.numPointShadows=M,I.numSpotShadows=C,I.numSpotMaps=_,I.numLightProbes=R,n.version=zg++)}function l(c,h){let d=0,u=0,f=0,x=0,S=0,g=0,m=h.matrixWorldInverse;for(let A=0,E=c.length;A<E;A++){let v=c[A];if(v.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(m),d++}else if(v.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(v.isSpotLight){let b=n.spot[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),x++}else if(v.isRectAreaLight){let b=n.rectArea[S];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(v.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function pu(i){let t=new Gg(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function kg(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new pu(i),t.set(s,[o])):r>=a.length?(o=new pu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var Hg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Xg=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],qg=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],mu=new Le,Pr=new z,lc=new z;function Yg(i,t,e){let n=new ms,s=new yt,r=new yt,a=new Fe,o=new Ea,l=new Ca,c={},h=e.maxTextureSize,d={[Ci]:en,[en]:Ci,[Ln]:Ln},u=new pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new yt},radius:{value:4}},vertexShader:Hg,fragmentShader:Wg}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let x=new qe;x.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new Ge(x,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ki;let m=this.type;this.render=function(M,C,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===rh&&(ee("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ki);let T=i.getRenderTarget(),R=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),O=i.state;O.setBlending(An),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let G=m!==this.type;G&&C.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(V=>V.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,V=M.length;L<V;L++){let q=M[L],Y=q.shadow;if(Y===void 0){ee("WebGLShadowMap:",q,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let rt=Y.getFrameExtents();s.multiply(rt),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/rt.x),s.x=r.x*rt.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/rt.y),s.y=r.y*rt.y,Y.mapSize.y=r.y));let Z=i.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=Z,Y.map===null||G===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Ms){if(q.isPointLight){ee("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Qe(s.x,s.y,{format:Pi,type:Cn,minFilter:Ve,magFilter:Ve,generateMipmaps:!1}),Y.map.texture.name=q.name+".shadowMap",Y.map.depthTexture=new Kn(s.x,s.y,Dn),Y.map.depthTexture.name=q.name+".shadowMapDepth",Y.map.depthTexture.format=Zn,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=We,Y.map.depthTexture.magFilter=We}else q.isPointLight?(Y.map=new Fo(s.x),Y.map.depthTexture=new ya(s.x,En)):(Y.map=new Qe(s.x,s.y),Y.map.depthTexture=new Kn(s.x,s.y,En)),Y.map.depthTexture.name=q.name+".shadowMap",Y.map.depthTexture.format=Zn,this.type===ki?(Y.map.depthTexture.compareFunction=Z?Do:Lo,Y.map.depthTexture.minFilter=Ve,Y.map.depthTexture.magFilter=Ve):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=We,Y.map.depthTexture.magFilter=We);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);let tt=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();q.isPointLight!==!0&&Y.updateMatrices(q,_);for(let Q=0;Q<tt;Q++){let Dt=Y.getCamera(Q);if(q.isPointLight){let It=Y.camera,ae=Y.matrix,ue=q.distance||It.far;ue!==It.far&&(It.far=ue,It.updateProjectionMatrix()),Pr.setFromMatrixPosition(q.matrixWorld),It.position.copy(Pr),lc.copy(It.position),lc.add(Xg[Q]),It.up.copy(qg[Q]),It.lookAt(lc),It.updateMatrixWorld(),ae.makeTranslation(-Pr.x,-Pr.y,-Pr.z),mu.multiplyMatrices(It.projectionMatrix,It.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(mu,It.coordinateSystem,It.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)i.setRenderTarget(Y.map,Q),i.clear();else{Q===0&&(i.setRenderTarget(Y.map),i.clear());let It=Y.getViewport(Q);a.set(r.x*It.x,r.y*It.y,r.x*It.z,r.y*It.w),O.viewport(a)}n=Y.getFrustum(Q),v(C,_,Dt,q,this.type)}Y.isPointLightShadow!==!0&&this.type===Ms&&A(Y,_),Y.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(T,R,I)};function A(M,C){let _=t.update(S);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new Qe(s.x,s.y,{format:Pi,type:Cn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,S,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(C,null,_,f,S,null)}function E(M,C,_,T){let R=null,I=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(I!==void 0)R=I;else if(R=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let O=R.uuid,G=C.uuid,L=c[O];L===void 0&&(L={},c[O]=L);let V=L[G];V===void 0&&(V=R.clone(),L[G]=V,C.addEventListener("dispose",b)),R=V}if(R.visible=C.visible,R.wireframe=C.wireframe,T===Ms?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:d[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let O=i.properties.get(R);O.light=_}return R}function v(M,C,_,T,R){if(M.visible===!1)return;if(M.layers.test(C.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&R===Ms)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);let G=t.update(M),L=M.material;if(Array.isArray(L)){let V=G.groups;for(let q=0,Y=V.length;q<Y;q++){let rt=V[q],Z=L[rt.materialIndex];if(Z&&Z.visible){let tt=E(M,Z,T,R);M.onBeforeShadow(i,M,C,_,G,tt,rt),i.renderBufferDirect(_,null,G,tt,M,rt),M.onAfterShadow(i,M,C,_,G,tt,rt)}}}else if(L.visible){let V=E(M,L,T,R);M.onBeforeShadow(i,M,C,_,G,V,null),i.renderBufferDirect(_,null,G,V,M,null),M.onAfterShadow(i,M,C,_,G,V,null)}}let O=M.children;for(let G=0,L=O.length;G<L;G++)v(O[G],C,_,T,R)}function b(M){M.target.removeEventListener("dispose",b);for(let _ in c){let T=c[_],R=M.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function Zg(i,t){function e(){let D=!1,gt=new Fe,et=null,xt=new Fe(0,0,0,0);return{setMask:function(bt){et!==bt&&!D&&(i.colorMask(bt,bt,bt,bt),et=bt)},setLocked:function(bt){D=bt},setClear:function(bt,ct,Xt,zt,Ae){Ae===!0&&(bt*=zt,ct*=zt,Xt*=zt),gt.set(bt,ct,Xt,zt),xt.equals(gt)===!1&&(i.clearColor(bt,ct,Xt,zt),xt.copy(gt))},reset:function(){D=!1,et=null,xt.set(-1,0,0,0)}}}function n(){let D=!1,gt=!1,et=null,xt=null,bt=null;return{setReversed:function(ct){if(gt!==ct){let Xt=t.get("EXT_clip_control");ct?Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.ZERO_TO_ONE_EXT):Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.NEGATIVE_ONE_TO_ONE_EXT),gt=ct;let zt=bt;bt=null,this.setClear(zt)}},getReversed:function(){return gt},setTest:function(ct){ct?st(i.DEPTH_TEST):Tt(i.DEPTH_TEST)},setMask:function(ct){et!==ct&&!D&&(i.depthMask(ct),et=ct)},setFunc:function(ct){if(gt&&(ct=Vh[ct]),xt!==ct){switch(ct){case aa:i.depthFunc(i.NEVER);break;case oa:i.depthFunc(i.ALWAYS);break;case la:i.depthFunc(i.LESS);break;case hs:i.depthFunc(i.LEQUAL);break;case ca:i.depthFunc(i.EQUAL);break;case ha:i.depthFunc(i.GEQUAL);break;case ua:i.depthFunc(i.GREATER);break;case da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xt=ct}},setLocked:function(ct){D=ct},setClear:function(ct){bt!==ct&&(bt=ct,gt&&(ct=1-ct),i.clearDepth(ct))},reset:function(){D=!1,et=null,xt=null,bt=null,gt=!1}}}function s(){let D=!1,gt=null,et=null,xt=null,bt=null,ct=null,Xt=null,zt=null,Ae=null;return{setTest:function(ye){D||(ye?st(i.STENCIL_TEST):Tt(i.STENCIL_TEST))},setMask:function(ye){gt!==ye&&!D&&(i.stencilMask(ye),gt=ye)},setFunc:function(ye,ze,Ue){(et!==ye||xt!==ze||bt!==Ue)&&(i.stencilFunc(ye,ze,Ue),et=ye,xt=ze,bt=Ue)},setOp:function(ye,ze,Ue){(ct!==ye||Xt!==ze||zt!==Ue)&&(i.stencilOp(ye,ze,Ue),ct=ye,Xt=ze,zt=Ue)},setLocked:function(ye){D=ye},setClear:function(ye){Ae!==ye&&(i.clearStencil(ye),Ae=ye)},reset:function(){D=!1,gt=null,et=null,xt=null,bt=null,ct=null,Xt=null,zt=null,Ae=null}}}let r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,x=[],S=null,g=!1,m=null,A=null,E=null,v=null,b=null,M=null,C=null,_=new re(0,0,0),T=0,R=!1,I=null,O=null,G=null,L=null,V=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,rt=0,Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(Z)[1]),Y=rt>=1):Z.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),Y=rt>=2);let tt=null,Q={},Dt=i.getParameter(i.SCISSOR_BOX),It=i.getParameter(i.VIEWPORT),ae=new Fe().fromArray(Dt),ue=new Fe().fromArray(It);function se(D,gt,et,xt){let bt=new Uint8Array(4),ct=i.createTexture();i.bindTexture(D,ct),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xt=0;Xt<et;Xt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(gt,0,i.RGBA,1,1,xt,0,i.RGBA,i.UNSIGNED_BYTE,bt):i.texImage2D(gt+Xt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,bt);return ct}let $={};$[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),st(i.DEPTH_TEST),a.setFunc(hs),dt(!1),pt(Tl),st(i.CULL_FACE),ot(An);function st(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function Tt(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function Jt(D,gt){return u[D]!==gt?(i.bindFramebuffer(D,gt),u[D]=gt,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=gt),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=gt),!0):!1}function wt(D,gt){let et=x,xt=!1;if(D){et=f.get(gt),et===void 0&&(et=[],f.set(gt,et));let bt=D.textures;if(et.length!==bt.length||et[0]!==i.COLOR_ATTACHMENT0){for(let ct=0,Xt=bt.length;ct<Xt;ct++)et[ct]=i.COLOR_ATTACHMENT0+ct;et.length=bt.length,xt=!0}}else et[0]!==i.BACK&&(et[0]=i.BACK,xt=!0);xt&&i.drawBuffers(et)}function jt(D){return S!==D?(i.useProgram(D),S=D,!0):!1}let te={[Hi]:i.FUNC_ADD,[oh]:i.FUNC_SUBTRACT,[lh]:i.FUNC_REVERSE_SUBTRACT};te[ch]=i.MIN,te[hh]=i.MAX;let it={[uh]:i.ZERO,[dh]:i.ONE,[fh]:i.SRC_COLOR,[El]:i.SRC_ALPHA,[vh]:i.SRC_ALPHA_SATURATE,[xh]:i.DST_COLOR,[mh]:i.DST_ALPHA,[ph]:i.ONE_MINUS_SRC_COLOR,[Cl]:i.ONE_MINUS_SRC_ALPHA,[_h]:i.ONE_MINUS_DST_COLOR,[gh]:i.ONE_MINUS_DST_ALPHA,[yh]:i.CONSTANT_COLOR,[Mh]:i.ONE_MINUS_CONSTANT_COLOR,[Sh]:i.CONSTANT_ALPHA,[bh]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(D,gt,et,xt,bt,ct,Xt,zt,Ae,ye){if(D===An){g===!0&&(Tt(i.BLEND),g=!1);return}if(g===!1&&(st(i.BLEND),g=!0),D!==ah){if(D!==m||ye!==R){if((A!==Hi||b!==Hi)&&(i.blendEquation(i.FUNC_ADD),A=Hi,b=Hi),ye)switch(D){case Ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mr:i.blendFunc(i.ONE,i.ONE);break;case Al:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ie("WebGLState: Invalid blending: ",D);break}else switch(D){case Ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Al:ie("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wl:ie("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ie("WebGLState: Invalid blending: ",D);break}E=null,v=null,M=null,C=null,_.set(0,0,0),T=0,m=D,R=ye}return}bt=bt||gt,ct=ct||et,Xt=Xt||xt,(gt!==A||bt!==b)&&(i.blendEquationSeparate(te[gt],te[bt]),A=gt,b=bt),(et!==E||xt!==v||ct!==M||Xt!==C)&&(i.blendFuncSeparate(it[et],it[xt],it[ct],it[Xt]),E=et,v=xt,M=ct,C=Xt),(zt.equals(_)===!1||Ae!==T)&&(i.blendColor(zt.r,zt.g,zt.b,Ae),_.copy(zt),T=Ae),m=D,R=!1}function ut(D,gt){D.side===Ln?Tt(i.CULL_FACE):st(i.CULL_FACE);let et=D.side===en;gt&&(et=!et),dt(et),D.blending===Ss&&D.transparent===!1?ot(An):ot(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);let xt=D.stencilWrite;o.setTest(xt),xt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Yt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?st(i.SAMPLE_ALPHA_TO_COVERAGE):Tt(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(D){I!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),I=D)}function pt(D){D!==ih?(st(i.CULL_FACE),D!==O&&(D===Tl?i.cullFace(i.BACK):D===sh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Tt(i.CULL_FACE),O=D}function Kt(D){D!==G&&(Y&&i.lineWidth(D),G=D)}function Yt(D,gt,et){D?(st(i.POLYGON_OFFSET_FILL),(L!==gt||V!==et)&&(L=gt,V=et,a.getReversed()&&(gt=-gt),i.polygonOffset(gt,et))):Tt(i.POLYGON_OFFSET_FILL)}function $t(D){D?st(i.SCISSOR_TEST):Tt(i.SCISSOR_TEST)}function Qt(D){D===void 0&&(D=i.TEXTURE0+q-1),tt!==D&&(i.activeTexture(D),tt=D)}function P(D,gt,et){et===void 0&&(tt===null?et=i.TEXTURE0+q-1:et=tt);let xt=Q[et];xt===void 0&&(xt={type:void 0,texture:void 0},Q[et]=xt),(xt.type!==D||xt.texture!==gt)&&(tt!==et&&(i.activeTexture(et),tt=et),i.bindTexture(D,gt||$[D]),xt.type=D,xt.texture=gt)}function Me(){let D=Q[tt];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ne(){try{i.compressedTexImage2D(...arguments)}catch(D){ie("WebGLState:",D)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(D){ie("WebGLState:",D)}}function p(){try{i.texSubImage2D(...arguments)}catch(D){ie("WebGLState:",D)}}function B(){try{i.texSubImage3D(...arguments)}catch(D){ie("WebGLState:",D)}}function U(){try{i.compressedTexSubImage2D(...arguments)}catch(D){ie("WebGLState:",D)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(D){ie("WebGLState:",D)}}function _t(){try{i.texStorage2D(...arguments)}catch(D){ie("WebGLState:",D)}}function Mt(){try{i.texStorage3D(...arguments)}catch(D){ie("WebGLState:",D)}}function j(){try{i.texImage2D(...arguments)}catch(D){ie("WebGLState:",D)}}function nt(){try{i.texImage3D(...arguments)}catch(D){ie("WebGLState:",D)}}function At(D){return d[D]!==void 0?d[D]:i.getParameter(D)}function Ot(D,gt){d[D]!==gt&&(i.pixelStorei(D,gt),d[D]=gt)}function Et(D){ae.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ae.copy(D))}function St(D){ue.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),ue.copy(D))}function Ht(D,gt){let et=c.get(gt);et===void 0&&(et=new WeakMap,c.set(gt,et));let xt=et.get(D);xt===void 0&&(xt=i.getUniformBlockIndex(gt,D.name),et.set(D,xt))}function Wt(D,gt){let xt=c.get(gt).get(D);l.get(gt)!==xt&&(i.uniformBlockBinding(gt,xt,D.__bindingPointIndex),l.set(gt,xt))}function Bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},tt=null,Q={},u={},f=new WeakMap,x=[],S=null,g=!1,m=null,A=null,E=null,v=null,b=null,M=null,C=null,_=new re(0,0,0),T=0,R=!1,I=null,O=null,G=null,L=null,V=null,ae.set(0,0,i.canvas.width,i.canvas.height),ue.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:st,disable:Tt,bindFramebuffer:Jt,drawBuffers:wt,useProgram:jt,setBlending:ot,setMaterial:ut,setFlipSided:dt,setCullFace:pt,setLineWidth:Kt,setPolygonOffset:Yt,setScissorTest:$t,activeTexture:Qt,bindTexture:P,unbindTexture:Me,compressedTexImage2D:ne,compressedTexImage3D:w,texImage2D:j,texImage3D:nt,pixelStorei:Ot,getParameter:At,updateUBOMapping:Ht,uniformBlockBinding:Wt,texStorage2D:_t,texStorage3D:Mt,texSubImage2D:p,texSubImage3D:B,compressedTexSubImage2D:U,compressedTexSubImage3D:K,scissor:Et,viewport:St,reset:Bt}}function Jg(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new yt,h=new WeakMap,d=new Set,u,f=new WeakMap,x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(w,p){return x?new OffscreenCanvas(w,p):Js("canvas")}function g(w,p,B){let U=1,K=ne(w);if((K.width>B||K.height>B)&&(U=B/Math.max(K.width,K.height)),U<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let _t=Math.floor(U*K.width),Mt=Math.floor(U*K.height);u===void 0&&(u=S(_t,Mt));let j=p?S(_t,Mt):u;return j.width=_t,j.height=Mt,j.getContext("2d").drawImage(w,0,0,_t,Mt),ee("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+_t+"x"+Mt+")."),j}else return"data"in w&&ee("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function m(w){return w.generateMipmaps}function A(w){i.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,p,B,U,K,_t=!1){if(w!==null){if(i[w]!==void 0)return i[w];ee("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Mt;U&&(Mt=t.get("EXT_texture_norm16"),Mt||ee("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=p;if(p===i.RED&&(B===i.FLOAT&&(j=i.R32F),B===i.HALF_FLOAT&&(j=i.R16F),B===i.UNSIGNED_BYTE&&(j=i.R8),B===i.UNSIGNED_SHORT&&Mt&&(j=Mt.R16_EXT),B===i.SHORT&&Mt&&(j=Mt.R16_SNORM_EXT)),p===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.R8UI),B===i.UNSIGNED_SHORT&&(j=i.R16UI),B===i.UNSIGNED_INT&&(j=i.R32UI),B===i.BYTE&&(j=i.R8I),B===i.SHORT&&(j=i.R16I),B===i.INT&&(j=i.R32I)),p===i.RG&&(B===i.FLOAT&&(j=i.RG32F),B===i.HALF_FLOAT&&(j=i.RG16F),B===i.UNSIGNED_BYTE&&(j=i.RG8),B===i.UNSIGNED_SHORT&&Mt&&(j=Mt.RG16_EXT),B===i.SHORT&&Mt&&(j=Mt.RG16_SNORM_EXT)),p===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RG8UI),B===i.UNSIGNED_SHORT&&(j=i.RG16UI),B===i.UNSIGNED_INT&&(j=i.RG32UI),B===i.BYTE&&(j=i.RG8I),B===i.SHORT&&(j=i.RG16I),B===i.INT&&(j=i.RG32I)),p===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RGB8UI),B===i.UNSIGNED_SHORT&&(j=i.RGB16UI),B===i.UNSIGNED_INT&&(j=i.RGB32UI),B===i.BYTE&&(j=i.RGB8I),B===i.SHORT&&(j=i.RGB16I),B===i.INT&&(j=i.RGB32I)),p===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),B===i.UNSIGNED_INT&&(j=i.RGBA32UI),B===i.BYTE&&(j=i.RGBA8I),B===i.SHORT&&(j=i.RGBA16I),B===i.INT&&(j=i.RGBA32I)),p===i.RGB&&(B===i.UNSIGNED_SHORT&&Mt&&(j=Mt.RGB16_EXT),B===i.SHORT&&Mt&&(j=Mt.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),p===i.RGBA){let nt=_t?Zs:Se.getTransfer(K);B===i.FLOAT&&(j=i.RGBA32F),B===i.HALF_FLOAT&&(j=i.RGBA16F),B===i.UNSIGNED_BYTE&&(j=nt===Ie?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&Mt&&(j=Mt.RGBA16_EXT),B===i.SHORT&&Mt&&(j=Mt.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function b(w,p){let B;return w?p===null||p===En||p===Ts?B=i.DEPTH24_STENCIL8:p===Dn?B=i.DEPTH32F_STENCIL8:p===bs&&(B=i.DEPTH24_STENCIL8,ee("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):p===null||p===En||p===Ts?B=i.DEPTH_COMPONENT24:p===Dn?B=i.DEPTH_COMPONENT32F:p===bs&&(B=i.DEPTH_COMPONENT16),B}function M(w,p){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==We&&w.minFilter!==Ve?Math.log2(Math.max(p.width,p.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?p.mipmaps.length:1}function C(w){let p=w.target;p.removeEventListener("dispose",C),T(p),p.isVideoTexture&&h.delete(p),p.isHTMLTexture&&d.delete(p)}function _(w){let p=w.target;p.removeEventListener("dispose",_),I(p)}function T(w){let p=n.get(w);if(p.__webglInit===void 0)return;let B=w.source,U=f.get(B);if(U){let K=U[p.__cacheKey];K.usedTimes--,K.usedTimes===0&&R(w),Object.keys(U).length===0&&f.delete(B)}n.remove(w)}function R(w){let p=n.get(w);i.deleteTexture(p.__webglTexture);let B=w.source,U=f.get(B);delete U[p.__cacheKey],a.memory.textures--}function I(w){let p=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let U=0;U<6;U++){if(Array.isArray(p.__webglFramebuffer[U]))for(let K=0;K<p.__webglFramebuffer[U].length;K++)i.deleteFramebuffer(p.__webglFramebuffer[U][K]);else i.deleteFramebuffer(p.__webglFramebuffer[U]);p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer[U])}else{if(Array.isArray(p.__webglFramebuffer))for(let U=0;U<p.__webglFramebuffer.length;U++)i.deleteFramebuffer(p.__webglFramebuffer[U]);else i.deleteFramebuffer(p.__webglFramebuffer);if(p.__webglDepthbuffer&&i.deleteRenderbuffer(p.__webglDepthbuffer),p.__webglMultisampledFramebuffer&&i.deleteFramebuffer(p.__webglMultisampledFramebuffer),p.__webglColorRenderbuffer)for(let U=0;U<p.__webglColorRenderbuffer.length;U++)p.__webglColorRenderbuffer[U]&&i.deleteRenderbuffer(p.__webglColorRenderbuffer[U]);p.__webglDepthRenderbuffer&&i.deleteRenderbuffer(p.__webglDepthRenderbuffer)}let B=w.textures;for(let U=0,K=B.length;U<K;U++){let _t=n.get(B[U]);_t.__webglTexture&&(i.deleteTexture(_t.__webglTexture),a.memory.textures--),n.remove(B[U])}n.remove(w)}let O=0;function G(){O=0}function L(){return O}function V(w){O=w}function q(){let w=O;return w>=s.maxTextures&&ee("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),O+=1,w}function Y(w){let p=[];return p.push(w.wrapS),p.push(w.wrapT),p.push(w.wrapR||0),p.push(w.magFilter),p.push(w.minFilter),p.push(w.anisotropy),p.push(w.internalFormat),p.push(w.format),p.push(w.type),p.push(w.generateMipmaps),p.push(w.premultiplyAlpha),p.push(w.flipY),p.push(w.unpackAlignment),p.push(w.colorSpace),p.join()}function rt(w,p){let B=n.get(w);if(w.isVideoTexture&&P(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){let U=w.image;if(U===null)ee("WebGLRenderer: Texture marked for update but no image data found.");else if(U.complete===!1)ee("WebGLRenderer: Texture marked for update but image is incomplete");else{Tt(B,w,p);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+p)}function Z(w,p){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Tt(B,w,p);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+p)}function tt(w,p){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Tt(B,w,p);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+p)}function Q(w,p){let B=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){Jt(B,w,p);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+p)}let Dt={[Vi]:i.REPEAT,[Yn]:i.CLAMP_TO_EDGE,[fa]:i.MIRRORED_REPEAT},It={[We]:i.NEAREST,[wh]:i.NEAREST_MIPMAP_NEAREST,[br]:i.NEAREST_MIPMAP_LINEAR,[Ve]:i.LINEAR,[qa]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},ae={[Ih]:i.NEVER,[Nh]:i.ALWAYS,[Ph]:i.LESS,[Lo]:i.LEQUAL,[Lh]:i.EQUAL,[Do]:i.GEQUAL,[Dh]:i.GREATER,[Uh]:i.NOTEQUAL};function ue(w,p){if(p.type===Dn&&t.has("OES_texture_float_linear")===!1&&(p.magFilter===Ve||p.magFilter===qa||p.magFilter===br||p.magFilter===jn||p.minFilter===Ve||p.minFilter===qa||p.minFilter===br||p.minFilter===jn)&&ee("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Dt[p.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Dt[p.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Dt[p.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,It[p.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,It[p.minFilter]),p.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,ae[p.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(p.magFilter===We||p.minFilter!==br&&p.minFilter!==jn||p.type===Dn&&t.has("OES_texture_float_linear")===!1)return;if(p.anisotropy>1||n.get(p).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(p.anisotropy,s.getMaxAnisotropy())),n.get(p).__currentAnisotropy=p.anisotropy}}}function se(w,p){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,p.addEventListener("dispose",C));let U=p.source,K=f.get(U);K===void 0&&(K={},f.set(U,K));let _t=Y(p);if(_t!==w.__cacheKey){K[_t]===void 0&&(K[_t]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),K[_t].usedTimes++;let Mt=K[w.__cacheKey];Mt!==void 0&&(K[w.__cacheKey].usedTimes--,Mt.usedTimes===0&&R(p)),w.__cacheKey=_t,w.__webglTexture=K[_t].texture}return B}function $(w,p,B){return Math.floor(Math.floor(w/B)/p)}function st(w,p,B,U){let _t=w.updateRanges;if(_t.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,p.width,p.height,B,U,p.data);else{_t.sort((Ot,Et)=>Ot.start-Et.start);let Mt=0;for(let Ot=1;Ot<_t.length;Ot++){let Et=_t[Mt],St=_t[Ot],Ht=Et.start+Et.count,Wt=$(St.start,p.width,4),Bt=$(Et.start,p.width,4);St.start<=Ht+1&&Wt===Bt&&$(St.start+St.count-1,p.width,4)===Wt?Et.count=Math.max(Et.count,St.start+St.count-Et.start):(++Mt,_t[Mt]=St)}_t.length=Mt+1;let j=e.getParameter(i.UNPACK_ROW_LENGTH),nt=e.getParameter(i.UNPACK_SKIP_PIXELS),At=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,p.width);for(let Ot=0,Et=_t.length;Ot<Et;Ot++){let St=_t[Ot],Ht=Math.floor(St.start/4),Wt=Math.ceil(St.count/4),Bt=Ht%p.width,D=Math.floor(Ht/p.width),gt=Wt,et=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Bt),e.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,Bt,D,gt,et,B,U,p.data)}w.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,j),e.pixelStorei(i.UNPACK_SKIP_PIXELS,nt),e.pixelStorei(i.UNPACK_SKIP_ROWS,At)}}function Tt(w,p,B){let U=i.TEXTURE_2D;(p.isDataArrayTexture||p.isCompressedArrayTexture)&&(U=i.TEXTURE_2D_ARRAY),p.isData3DTexture&&(U=i.TEXTURE_3D);let K=se(w,p),_t=p.source;e.bindTexture(U,w.__webglTexture,i.TEXTURE0+B);let Mt=n.get(_t);if(_t.version!==Mt.__version||K===!0){if(e.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&p.image instanceof ImageBitmap)===!1){let et=Se.getPrimaries(Se.workingColorSpace),xt=p.colorSpace===Un?null:Se.getPrimaries(p.colorSpace),bt=p.colorSpace===Un||et===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt)}e.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment);let nt=g(p.image,!1,s.maxTextureSize);nt=Me(p,nt);let At=r.convert(p.format,p.colorSpace),Ot=r.convert(p.type),Et=v(p.internalFormat,At,Ot,p.normalized,p.colorSpace,p.isVideoTexture);ue(U,p);let St,Ht=p.mipmaps,Wt=p.isVideoTexture!==!0,Bt=Mt.__version===void 0||K===!0,D=_t.dataReady,gt=M(p,nt);if(p.isDepthTexture)Et=b(p.format===Ii,p.type),Bt&&(Wt?e.texStorage2D(i.TEXTURE_2D,1,Et,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,Et,nt.width,nt.height,0,At,Ot,null));else if(p.isDataTexture)if(Ht.length>0){Wt&&Bt&&e.texStorage2D(i.TEXTURE_2D,gt,Et,Ht[0].width,Ht[0].height);for(let et=0,xt=Ht.length;et<xt;et++)St=Ht[et],Wt?D&&e.texSubImage2D(i.TEXTURE_2D,et,0,0,St.width,St.height,At,Ot,St.data):e.texImage2D(i.TEXTURE_2D,et,Et,St.width,St.height,0,At,Ot,St.data);p.generateMipmaps=!1}else Wt?(Bt&&e.texStorage2D(i.TEXTURE_2D,gt,Et,nt.width,nt.height),D&&st(p,nt,At,Ot)):e.texImage2D(i.TEXTURE_2D,0,Et,nt.width,nt.height,0,At,Ot,nt.data);else if(p.isCompressedTexture)if(p.isCompressedArrayTexture){Wt&&Bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,gt,Et,Ht[0].width,Ht[0].height,nt.depth);for(let et=0,xt=Ht.length;et<xt;et++)if(St=Ht[et],p.format!==mn)if(At!==null)if(Wt){if(D)if(p.layerUpdates.size>0){let bt=Kl(St.width,St.height,p.format,p.type);for(let ct of p.layerUpdates){let Xt=St.data.subarray(ct*bt/St.data.BYTES_PER_ELEMENT,(ct+1)*bt/St.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,et,0,0,ct,St.width,St.height,1,At,Xt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,et,0,0,0,St.width,St.height,nt.depth,At,St.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,et,Et,St.width,St.height,nt.depth,0,St.data,0,0);else ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Wt?D&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,et,0,0,0,St.width,St.height,nt.depth,At,Ot,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,et,Et,St.width,St.height,nt.depth,0,At,Ot,St.data);p.layerUpdates.size>0&&p.clearLayerUpdates()}else{Wt&&Bt&&e.texStorage2D(i.TEXTURE_2D,gt,Et,Ht[0].width,Ht[0].height);for(let et=0,xt=Ht.length;et<xt;et++)St=Ht[et],p.format!==mn?At!==null?Wt?D&&e.compressedTexSubImage2D(i.TEXTURE_2D,et,0,0,St.width,St.height,At,St.data):e.compressedTexImage2D(i.TEXTURE_2D,et,Et,St.width,St.height,0,St.data):ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Wt?D&&e.texSubImage2D(i.TEXTURE_2D,et,0,0,St.width,St.height,At,Ot,St.data):e.texImage2D(i.TEXTURE_2D,et,Et,St.width,St.height,0,At,Ot,St.data)}else if(p.isDataArrayTexture)if(Wt){if(Bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,gt,Et,nt.width,nt.height,nt.depth),D)if(p.layerUpdates.size>0){let et=Kl(nt.width,nt.height,p.format,p.type);for(let xt of p.layerUpdates){let bt=nt.data.subarray(xt*et/nt.data.BYTES_PER_ELEMENT,(xt+1)*et/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xt,nt.width,nt.height,1,At,Ot,bt)}p.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,At,Ot,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,nt.width,nt.height,nt.depth,0,At,Ot,nt.data);else if(p.isData3DTexture)Wt?(Bt&&e.texStorage3D(i.TEXTURE_3D,gt,Et,nt.width,nt.height,nt.depth),D&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,At,Ot,nt.data)):e.texImage3D(i.TEXTURE_3D,0,Et,nt.width,nt.height,nt.depth,0,At,Ot,nt.data);else if(p.isFramebufferTexture){if(Bt)if(Wt)e.texStorage2D(i.TEXTURE_2D,gt,Et,nt.width,nt.height);else{let et=nt.width,xt=nt.height;for(let bt=0;bt<gt;bt++)e.texImage2D(i.TEXTURE_2D,bt,Et,et,xt,0,At,Ot,null),et>>=1,xt>>=1}}else if(p.isHTMLTexture){if("texElementImage2D"in i){let et=i.canvas;if(et.hasAttribute("layoutsubtree")||et.setAttribute("layoutsubtree","true"),nt.parentNode!==et){et.appendChild(nt),d.add(p),et.onpaint=xt=>{let bt=xt.changedElements;for(let ct of d)bt.includes(ct.image)&&(ct.needsUpdate=!0)},et.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,nt);else{let bt=i.RGBA,ct=i.RGBA,Xt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,bt,ct,Xt,nt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ht.length>0){if(Wt&&Bt){let et=ne(Ht[0]);e.texStorage2D(i.TEXTURE_2D,gt,Et,et.width,et.height)}for(let et=0,xt=Ht.length;et<xt;et++)St=Ht[et],Wt?D&&e.texSubImage2D(i.TEXTURE_2D,et,0,0,At,Ot,St):e.texImage2D(i.TEXTURE_2D,et,Et,At,Ot,St);p.generateMipmaps=!1}else if(Wt){if(Bt){let et=ne(nt);e.texStorage2D(i.TEXTURE_2D,gt,Et,et.width,et.height)}D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Ot,nt)}else e.texImage2D(i.TEXTURE_2D,0,Et,At,Ot,nt);m(p)&&A(U),Mt.__version=_t.version,p.onUpdate&&p.onUpdate(p)}w.__version=p.version}function Jt(w,p,B){if(p.image.length!==6)return;let U=se(w,p),K=p.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+B);let _t=n.get(K);if(K.version!==_t.__version||U===!0){e.activeTexture(i.TEXTURE0+B);let Mt=Se.getPrimaries(Se.workingColorSpace),j=p.colorSpace===Un?null:Se.getPrimaries(p.colorSpace),nt=p.colorSpace===Un||Mt===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,p.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,p.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,p.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let At=p.isCompressedTexture||p.image[0].isCompressedTexture,Ot=p.image[0]&&p.image[0].isDataTexture,Et=[];for(let ct=0;ct<6;ct++)!At&&!Ot?Et[ct]=g(p.image[ct],!0,s.maxCubemapSize):Et[ct]=Ot?p.image[ct].image:p.image[ct],Et[ct]=Me(p,Et[ct]);let St=Et[0],Ht=r.convert(p.format,p.colorSpace),Wt=r.convert(p.type),Bt=v(p.internalFormat,Ht,Wt,p.normalized,p.colorSpace),D=p.isVideoTexture!==!0,gt=_t.__version===void 0||U===!0,et=K.dataReady,xt=M(p,St);ue(i.TEXTURE_CUBE_MAP,p);let bt;if(At){D&&gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Bt,St.width,St.height);for(let ct=0;ct<6;ct++){bt=Et[ct].mipmaps;for(let Xt=0;Xt<bt.length;Xt++){let zt=bt[Xt];p.format!==mn?Ht!==null?D?et&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt,0,0,zt.width,zt.height,Ht,zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt,Bt,zt.width,zt.height,0,zt.data):ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?et&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt,0,0,zt.width,zt.height,Ht,Wt,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt,Bt,zt.width,zt.height,0,Ht,Wt,zt.data)}}}else{if(bt=p.mipmaps,D&&gt){bt.length>0&&xt++;let ct=ne(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Bt,ct.width,ct.height)}for(let ct=0;ct<6;ct++)if(Ot){D?et&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,Et[ct].width,Et[ct].height,Ht,Wt,Et[ct].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Bt,Et[ct].width,Et[ct].height,0,Ht,Wt,Et[ct].data);for(let Xt=0;Xt<bt.length;Xt++){let Ae=bt[Xt].image[ct].image;D?et&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt+1,0,0,Ae.width,Ae.height,Ht,Wt,Ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt+1,Bt,Ae.width,Ae.height,0,Ht,Wt,Ae.data)}}else{D?et&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,Ht,Wt,Et[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Bt,Ht,Wt,Et[ct]);for(let Xt=0;Xt<bt.length;Xt++){let zt=bt[Xt];D?et&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt+1,0,0,Ht,Wt,zt.image[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Xt+1,Bt,Ht,Wt,zt.image[ct])}}}m(p)&&A(i.TEXTURE_CUBE_MAP),_t.__version=K.version,p.onUpdate&&p.onUpdate(p)}w.__version=p.version}function wt(w,p,B,U,K,_t){let Mt=r.convert(B.format,B.colorSpace),j=r.convert(B.type),nt=v(B.internalFormat,Mt,j,B.normalized,B.colorSpace),At=n.get(p),Ot=n.get(B);if(Ot.__renderTarget=p,!At.__hasExternalTextures){let Et=Math.max(1,p.width>>_t),St=Math.max(1,p.height>>_t);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,_t,nt,Et,St,p.depth,0,Mt,j,null):e.texImage2D(K,_t,nt,Et,St,0,Mt,j,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Qt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,U,K,Ot.__webglTexture,0,$t(p)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,U,K,Ot.__webglTexture,_t),e.bindFramebuffer(i.FRAMEBUFFER,null)}function jt(w,p,B){if(i.bindRenderbuffer(i.RENDERBUFFER,w),p.depthBuffer){let U=p.depthTexture,K=U&&U.isDepthTexture?U.type:null,_t=b(p.stencilBuffer,K),Mt=p.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Qt(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$t(p),_t,p.width,p.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,$t(p),_t,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,_t,p.width,p.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Mt,i.RENDERBUFFER,w)}else{let U=p.textures;for(let K=0;K<U.length;K++){let _t=U[K],Mt=r.convert(_t.format,_t.colorSpace),j=r.convert(_t.type),nt=v(_t.internalFormat,Mt,j,_t.normalized,_t.colorSpace);Qt(p)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$t(p),nt,p.width,p.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,$t(p),nt,p.width,p.height):i.renderbufferStorage(i.RENDERBUFFER,nt,p.width,p.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function te(w,p,B){let U=p.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(p.depthTexture&&p.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=n.get(p.depthTexture);if(K.__renderTarget=p,(!K.__webglTexture||p.depthTexture.image.width!==p.width||p.depthTexture.image.height!==p.height)&&(p.depthTexture.image.width=p.width,p.depthTexture.image.height=p.height,p.depthTexture.needsUpdate=!0),U){if(K.__webglInit===void 0&&(K.__webglInit=!0,p.depthTexture.addEventListener("dispose",C)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),ue(i.TEXTURE_CUBE_MAP,p.depthTexture);let At=r.convert(p.depthTexture.format),Ot=r.convert(p.depthTexture.type),Et;p.depthTexture.format===Zn?Et=i.DEPTH_COMPONENT24:p.depthTexture.format===Ii&&(Et=i.DEPTH24_STENCIL8);for(let St=0;St<6;St++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,Et,p.width,p.height,0,At,Ot,null)}}else rt(p.depthTexture,0);let _t=K.__webglTexture,Mt=$t(p),j=U?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,nt=p.depthTexture.format===Ii?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(p.depthTexture.format===Zn)Qt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,j,_t,0,Mt):i.framebufferTexture2D(i.FRAMEBUFFER,nt,j,_t,0);else if(p.depthTexture.format===Ii)Qt(p)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,j,_t,0,Mt):i.framebufferTexture2D(i.FRAMEBUFFER,nt,j,_t,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(w){let p=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(p.__boundDepthTexture!==w.depthTexture){let U=w.depthTexture;if(p.__depthDisposeCallback&&p.__depthDisposeCallback(),U){let K=()=>{delete p.__boundDepthTexture,delete p.__depthDisposeCallback,U.removeEventListener("dispose",K)};U.addEventListener("dispose",K),p.__depthDisposeCallback=K}p.__boundDepthTexture=U}if(w.depthTexture&&!p.__autoAllocateDepthBuffer)if(B)for(let U=0;U<6;U++)te(p.__webglFramebuffer[U],w,U);else{let U=w.texture.mipmaps;U&&U.length>0?te(p.__webglFramebuffer[0],w,0):te(p.__webglFramebuffer,w,0)}else if(B){p.__webglDepthbuffer=[];for(let U=0;U<6;U++)if(e.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[U]),p.__webglDepthbuffer[U]===void 0)p.__webglDepthbuffer[U]=i.createRenderbuffer(),jt(p.__webglDepthbuffer[U],w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=p.__webglDepthbuffer[U];i.bindRenderbuffer(i.RENDERBUFFER,_t),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,_t)}}else{let U=w.texture.mipmaps;if(U&&U.length>0?e.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,p.__webglFramebuffer),p.__webglDepthbuffer===void 0)p.__webglDepthbuffer=i.createRenderbuffer(),jt(p.__webglDepthbuffer,w,!1);else{let K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=p.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,_t),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,_t)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(w,p,B){let U=n.get(w);p!==void 0&&wt(U.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&it(w)}function ut(w){let p=w.texture,B=n.get(w),U=n.get(p);w.addEventListener("dispose",_);let K=w.textures,_t=w.isWebGLCubeRenderTarget===!0,Mt=K.length>1;if(Mt||(U.__webglTexture===void 0&&(U.__webglTexture=i.createTexture()),U.__version=p.version,a.memory.textures++),_t){B.__webglFramebuffer=[];for(let j=0;j<6;j++)if(p.mipmaps&&p.mipmaps.length>0){B.__webglFramebuffer[j]=[];for(let nt=0;nt<p.mipmaps.length;nt++)B.__webglFramebuffer[j][nt]=i.createFramebuffer()}else B.__webglFramebuffer[j]=i.createFramebuffer()}else{if(p.mipmaps&&p.mipmaps.length>0){B.__webglFramebuffer=[];for(let j=0;j<p.mipmaps.length;j++)B.__webglFramebuffer[j]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Mt)for(let j=0,nt=K.length;j<nt;j++){let At=n.get(K[j]);At.__webglTexture===void 0&&(At.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Qt(w)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let j=0;j<K.length;j++){let nt=K[j];B.__webglColorRenderbuffer[j]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[j]);let At=r.convert(nt.format,nt.colorSpace),Ot=r.convert(nt.type),Et=v(nt.internalFormat,At,Ot,nt.normalized,nt.colorSpace,w.isXRRenderTarget===!0),St=$t(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,St,Et,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,B.__webglColorRenderbuffer[j])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),jt(B.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(_t){e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture),ue(i.TEXTURE_CUBE_MAP,p);for(let j=0;j<6;j++)if(p.mipmaps&&p.mipmaps.length>0)for(let nt=0;nt<p.mipmaps.length;nt++)wt(B.__webglFramebuffer[j][nt],w,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt);else wt(B.__webglFramebuffer[j],w,p,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);m(p)&&A(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let j=0,nt=K.length;j<nt;j++){let At=K[j],Ot=n.get(At),Et=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Et=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Et,Ot.__webglTexture),ue(Et,At),wt(B.__webglFramebuffer,w,At,i.COLOR_ATTACHMENT0+j,Et,0),m(At)&&A(Et)}e.unbindTexture()}else{let j=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(j=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(j,U.__webglTexture),ue(j,p),p.mipmaps&&p.mipmaps.length>0)for(let nt=0;nt<p.mipmaps.length;nt++)wt(B.__webglFramebuffer[nt],w,p,i.COLOR_ATTACHMENT0,j,nt);else wt(B.__webglFramebuffer,w,p,i.COLOR_ATTACHMENT0,j,0);m(p)&&A(j),e.unbindTexture()}w.depthBuffer&&it(w)}function dt(w){let p=w.textures;for(let B=0,U=p.length;B<U;B++){let K=p[B];if(m(K)){let _t=E(w),Mt=n.get(K).__webglTexture;e.bindTexture(_t,Mt),A(_t),e.unbindTexture()}}}let pt=[],Kt=[];function Yt(w){if(w.samples>0){if(Qt(w)===!1){let p=w.textures,B=w.width,U=w.height,K=i.COLOR_BUFFER_BIT,_t=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=n.get(w),j=p.length>1;if(j)for(let At=0;At<p.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer);let nt=w.texture.mipmaps;nt&&nt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let At=0;At<p.length;At++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),j){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[At]);let Ot=n.get(p[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ot,0)}i.blitFramebuffer(0,0,B,U,0,0,B,U,K,i.NEAREST),l===!0&&(pt.length=0,Kt.length=0,pt.push(i.COLOR_ATTACHMENT0+At),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(pt.push(_t),Kt.push(_t),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Kt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),j)for(let At=0;At<p.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[At]);let Ot=n.get(p[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,Ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let p=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[p])}}}function $t(w){return Math.min(s.maxSamples,w.samples)}function Qt(w){let p=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&p.__useRenderToTexture!==!1}function P(w){let p=a.render.frame;h.get(w)!==p&&(h.set(w,p),w.update())}function Me(w,p){let B=w.colorSpace,U=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==Ys&&B!==Un&&(Se.getTransfer(B)===Ie?(U!==mn||K!==cn)&&ee("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ie("WebGLTextures: Unsupported texture color space:",B)),p}function ne(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=G,this.getTextureUnits=L,this.setTextureUnits=V,this.setTexture2D=rt,this.setTexture2DArray=Z,this.setTexture3D=tt,this.setTextureCube=Q,this.rebindTextures=ot,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=Qt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function $g(i,t){function e(n,s=Un){let r,a=Se.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Za)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ja)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Gl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bl)return i.BYTE;if(n===zl)return i.SHORT;if(n===bs)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===En)return i.UNSIGNED_INT;if(n===Dn)return i.FLOAT;if(n===Cn)return i.HALF_FLOAT;if(n===kl)return i.ALPHA;if(n===Hl)return i.RGB;if(n===mn)return i.RGBA;if(n===Zn)return i.DEPTH_COMPONENT;if(n===Ii)return i.DEPTH_STENCIL;if(n===$a)return i.RED;if(n===Ka)return i.RED_INTEGER;if(n===Pi)return i.RG;if(n===ja)return i.RG_INTEGER;if(n===Qa)return i.RGBA_INTEGER;if(n===Tr||n===Ar||n===wr||n===Er)if(a===Ie)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===to||n===eo||n===no||n===io)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===to)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===io)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===so||n===ro||n===ao||n===oo||n===lo||n===Cr||n===co)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===so||n===ro)return a===Ie?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ao)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===oo)return r.COMPRESSED_R11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Cr)return r.COMPRESSED_RG11_EAC;if(n===co)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===xo||n===_o||n===vo||n===yo||n===Mo||n===So||n===bo||n===To)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ho)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===uo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===po)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===mo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===go)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_o)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===yo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Mo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===So)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bo)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===To)return a===Ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ao||n===wo||n===Eo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ao)return a===Ie?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===wo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Eo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Co||n===Ro||n===Rr||n===Io)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Io)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ts?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Kg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,gc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new sr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new pn({vertexShader:Kg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ge(new hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},xc=class extends Jn{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,x=null,S=typeof XRWebGLBinding<"u",g=new gc,m={},A=e.getContextAttributes(),E=null,v=null,b=[],M=[],C=new yt,_=null,T=null,R=new on;R.viewport=new Fe;let I=new on;I.viewport=new Fe;let O=[R,I],G=new ka,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let st=b[$];return st===void 0&&(st=new ps,b[$]=st),st.getTargetRaySpace()},this.getControllerGrip=function($){let st=b[$];return st===void 0&&(st=new ps,b[$]=st),st.getGripSpace()},this.getHand=function($){let st=b[$];return st===void 0&&(st=new ps,b[$]=st),st.getHandSpace()};function q($){let st=M.indexOf($.inputSource);if(st===-1)return;let Tt=b[st];Tt!==void 0&&(Tt.update($.inputSource,$.frame,c||a),Tt.dispatchEvent({type:$.type,data:$.inputSource}))}function Y(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",rt);for(let $=0;$<b.length;$++){let st=M[$];st!==null&&(M[$]=null,b[$].disconnect(st))}L=null,V=null,g.reset();for(let $ in m)delete m[$];if(t.setRenderTarget(E),f=null,u=null,d=null,s=null,v=null,se.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),T!==null){let $=T.camera;$.fov=T.fov,$.zoom=T.zoom,$.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&ee("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&ee("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",rt),A.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let Tt=null,Jt=null,wt=null;A.depth&&(wt=A.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Tt=A.stencil?Ii:Zn,Jt=A.stencil?Ts:En);let jt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(jt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new Qe(u.textureWidth,u.textureHeight,{format:mn,type:cn,depthTexture:new Kn(u.textureWidth,u.textureHeight,Jt,void 0,void 0,void 0,void 0,void 0,void 0,Tt),stencilBuffer:A.stencil,colorSpace:t.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let Tt={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Tt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Qe(f.framebufferWidth,f.framebufferHeight,{format:mn,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function rt($){for(let st=0;st<$.removed.length;st++){let Tt=$.removed[st],Jt=M.indexOf(Tt);Jt>=0&&(M[Jt]=null,b[Jt].disconnect(Tt))}for(let st=0;st<$.added.length;st++){let Tt=$.added[st],Jt=M.indexOf(Tt);if(Jt===-1){for(let jt=0;jt<b.length;jt++)if(jt>=M.length){M.push(Tt),Jt=jt;break}else if(M[jt]===null){M[jt]=Tt,Jt=jt;break}if(Jt===-1)break}let wt=b[Jt];wt&&wt.connect(Tt)}}let Z=new z,tt=new z;function Q($,st,Tt){Z.setFromMatrixPosition(st.matrixWorld),tt.setFromMatrixPosition(Tt.matrixWorld);let Jt=Z.distanceTo(tt),wt=st.projectionMatrix.elements,jt=Tt.projectionMatrix.elements,te=wt[14]/(wt[10]-1),it=wt[14]/(wt[10]+1),ot=(wt[9]+1)/wt[5],ut=(wt[9]-1)/wt[5],dt=(wt[8]-1)/wt[0],pt=(jt[8]+1)/jt[0],Kt=te*dt,Yt=te*pt,$t=Jt/(-dt+pt),Qt=$t*-dt;if(st.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Qt),$.translateZ($t),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),wt[10]===-1)$.projectionMatrix.copy(st.projectionMatrix),$.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{let P=te+$t,Me=it+$t,ne=Kt-Qt,w=Yt+(Jt-Qt),p=ot*it/Me*P,B=ut*it/Me*P;$.projectionMatrix.makePerspective(ne,w,p,B,P,Me),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Dt($,st){st===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(st.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let st=$.near,Tt=$.far;g.texture!==null&&(g.depthNear>0&&(st=g.depthNear),g.depthFar>0&&(Tt=g.depthFar)),G.near=I.near=R.near=st,G.far=I.far=R.far=Tt,(L!==G.near||V!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),L=G.near,V=G.far),G.layers.mask=$.layers.mask|6,R.layers.mask=G.layers.mask&-5,I.layers.mask=G.layers.mask&-3;let Jt=$.parent,wt=G.cameras;Dt(G,Jt);for(let jt=0;jt<wt.length;jt++)Dt(wt[jt],Jt);wt.length===2?Q(G,R,I):G.projectionMatrix.copy(R.projectionMatrix),T===null&&$.isPerspectiveCamera&&(T={camera:$,fov:$.fov,zoom:$.zoom}),It($,G,Jt)};function It($,st,Tt){Tt===null?$.matrix.copy(st.matrixWorld):($.matrix.copy(Tt.matrixWorld),$.matrix.invert(),$.matrix.multiply(st.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(st.projectionMatrix),$.projectionMatrixInverse.copy(st.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ma*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function($){l=$,u!==null&&(u.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(G)},this.getCameraTexture=function($){return m[$]};let ae=null;function ue($,st){if(h=st.getViewerPose(c||a),x=st,h!==null){let Tt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Jt=!1;Tt.length!==G.cameras.length&&(G.cameras.length=0,Jt=!0);for(let it=0;it<Tt.length;it++){let ot=Tt[it],ut=null;if(f!==null)ut=f.getViewport(ot);else{let pt=d.getViewSubImage(u,ot);ut=pt.viewport,it===0&&(t.setRenderTargetTextures(v,pt.colorTexture,pt.depthStencilTexture),t.setRenderTarget(v))}let dt=O[it];dt===void 0&&(dt=new on,dt.layers.enable(it),dt.viewport=new Fe,O[it]=dt),dt.matrix.fromArray(ot.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(ot.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set(ut.x,ut.y,ut.width,ut.height),it===0&&(G.matrix.copy(dt.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Jt===!0&&G.cameras.push(dt)}let wt=s.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){d=n.getBinding();let it=d.getDepthInformation(Tt[0]);it&&it.isValid&&it.texture&&g.init(it,s.renderState)}if(wt&&wt.includes("camera-access")&&S){t.state.unbindTexture(),d=n.getBinding();for(let it=0;it<Tt.length;it++){let ot=Tt[it].camera;if(ot){let ut=m[ot];ut||(ut=new sr,m[ot]=ut);let dt=d.getCameraImage(ot);ut.sourceTexture=dt}}}}for(let Tt=0;Tt<b.length;Tt++){let Jt=M[Tt],wt=b[Tt];Jt!==null&&wt!==void 0&&wt.update(Jt,st,c||a)}ae&&ae($,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),x=null}let se=new gu;se.setAnimationLoop(ue),this.setAnimationLoop=function($){ae=$},this.dispose=function(){}}},Qg=new Le,Su=new le;Su.set(-1,0,0,0,1,0,0,0,1);function tx(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Zl(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,A,E,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&f(g,m,v)):m.isMeshMatcapMaterial?(r(g,m),x(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),S(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,A,E):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===en&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===en&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let A=t.get(m),E=A.envMap,v=A.envMapRotation;E&&(g.envMap.value=E,g.envMapRotation.value.setFromMatrix4(Qg.makeRotationFromEuler(v)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Su),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,A,E){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*A,g.scale.value=E*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,A){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===en&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=A.texture,g.transmissionSamplerSize.value.set(A.width,A.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,m){m.matcap&&(g.matcap.value=m.matcap)}function S(g,m){let A=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(A.matrixWorld),g.nearDistance.value=A.shadow.camera.near,g.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ex(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,b){let M=b.program;n.uniformBlockBinding(v,M)}function c(v,b){let M=s[v.id];M===void 0&&(g(v),M=h(v),s[v.id]=M,v.addEventListener("dispose",A));let C=b.program;n.updateUBOMapping(v,C);let _=t.render.frame;r[v.id]!==_&&(u(v),r[v.id]=_)}function h(v){let b=d();v.__bindingPointIndex=b;let M=i.createBuffer(),C=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,M),M}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return ie("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let b=s[v.id],M=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let _=0,T=M.length;_<T;_++){let R=M[_];if(Array.isArray(R))for(let I=0,O=R.length;I<O;I++)f(R[I],_,I,C);else f(R,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,b,M,C){if(S(v,b,M,C)===!0){let _=v.__offset,T=v.value;if(Array.isArray(T)){let R=0;for(let I=0;I<T.length;I++){let O=T[I],G=m(O);x(O,v.__data,R),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(R+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else x(T,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function x(v,b,M){typeof v=="number"||typeof v=="boolean"?b[0]=v:v.isMatrix3?(b[0]=v.elements[0],b[1]=v.elements[1],b[2]=v.elements[2],b[3]=0,b[4]=v.elements[3],b[5]=v.elements[4],b[6]=v.elements[5],b[7]=0,b[8]=v.elements[6],b[9]=v.elements[7],b[10]=v.elements[8],b[11]=0):ArrayBuffer.isView(v)?b.set(new v.constructor(v.buffer,v.byteOffset,b.length)):v.toArray(b,M)}function S(v,b,M,C){let _=v.value,T=b+"_"+M;if(C[T]===void 0)return typeof _=="number"||typeof _=="boolean"?C[T]=_:ArrayBuffer.isView(_)?C[T]=_.slice():C[T]=_.clone(),!0;{let R=C[T];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(v){let b=v.uniforms,M=0,C=16;for(let T=0,R=b.length;T<R;T++){let I=Array.isArray(b[T])?b[T]:[b[T]];for(let O=0,G=I.length;O<G;O++){let L=I[O],V=Array.isArray(L.value)?L.value:[L.value];for(let q=0,Y=V.length;q<Y;q++){let rt=V[q],Z=m(rt),tt=M%C,Q=tt%Z.boundary,Dt=tt+Q;M+=Q,Dt!==0&&C-Dt<Z.storage&&(M+=C-Dt),L.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=M,M+=Z.storage}}}let _=M%C;return _>0&&(M+=C-_),v.__size=M,v.__cache={},this}function m(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?ee("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):ee("WebGLRenderer: Unsupported uniform value type.",v),b}function A(v){let b=v.target;b.removeEventListener("dispose",A);let M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function E(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:E}}var nx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Qn=null;function ix(){return Qn===null&&(Qn=new er(nx,16,16,Pi,Cn),Qn.name="DFG_LUT",Qn.minFilter=Ve,Qn.magFilter=Ve,Qn.wrapS=Yn,Qn.wrapT=Yn,Qn.generateMipmaps=!1,Qn.needsUpdate=!0),Qn}var Oo=class{constructor(t={}){let{canvas:e=Oh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=cn}=t;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=n.getContextAttributes().alpha}else x=a;let S=f,g=new Set([Qa,ja,Ka]),m=new Set([cn,En,bs,Ts,Za,Ja]),A=new Uint32Array(4),E=new Int32Array(4),v=new z,b=null,M=null,C=[],_=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,O=null,G=null,L=null,V=null;this._outputColorSpace=an;let q=0,Y=0,rt=null,Z=-1,tt=null,Q=new Fe,Dt=new Fe,It=null,ae=new re(0),ue=0,se=e.width,$=e.height,st=1,Tt=null,Jt=null,wt=new Fe(0,0,se,$),jt=new Fe(0,0,se,$),te=!1,it=new ms,ot=!1,ut=!1,dt=new Le,pt=new z,Kt=new Fe,Yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$t=!1;function Qt(){return rt===null?st:1}let P=n;function Me(y,N){return e.getContext(y,N)}let ne,w,p,B,U,K,_t,Mt,j,nt,At,Ot,Et,St,Ht,Wt,Bt,D,gt,et,xt,bt,ct;try{let y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",ye,!1),e.addEventListener("webglcontextcreationerror",ze,!1),P===null){let N="webgl2";if(P=Me(N,y),P===null)throw Me(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Xt()}catch(y){throw e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",ye,!1),e.removeEventListener("webglcontextcreationerror",ze,!1),ie("WebGLRenderer: "+y.message),y}function Xt(){ne=new h0(P),ne.init(),xt=new $g(P,ne),w=new t0(P,ne,t,xt),p=new Zg(P,ne),w.reversedDepthBuffer&&u&&p.buffers.depth.setReversed(!0),G=P.createFramebuffer(),L=P.createFramebuffer(),V=P.createFramebuffer(),B=new f0(P),U=new Ug,K=new Jg(P,ne,p,U,w,xt,B),_t=new c0(R),Mt=new mf(P),bt=new jm(P,Mt),j=new u0(P,Mt,B,bt),nt=new m0(P,j,Mt,bt,B),D=new p0(P,w,K),Ht=new e0(U),At=new Dg(R,_t,ne,w,bt,Ht),Ot=new tx(R,U),Et=new Fg,St=new kg(ne),Bt=new Km(R,_t,p,nt,x,l),Wt=new Yg(R,nt,w),ct=new ex(P,B,w,p),gt=new Qm(P,ne,B),et=new d0(P,ne,B),B.programs=At.programs,R.capabilities=w,R.extensions=ne,R.properties=U,R.renderLists=Et,R.shadowMap=Wt,R.state=p,R.info=B}S!==cn&&(T=new x0(S,e.width,e.height,o,s,r));let zt=new xc(R,P);this.xr=zt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let y=ne.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=ne.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return st},this.setPixelRatio=function(y){y!==void 0&&(st=y,this.setSize(se,$,!1))},this.getSize=function(y){return y.set(se,$)},this.setSize=function(y,N,X=!0){if(zt.isPresenting){ee("WebGLRenderer: Can't change size while VR device is presenting.");return}se=y,$=N,e.width=Math.floor(y*st),e.height=Math.floor(N*st),X===!0&&(e.style.width=y+"px",e.style.height=N+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(se*st,$*st).floor()},this.setDrawingBufferSize=function(y,N,X){se=y,$=N,st=X,e.width=Math.floor(y*X),e.height=Math.floor(N*X),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(S===cn){ie("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){ee("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(Q)},this.getViewport=function(y){return y.copy(wt)},this.setViewport=function(y,N,X,W){y.isVector4?wt.set(y.x,y.y,y.z,y.w):wt.set(y,N,X,W),p.viewport(Q.copy(wt).multiplyScalar(st).round())},this.getScissor=function(y){return y.copy(jt)},this.setScissor=function(y,N,X,W){y.isVector4?jt.set(y.x,y.y,y.z,y.w):jt.set(y,N,X,W),p.scissor(Dt.copy(jt).multiplyScalar(st).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(y){p.setScissorTest(te=y)},this.setOpaqueSort=function(y){Tt=y},this.setTransparentSort=function(y){Jt=y},this.getClearColor=function(y){return y.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,X=!0){let W=0;if(y){let H=!1;if(rt!==null){let Ct=rt.texture.format;H=g.has(Ct)}if(H){let Ct=rt.texture.type,Ft=m.has(Ct),Pt=Bt.getClearColor(),Gt=Bt.getClearAlpha(),qt=Pt.r,fe=Pt.g,me=Pt.b;Ft?(A[0]=qt,A[1]=fe,A[2]=me,A[3]=Gt,P.clearBufferuiv(P.COLOR,0,A)):(E[0]=qt,E[1]=fe,E[2]=me,E[3]=Gt,P.clearBufferiv(P.COLOR,0,E))}else W|=P.COLOR_BUFFER_BIT}N&&(W|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(W|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&P.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),O=y},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",ye,!1),e.removeEventListener("webglcontextcreationerror",ze,!1),Bt.dispose(),Et.dispose(),St.dispose(),U.dispose(),_t.dispose(),nt.dispose(),bt.dispose(),ct.dispose(),At.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",k),zt.removeEventListener("sessionend",ht),vt.stop()};function Ae(y){y.preventDefault(),ql("WebGLRenderer: Context Lost."),I=!0}function ye(){ql("WebGLRenderer: Context Restored."),I=!1;let y=B.autoReset,N=Wt.enabled,X=Wt.autoUpdate,W=Wt.needsUpdate,H=Wt.type;Xt(),B.autoReset=y,Wt.enabled=N,Wt.autoUpdate=X,Wt.needsUpdate=W,Wt.type=H}function ze(y){ie("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ue(y){let N=y.target;N.removeEventListener("dispose",Ue),Li(N)}function Li(y){kn(y),U.remove(y)}function kn(y){let N=U.get(y).programs;N!==void 0&&(N.forEach(function(X){At.releaseProgram(X)}),y.isShaderMaterial&&At.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,X,W,H,Ct){N===null&&(N=Yt);let Ft=H.isMesh&&H.matrixWorld.determinantAffine()<0,Pt=Hn(y,N,X,W,H);p.setMaterial(W,Ft);let Gt=X.index,qt=1;if(W.wireframe===!0){if(Gt=j.getWireframeAttribute(X),Gt===void 0)return;qt=2}let fe=X.drawRange,me=X.attributes.position,kt=fe.start*qt,we=(fe.start+fe.count)*qt;Ct!==null&&(kt=Math.max(kt,Ct.start*qt),we=Math.min(we,(Ct.start+Ct.count)*qt)),Gt!==null?(kt=Math.max(kt,0),we=Math.min(we,Gt.count)):me!=null&&(kt=Math.max(kt,0),we=Math.min(we,me.count));let Oe=we-kt;if(Oe<0||Oe===1/0)return;bt.setup(H,W,Pt,X,Gt);let pe,ce=gt;if(Gt!==null&&(pe=Mt.get(Gt),ce=et,ce.setIndex(pe)),H.isMesh)W.wireframe===!0?(p.setLineWidth(W.wireframeLinewidth*Qt()),ce.setMode(P.LINES)):ce.setMode(P.TRIANGLES);else if(H.isLine){let he=W.linewidth;he===void 0&&(he=1),p.setLineWidth(he*Qt()),H.isLineSegments?ce.setMode(P.LINES):H.isLineLoop?ce.setMode(P.LINE_LOOP):ce.setMode(P.LINE_STRIP)}else H.isPoints?ce.setMode(P.POINTS):H.isSprite&&ce.setMode(P.TRIANGLES);if(H.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))ce.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let he=H._multiDrawStarts,Lt=H._multiDrawCounts,Ce=H._multiDrawCount,xe=Gt?Mt.get(Gt).bytesPerElement:1,Je=U.get(W).currentProgram.getUniforms();for(let nn=0;nn<Ce;nn++)Je.setValue(P,"_gl_DrawID",nn),ce.render(he[nn]/xe,Lt[nn])}else if(H.isInstancedMesh)ce.renderInstances(kt,Oe,H.count);else if(X.isInstancedBufferGeometry){let he=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Lt=Math.min(X.instanceCount,he);ce.renderInstances(kt,Oe,Lt)}else ce.render(kt,Oe)};function J(y,N,X,W){O!==null&&y.isNodeMaterial&&O.setObject(W,y),ot===!0&&Ht.setState(y,X,!1),y.transparent===!0&&y.side===Ln&&y.forceSinglePass===!1?(y.side=en,y.needsUpdate=!0,mt(y,N,W),y.side=Ci,y.needsUpdate=!0,mt(y,N,W),y.side=Ln):mt(y,N,W)}this.compile=function(y,N,X=null){X===null&&(X=y),O!==null&&O.renderStart(y,N,X),M=St.get(X),M.init(N),_.push(M),X.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(M.pushLight(H),H.castShadow&&M.pushShadow(H))}),y!==X&&y.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(M.pushLight(H),H.castShadow&&M.pushShadow(H))}),M.setupLights(),O!==null&&O.updateLights(M.state.lightsArray),ut=this.localClippingEnabled,ot=Ht.init(this.clippingPlanes,ut),ot===!0&&Ht.setGlobalState(this.clippingPlanes,N),O!==null&&Wt.render(M.state.shadowsArray,X,N);let W=new Set;return y.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Ct=H.material;if(Ct)if(Array.isArray(Ct))for(let Ft=0;Ft<Ct.length;Ft++){let Pt=Ct[Ft];J(Pt,X,N,H),W.add(Pt)}else J(Ct,X,N,H),W.add(Ct)}),M=_.pop(),O!==null&&O.renderEnd(),W},this.compileAsync=function(y,N,X=null){let W=this.compile(y,N,X);return new Promise(H=>{function Ct(){if(W.forEach(function(Ft){let Gt=U.get(Ft).currentProgram;(Gt===void 0||Gt.isReady())&&W.delete(Ft)}),W.size===0){H(y);return}setTimeout(Ct,10)}ne.get("KHR_parallel_shader_compile")!==null?Ct():setTimeout(Ct,10)})};let at=null;function F(y){at&&at(y)}function k(){vt.stop()}function ht(){vt.start()}let vt=new gu;vt.setAnimationLoop(F),typeof self<"u"&&vt.setContext(self),this.setAnimationLoop=function(y){at=y,zt.setAnimationLoop(y),y===null?vt.stop():vt.start()},zt.addEventListener("sessionstart",k),zt.addEventListener("sessionend",ht),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){ie("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;O!==null&&O.renderStart(y,N);let X=zt.enabled===!0&&zt.isPresenting===!0,W=T!==null&&(rt===null||X)&&T.begin(R,rt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(N),N=zt.getCamera()),y.isScene===!0&&y.onBeforeRender(R,y,N,rt),M=St.get(y,_.length),M.init(N),M.state.textureUnits=K.getTextureUnits(),_.push(M),dt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),it.setFromProjectionMatrix(dt,Vn,N.reversedDepth),ut=this.localClippingEnabled,ot=Ht.init(this.clippingPlanes,ut),b=Et.get(y,C.length),b.init(),C.push(b),zt.enabled===!0&&zt.isPresenting===!0){let Ft=R.xr.getDepthSensingMesh();Ft!==null&&Rt(Ft,N,-1/0,R.sortObjects)}Rt(y,N,0,R.sortObjects),b.finish(),O!==null&&O.updateLights(M.state.lightsArray),R.sortObjects===!0&&b.sort(Tt,Jt),$t=zt.enabled===!1||zt.isPresenting===!1||zt.hasDepthSensing()===!1,$t&&Bt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ot===!0&&Ht.beginShadows();let H=M.state.shadowsArray;if(Wt.render(H,y,N),ot===!0&&Ht.endShadows(),(W&&T.hasRenderPass())===!1){let Ft=b.opaque,Pt=b.transmissive;if(M.setupLights(),N.isArrayCamera){let Gt=N.cameras;if(Pt.length>0)for(let qt=0,fe=Gt.length;qt<fe;qt++){let me=Gt[qt];Nt(Ft,Pt,y,me)}$t&&Bt.render(y);for(let qt=0,fe=Gt.length;qt<fe;qt++){let me=Gt[qt];lt(b,y,me,me.viewport)}}else Pt.length>0&&Nt(Ft,Pt,y,N),$t&&Bt.render(y),lt(b,y,N)}rt!==null&&Y===0&&(K.updateMultisampleRenderTarget(rt),K.updateRenderTargetMipmap(rt)),W&&T.end(R),y.isScene===!0&&y.onAfterRender(R,y,N),bt.resetDefaultState(),Z=-1,tt=null,_.pop(),_.length>0?(M=_[_.length-1],K.setTextureUnits(M.state.textureUnits),ot===!0&&Ht.setGlobalState(R.clippingPlanes,M.state.camera)):M=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,O!==null&&O.renderEnd()};function Rt(y,N,X,W){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)X=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)M.pushLightProbeGrid(y);else if(y.isLight)M.pushLight(y),y.castShadow&&M.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(it)){W&&Kt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(dt);let Ft=nt.update(y),Pt=y.material;Pt.visible&&b.push(y,Ft,Pt,X,Kt.z,null,N)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(it))){let Ft=nt.update(y),Pt=y.material;if(W&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Kt.copy(y.boundingSphere.center)):(Ft.boundingSphere===null&&Ft.computeBoundingSphere(),Kt.copy(Ft.boundingSphere.center)),Kt.applyMatrix4(y.matrixWorld).applyMatrix4(dt)),Array.isArray(Pt)){let Gt=Ft.groups;for(let qt=0,fe=Gt.length;qt<fe;qt++){let me=Gt[qt],kt=Pt[me.materialIndex];kt&&kt.visible&&b.push(y,Ft,kt,X,Kt.z,me,N)}}else Pt.visible&&b.push(y,Ft,Pt,X,Kt.z,null,N)}}let Ct=y.children;for(let Ft=0,Pt=Ct.length;Ft<Pt;Ft++)Rt(Ct[Ft],N,X,W)}function lt(y,N,X,W){let{opaque:H,transmissive:Ct,transparent:Ft}=y;M.setupLightsView(X),ot===!0&&Ht.setGlobalState(R.clippingPlanes,X),W&&p.viewport(Q.copy(W)),H.length>0&&Vt(H,N,X),Ct.length>0&&Vt(Ct,N,X),Ft.length>0&&Vt(Ft,N,X),p.buffers.depth.setTest(!0),p.buffers.depth.setMask(!0),p.buffers.color.setMask(!0),p.setPolygonOffset(!1)}function Nt(y,N,X,W){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[W.id]===void 0){let kt=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[W.id]=new Qe(1,1,{generateMipmaps:!0,type:kt?Cn:cn,minFilter:jn,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Se.workingColorSpace})}let Ct=M.state.transmissionRenderTarget[W.id],Ft=W.viewport||Q;Ct.setSize(Ft.z*R.transmissionResolutionScale,Ft.w*R.transmissionResolutionScale);let Pt=R.getRenderTarget(),Gt=R.getActiveCubeFace(),qt=R.getActiveMipmapLevel();R.setRenderTarget(Ct),R.getClearColor(ae),ue=R.getClearAlpha(),ue<1&&R.setClearColor(16777215,.5),R.clear(),$t&&Bt.render(X);let fe=R.toneMapping;R.toneMapping=wn;let me=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),M.setupLightsView(W),ot===!0&&Ht.setGlobalState(R.clippingPlanes,W),Vt(y,X,W),K.updateMultisampleRenderTarget(Ct),K.updateRenderTargetMipmap(Ct),ne.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let we=0,Oe=N.length;we<Oe;we++){let pe=N[we],{object:ce,geometry:he,material:Lt,group:Ce}=pe;if(Lt.side===Ln&&ce.layers.test(W.layers)){let xe=Lt.side;Lt.side=en,Lt.needsUpdate=!0,de(ce,X,W,he,Lt,Ce),Lt.side=xe,Lt.needsUpdate=!0,kt=!0}}kt===!0&&(K.updateMultisampleRenderTarget(Ct),K.updateRenderTargetMipmap(Ct))}R.setRenderTarget(Pt,Gt,qt),R.setClearColor(ae,ue),me!==void 0&&(W.viewport=me),R.toneMapping=fe}function Vt(y,N,X){let W=N.isScene===!0?N.overrideMaterial:null;for(let H=0,Ct=y.length;H<Ct;H++){let Ft=y[H],{object:Pt,geometry:Gt,group:qt}=Ft,fe=Ft.material;fe.allowOverride===!0&&W!==null&&(fe=W),Pt.layers.test(X.layers)&&de(Pt,N,X,Gt,fe,qt)}}function de(y,N,X,W,H,Ct){O!==null&&H.isNodeMaterial&&O.setObject(y,H),y.onBeforeRender(R,N,X,W,H,Ct),y.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),H.onBeforeRender(R,N,X,W,y,Ct),H.transparent===!0&&H.side===Ln&&H.forceSinglePass===!1?(H.side=en,H.needsUpdate=!0,R.renderBufferDirect(X,N,W,H,y,Ct),H.side=Ci,H.needsUpdate=!0,R.renderBufferDirect(X,N,W,H,y,Ct),H.side=Ln):R.renderBufferDirect(X,N,W,H,y,Ct),y.onAfterRender(R,N,X,W,H,Ct)}function mt(y,N,X){N.isScene!==!0&&(N=Yt);let W=U.get(y),H=M.state.lights,Ct=M.state.shadowsArray,Ft=H.state.version,Pt=At.getParameters(y,H.state,Ct,N,X,M.state.lightProbeGridArray),Gt=At.getProgramCacheKey(Pt),qt=W.programs;W.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,W.fog=N.fog;let fe=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;W.envMap=_t.get(y.envMap||W.environment,fe),W.envMapRotation=W.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,qt===void 0&&(y.addEventListener("dispose",Ue),qt=new Map,W.programs=qt);let me=qt.get(Gt);if(me!==void 0){if(W.currentProgram===me&&W.lightsStateVersion===Ft)return ve(y,Pt),me}else Pt.uniforms=At.getUniforms(y),O!==null&&y.isNodeMaterial&&O.build(y,X,Pt),y.onBeforeCompile(Pt,R),me=At.acquireProgram(Pt,Gt),qt.set(Gt,me),W.uniforms=Pt.uniforms;let kt=W.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(kt.clippingPlanes=Ht.uniform),ve(y,Pt),W.needsLights=De(y),W.lightsStateVersion=Ft,W.needsLights&&(kt.ambientLightColor.value=H.state.ambient,kt.lightProbe.value=H.state.probe,kt.sunLights.value=H.state.sun,kt.sunLightShadows.value=H.state.sunShadow,kt.directionalLights.value=H.state.directional,kt.directionalLightShadows.value=H.state.directionalShadow,kt.spotLights.value=H.state.spot,kt.spotLightShadows.value=H.state.spotShadow,kt.rectAreaLights.value=H.state.rectArea,kt.ltc_1.value=H.state.rectAreaLTC1,kt.ltc_2.value=H.state.rectAreaLTC2,kt.pointLights.value=H.state.point,kt.pointLightShadows.value=H.state.pointShadow,kt.hemisphereLights.value=H.state.hemi,kt.sunShadowMatrix.value=H.state.sunShadowMatrix,kt.sunShadowCascade.value=H.state.sunShadowCascade,kt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,kt.spotLightMatrix.value=H.state.spotLightMatrix,kt.spotLightMap.value=H.state.spotLightMap,kt.pointShadowMatrix.value=H.state.pointShadowMatrix),W.lightProbeGrid=M.state.lightProbeGridArray.length>0,W.currentProgram=me,W.uniformsList=null,me}function Zt(y){if(y.uniformsList===null){let N=y.currentProgram.getUniforms();y.uniformsList=Cs.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function ve(y,N){let X=U.get(y);X.outputColorSpace=N.outputColorSpace,X.batching=N.batching,X.batchingColor=N.batchingColor,X.instancing=N.instancing,X.instancingColor=N.instancingColor,X.instancingMorph=N.instancingMorph,X.skinning=N.skinning,X.morphTargets=N.morphTargets,X.morphNormals=N.morphNormals,X.morphColors=N.morphColors,X.morphTargetsCount=N.morphTargetsCount,X.numClippingPlanes=N.numClippingPlanes,X.numIntersection=N.numClipIntersection,X.vertexAlphas=N.vertexAlphas,X.vertexTangents=N.vertexTangents,X.toneMapping=N.toneMapping}function ke(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let X=0,W=y.length;X<W;X++){let H=y[X];if(H.texture!==null&&H.boundingBox.containsPoint(v))return H}return null}function Hn(y,N,X,W,H){N.isScene!==!0&&(N=Yt),K.resetTextureUnits();let Ct=N.fog,Ft=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?N.environment:null,Pt=rt===null?R.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Se.workingColorSpace,Gt=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,qt=_t.get(W.envMap||Ft,Gt),fe=W.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,me=!!X.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),kt=!!X.morphAttributes.position,we=!!X.morphAttributes.normal,Oe=!!X.morphAttributes.color,pe=wn;W.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(pe=R.toneMapping);let ce=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,he=ce!==void 0?ce.length:0,Lt=U.get(W),Ce=M.state.lights;if(ot===!0&&(ut===!0||y!==tt)){let Te=y===tt&&W.id===Z;Ht.setState(W,y,Te)}let xe=!1;W.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==Ce.state.version||Lt.outputColorSpace!==Pt||H.isBatchedMesh&&Lt.batching===!1||!H.isBatchedMesh&&Lt.batching===!0||H.isBatchedMesh&&Lt.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Lt.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Lt.instancing===!1||!H.isInstancedMesh&&Lt.instancing===!0||H.isSkinnedMesh&&Lt.skinning===!1||!H.isSkinnedMesh&&Lt.skinning===!0||H.isInstancedMesh&&Lt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Lt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Lt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Lt.instancingMorph===!1&&H.morphTexture!==null||Lt.envMap!==qt||W.fog===!0&&Lt.fog!==Ct||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==Ht.numPlanes||Lt.numIntersection!==Ht.numIntersection)||Lt.vertexAlphas!==fe||Lt.vertexTangents!==me||Lt.morphTargets!==kt||Lt.morphNormals!==we||Lt.morphColors!==Oe||Lt.toneMapping!==pe||Lt.morphTargetsCount!==he||!!Lt.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(xe=!0):(xe=!0,Lt.__version=W.version);let Je=Lt.currentProgram;xe===!0&&(Je=mt(W,N,H),O&&W.isNodeMaterial&&O.onUpdateProgram(W,Je,Lt));let nn=!1,yn=!1,gn=!1,Ee=Je.getUniforms(),Pe=Lt.uniforms;if(p.useProgram(Je.program)&&(nn=!0,yn=!0,gn=!0),W.id!==Z&&(Z=W.id,yn=!0),Lt.needsLights){let Te=ke(M.state.lightProbeGridArray,H);Lt.lightProbeGrid!==Te&&(Lt.lightProbeGrid=Te,yn=!0)}if(nn||tt!==y){p.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Ee.setValue(P,"projectionMatrix",y.projectionMatrix),Ee.setValue(P,"viewMatrix",y.matrixWorldInverse);let $e=Ee.map.cameraPosition;$e!==void 0&&$e.setValue(P,pt.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&Ee.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Ee.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),tt!==y&&(tt=y,yn=!0,gn=!0)}if(Lt.needsLights&&(Ce.state.sunShadowMap.length>0&&Ee.setValue(P,"sunShadowMap",Ce.state.sunShadowMap,K),Ce.state.directionalShadowMap.length>0&&Ee.setValue(P,"directionalShadowMap",Ce.state.directionalShadowMap,K),Ce.state.spotShadowMap.length>0&&Ee.setValue(P,"spotShadowMap",Ce.state.spotShadowMap,K),Ce.state.pointShadowMap.length>0&&Ee.setValue(P,"pointShadowMap",Ce.state.pointShadowMap,K)),H.isSkinnedMesh){Ee.setOptional(P,H,"bindMatrix"),Ee.setOptional(P,H,"bindMatrixInverse");let Te=H.skeleton;Te&&(Te.boneTexture===null&&Te.computeBoneTexture(),Ee.setValue(P,"boneTexture",Te.boneTexture,K))}H.isBatchedMesh&&(Ee.setOptional(P,H,"batchingTexture"),Ee.setValue(P,"batchingTexture",H._matricesTexture,K),Ee.setOptional(P,H,"batchingIdTexture"),Ee.setValue(P,"batchingIdTexture",H._indirectTexture,K),Ee.setOptional(P,H,"batchingColorTexture"),H._colorsTexture!==null&&Ee.setValue(P,"batchingColorTexture",H._colorsTexture,K));let un=X.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&D.update(H,X,Je),(yn||Lt.receiveShadow!==H.receiveShadow)&&(Lt.receiveShadow=H.receiveShadow,Ee.setValue(P,"receiveShadow",H.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&N.environment!==null&&(Pe.envMapIntensity.value=N.environmentIntensity),Pe.dfgLUT!==void 0&&(Pe.dfgLUT.value=ix()),yn){if(Ee.setValue(P,"toneMappingExposure",R.toneMappingExposure),Lt.needsLights&&Wn(Pe,gn),Ct&&W.fog===!0&&Ot.refreshFogUniforms(Pe,Ct),Ot.refreshMaterialUniforms(Pe,W,st,$,M.state.transmissionRenderTarget[y.id]),Lt.needsLights&&Lt.lightProbeGrid){let Te=Lt.lightProbeGrid;Pe.probesSH.value=Te.texture,Pe.probesMin.value.copy(Te.boundingBox.min),Pe.probesMax.value.copy(Te.boundingBox.max),Pe.probesResolution.value.copy(Te.resolution)}Cs.upload(P,Zt(Lt),Pe,K)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Cs.upload(P,Zt(Lt),Pe,K),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Ee.setValue(P,"center",H.center),Ee.setValue(P,"modelViewMatrix",H.modelViewMatrix),Ee.setValue(P,"normalMatrix",H.normalMatrix),Ee.setValue(P,"modelMatrix",H.matrixWorld),W.uniformsGroups!==void 0){let Te=W.uniformsGroups;for(let $e=0,Xn=Te.length;$e<Xn;$e++){let Zi=Te[$e];ct.update(Zi,Je),ct.bind(Zi,Je)}}return Je}function Wn(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.sunLights.needsUpdate=N,y.sunLightShadows.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function De(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return rt},this.setRenderTargetTextures=function(y,N,X){let W=U.get(y);W.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),U.get(y.texture).__webglTexture=N,U.get(y.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:X,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){let X=U.get(y);X.__webglFramebuffer=N,X.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,X=0){rt=y,q=N,Y=X;let W=null,H=!1,Ct=!1;if(y){let Pt=U.get(y);if(Pt.__useDefaultFramebuffer!==void 0){p.bindFramebuffer(P.FRAMEBUFFER,Pt.__webglFramebuffer),Q.copy(y.viewport),Dt.copy(y.scissor),It=y.scissorTest,p.viewport(Q),p.scissor(Dt),p.setScissorTest(It),Z=-1;return}else if(Pt.__webglFramebuffer===void 0)K.setupRenderTarget(y);else if(Pt.__hasExternalTextures)K.rebindTextures(y,U.get(y.texture).__webglTexture,U.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let fe=y.depthTexture;if(Pt.__boundDepthTexture!==fe){if(fe!==null&&U.has(fe)&&(y.width!==fe.image.width||y.height!==fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(y)}}let Gt=y.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(Ct=!0);let qt=U.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(qt[N])?W=qt[N][X]:W=qt[N],H=!0):y.samples>0&&K.useMultisampledRTT(y)===!1?W=U.get(y).__webglMultisampledFramebuffer:Array.isArray(qt)?W=qt[X]:W=qt,Q.copy(y.viewport),Dt.copy(y.scissor),It=y.scissorTest}else Q.copy(wt).multiplyScalar(st).floor(),Dt.copy(jt).multiplyScalar(st).floor(),It=te;if(X!==0&&(W=G),p.bindFramebuffer(P.FRAMEBUFFER,W)&&p.drawBuffers(y,W),p.viewport(Q),p.scissor(Dt),p.setScissorTest(It),H){let Pt=U.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+N,Pt.__webglTexture,X)}else if(Ct){let Pt=N;for(let Gt=0;Gt<y.textures.length;Gt++){let qt=U.get(y.textures[Gt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Gt,qt.__webglTexture,X,Pt)}}else if(y!==null&&X!==0){let Pt=U.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Pt.__webglTexture,X)}Z=-1};function je(y){let N=U.get(y);return(N.__readFormat!==y.format||N.__readType!==y.type)&&(N.__readFormat=y.format,N.__readType=y.type,N.__formatReadable=w.textureFormatReadable(y.format),N.__typeReadable=w.textureTypeReadable(y.type)),N}this.readRenderTargetPixels=function(y,N,X,W,H,Ct,Ft,Pt=0){if(!(y&&y.isWebGLRenderTarget)){ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Gt=U.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ft!==void 0&&(Gt=Gt[Ft]),Gt){p.bindFramebuffer(P.FRAMEBUFFER,Gt);try{let qt=y.textures[Pt],fe=qt.format,me=qt.type;y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Pt);let kt=je(qt);if(kt.__formatReadable===!1){ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(kt.__typeReadable===!1){ie("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-W&&X>=0&&X<=y.height-H&&P.readPixels(N,X,W,H,xt.convert(fe),xt.convert(me),Ct)}finally{let qt=rt!==null?U.get(rt).__webglFramebuffer:null;p.bindFramebuffer(P.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(y,N,X,W,H,Ct,Ft,Pt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Gt=U.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ft!==void 0&&(Gt=Gt[Ft]),Gt)if(N>=0&&N<=y.width-W&&X>=0&&X<=y.height-H){p.bindFramebuffer(P.FRAMEBUFFER,Gt);let qt=y.textures[Pt],fe=qt.format,me=qt.type;y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Pt);let kt=je(qt);if(kt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(kt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let we=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,we),P.bufferData(P.PIXEL_PACK_BUFFER,Ct.byteLength,P.STREAM_READ),P.readPixels(N,X,W,H,xt.convert(fe),xt.convert(me),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let Oe=rt!==null?U.get(rt).__webglFramebuffer:null;p.bindFramebuffer(P.FRAMEBUFFER,Oe);let pe=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await zh(P,pe,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,we),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Ct),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(we),P.deleteSync(pe),Ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,X=0){let W=Math.pow(2,-X),H=Math.floor(y.image.width*W),Ct=Math.floor(y.image.height*W),Ft=N!==null?N.x:0,Pt=N!==null?N.y:0;K.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,X,0,0,Ft,Pt,H,Ct),p.unbindTexture()},this.copyTextureToTexture=function(y,N,X=null,W=null,H=0,Ct=0){let Ft,Pt,Gt,qt,fe,me,kt,we,Oe,pe=y.isCompressedTexture?y.mipmaps[Ct]:y.image;if(X!==null)Ft=X.max.x-X.min.x,Pt=X.max.y-X.min.y,Gt=X.isBox3?X.max.z-X.min.z:1,qt=X.min.x,fe=X.min.y,me=X.isBox3?X.min.z:0;else{let Pe=Math.pow(2,-H);Ft=Math.floor(pe.width*Pe),Pt=Math.floor(pe.height*Pe),y.isDataArrayTexture?Gt=pe.depth:y.isData3DTexture?Gt=Math.floor(pe.depth*Pe):Gt=1,qt=0,fe=0,me=0}W!==null?(kt=W.x,we=W.y,Oe=W.z):(kt=0,we=0,Oe=0);let ce=xt.convert(N.format),he=xt.convert(N.type),Lt;N.isData3DTexture?(K.setTexture3D(N,0),Lt=P.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(K.setTexture2DArray(N,0),Lt=P.TEXTURE_2D_ARRAY):(K.setTexture2D(N,0),Lt=P.TEXTURE_2D),p.activeTexture(P.TEXTURE0),p.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,N.flipY),p.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),p.pixelStorei(P.UNPACK_ALIGNMENT,N.unpackAlignment);let Ce=p.getParameter(P.UNPACK_ROW_LENGTH),xe=p.getParameter(P.UNPACK_IMAGE_HEIGHT),Je=p.getParameter(P.UNPACK_SKIP_PIXELS),nn=p.getParameter(P.UNPACK_SKIP_ROWS),yn=p.getParameter(P.UNPACK_SKIP_IMAGES);p.pixelStorei(P.UNPACK_ROW_LENGTH,pe.width),p.pixelStorei(P.UNPACK_IMAGE_HEIGHT,pe.height),p.pixelStorei(P.UNPACK_SKIP_PIXELS,qt),p.pixelStorei(P.UNPACK_SKIP_ROWS,fe),p.pixelStorei(P.UNPACK_SKIP_IMAGES,me);let gn=y.isDataArrayTexture||y.isData3DTexture,Ee=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){let Pe=U.get(y),un=U.get(N),Te=U.get(Pe.__renderTarget),$e=U.get(un.__renderTarget);p.bindFramebuffer(P.READ_FRAMEBUFFER,Te.__webglFramebuffer),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Xn=0;Xn<Gt;Xn++)gn&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,U.get(y).__webglTexture,H,me+Xn),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,U.get(N).__webglTexture,Ct,Oe+Xn)),P.blitFramebuffer(qt,fe,Ft,Pt,kt,we,Ft,Pt,P.DEPTH_BUFFER_BIT,P.NEAREST);p.bindFramebuffer(P.READ_FRAMEBUFFER,null),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(H!==0||y.isRenderTargetTexture||U.has(y)){let Pe=U.get(y),un=U.get(N);p.bindFramebuffer(P.READ_FRAMEBUFFER,L),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,V);for(let Te=0;Te<Gt;Te++)gn?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Pe.__webglTexture,H,me+Te):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Pe.__webglTexture,H),Ee?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,un.__webglTexture,Ct,Oe+Te):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,un.__webglTexture,Ct),H!==0?P.blitFramebuffer(qt,fe,Ft,Pt,kt,we,Ft,Pt,P.COLOR_BUFFER_BIT,P.NEAREST):Ee?P.copyTexSubImage3D(Lt,Ct,kt,we,Oe+Te,qt,fe,Ft,Pt):P.copyTexSubImage2D(Lt,Ct,kt,we,qt,fe,Ft,Pt);p.bindFramebuffer(P.READ_FRAMEBUFFER,null),p.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Ee?y.isDataTexture||y.isData3DTexture?P.texSubImage3D(Lt,Ct,kt,we,Oe,Ft,Pt,Gt,ce,he,pe.data):N.isCompressedArrayTexture?P.compressedTexSubImage3D(Lt,Ct,kt,we,Oe,Ft,Pt,Gt,ce,pe.data):P.texSubImage3D(Lt,Ct,kt,we,Oe,Ft,Pt,Gt,ce,he,pe):y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Ct,kt,we,Ft,Pt,ce,he,pe.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Ct,kt,we,pe.width,pe.height,ce,pe.data):P.texSubImage2D(P.TEXTURE_2D,Ct,kt,we,Ft,Pt,ce,he,pe);p.pixelStorei(P.UNPACK_ROW_LENGTH,Ce),p.pixelStorei(P.UNPACK_IMAGE_HEIGHT,xe),p.pixelStorei(P.UNPACK_SKIP_PIXELS,Je),p.pixelStorei(P.UNPACK_SKIP_ROWS,nn),p.pixelStorei(P.UNPACK_SKIP_IMAGES,yn),Ct===0&&N.generateMipmaps&&P.generateMipmap(Lt),p.unbindTexture()},this.initRenderTarget=function(y){U.get(y).__webglFramebuffer===void 0&&K.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?K.setTextureCube(y,0):y.isData3DTexture?K.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?K.setTexture2DArray(y,0):K.setTexture2D(y,0),p.unbindTexture()},this.resetState=function(){q=0,Y=0,rt=null,p.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Se._getDrawingBufferColorSpace(t),e.unpackColorSpace=Se._getUnpackColorSpace()}};function Tu(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new qe,c=0;for(let h=0;h<i.length;++h){let d=i[h],u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,d=[];for(let u=0;u<i.length;++u){let f=i[u].index;for(let x=0;x<f.count;++x)d.push(f.getX(x)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(let h in r){let d=bu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(let h in a){let d=a[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){let f=[];for(let S=0;S<a[h].length;++S)f.push(a[h][S][u]);let x=bu(f);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(x)}}}return l}function bu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let a=new t(r),o=new ln(a,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let d=l/e;for(let u=0,f=h.count;u<f;u++)for(let x=0;x<e;x++){let S=h.getComponent(u,x);o.setComponent(u+d,x,S)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function Au(i,t=Math.PI/3){let e=i.index?i.toNonIndexed():i,n=e.attributes.position,s=n.count,r;if(n.isBufferAttribute===!0&&n.itemSize===3&&n.normalized===!1)r=n.array;else{r=new Float64Array(s*3);for(let v=0;v<s;v++)r[3*v+0]=n.getX(v),r[3*v+1]=n.getY(v),r[3*v+2]=n.getZ(v)}let a=Math.cos(t),o=(1+1e-10)*100,l=s/3,c=new Float64Array(l*3);for(let v=0;v<l;v++){let b=9*v,M=r[b+0],C=r[b+1],_=r[b+2],T=r[b+3],R=r[b+4],I=r[b+5],O=r[b+6],G=r[b+7],L=r[b+8],V=O-T,q=G-R,Y=L-I,rt=M-T,Z=C-R,tt=_-I,Q=q*tt-Y*Z,Dt=Y*rt-V*tt,It=V*Z-q*rt,ae=1/(Math.sqrt(Q*Q+Dt*Dt+It*It)||1);c[3*v+0]=Q*ae,c[3*v+1]=Dt*ae,c[3*v+2]=It*ae}let h=new Int32Array(s),d=new Float64Array(s*3),u=1;for(;u<s*2;)u<<=1;let f=u-1,x=new Int32Array(u),S=0;for(let v=0;v<s;v++){let b=3*v,M=Math.trunc(r[b+0]*o),C=Math.trunc(r[b+1]*o),_=Math.trunc(r[b+2]*o),T=(Math.imul(M,73856093)^Math.imul(C,19349663)^Math.imul(_,83492791))&f;for(;;){let R=x[T];if(R===0){let O=3*S;d[O+0]=M,d[O+1]=C,d[O+2]=_,x[T]=S+1,h[v]=S++;break}let I=3*(R-1);if(d[I+0]===M&&d[I+1]===C&&d[I+2]===_){h[v]=R-1;break}T=T+1&f}}let g=new Int32Array(S+1);for(let v=0;v<s;v++)g[h[v]+1]++;for(let v=0;v<S;v++)g[v+1]+=g[v];let m=new Int32Array(s),A=g.slice(0,S);for(let v=0;v<l;v++){let b=3*v;m[A[h[b+0]]++]=v,m[A[h[b+1]]++]=v,m[A[h[b+2]]++]=v}let E=new Float32Array(s*3);for(let v=0;v<l;v++){let b=3*v,M=c[b+0],C=c[b+1],_=c[b+2];for(let T=0;T<3;T++){let R=b+T,I=h[R],O=0,G=0,L=0;for(let q=g[I],Y=g[I+1];q<Y;q++){let rt=3*m[q],Z=c[rt+0],tt=c[rt+1],Q=c[rt+2];M*Z+C*tt+_*Q>a&&(O+=Z,G+=tt,L+=Q)}let V=1/(Math.sqrt(O*O+G*G+L*L)||1);E[3*R+0]=O*V,E[3*R+1]=G*V,E[3*R+2]=L*V}}return e.setAttribute("normal",new ln(E,3,!1)),e}var Rn=Math.PI*2,Dr=.046,Ps=(i,t=Dr)=>i*t/2,Nn=(i,t,e=.012,n=10,s=.6)=>{e=Math.min(e,t*.38);let r=new pr(i,{depth:Math.max(.001,t-e*2),bevelEnabled:e>0,bevelThickness:e,bevelSize:e,bevelOffset:-e,bevelSegments:1,curveSegments:n,steps:1});return r.translate(0,0,-(t-e*2)/2),s?Au(r,s):r},_n=(i,t=28)=>{let e=new mr(i.map(([n,s])=>new yt(Math.max(n,1e-4),s)),t);return e.rotateX(Math.PI/2),e.toNonIndexed()},Vo=i=>Tu(i.map(t=>{let e=t.index?t.toNonIndexed():t;for(let n of Object.keys(e.attributes))["position","normal","uv"].includes(n)||e.deleteAttribute(n);return e}),!1),di=(i,t=0,e=0,n=!0)=>{let s=new ci;return s.absarc(t,e,i,0,Rn,n),s};function sx(i,t=28){let e=[];for(let[l,c,h]of i)for(let d=0;d<t;d++){let u=d/t*Rn;e.push([l+Math.cos(u)*h,c+Math.sin(u)*h])}e.sort((l,c)=>l[0]-c[0]||l[1]-c[1]);let n=(l,c,h)=>(c[0]-l[0])*(h[1]-l[1])-(c[1]-l[1])*(h[0]-l[0]),s=[],r=[];for(let l of e){for(;s.length>=2&&n(s[s.length-2],s[s.length-1],l)<=0;)s.pop();s.push(l)}for(let l of e.slice().reverse()){for(;r.length>=2&&n(r[r.length-2],r[r.length-1],l)<=0;)r.pop();r.push(l)}let a=s.slice(0,-1).concat(r.slice(0,-1)),o=new tn;return a.forEach((l,c)=>c?o.lineTo(l[0],l[1]):o.moveTo(l[0],l[1])),o.closePath(),o}function rx(i,t,e=!1){let n=i*t/2,s=n-1.2*t,r=n+.95*t,a=Rn/i,o=new tn,l=e?[[s,-.46],[r,.34],[s,.44]]:[[s,-.31],[n,-.245],[r,-.12],[r,.12],[n,.245],[s,.31]];for(let c=0;c<i;c++)for(let[h,d]of l){let u=(c+d)*a,f=Math.cos(u)*h,x=Math.sin(u)*h;c===0&&d===l[0][1]?o.moveTo(f,x):o.lineTo(f,x)}return o.closePath(),{s:o,r:n,rr:s,ro:r}}function wu(i,t,e,n,s){if(e-n<.1||t<2)return;let r=Math.asin(Math.min(.9,s/e)),a=Math.asin(Math.min(.9,s/n));for(let o=0;o<t;o++){let l=o/t*Rn,c=(o+1)/t*Rn;if(c-l-2*a<.12)return;let h=new ci;h.absarc(0,0,e,l+r,c-r,!1),h.absarc(0,0,n,c-a,l+a,!0),h.closePath(),i.holes.push(h)}}function Ur(i,{m:t=Dr,grosor:e=.075,eje:n=.04,radios:s=-1,sierra:r=!1,bisel:a=.009}={}){let{s:o,r:l,rr:c}=rx(i,t,r),h=s>=0?s:i<26?0:i<34?4:i<60?5:6;return wu(o,h,c-Math.max(.06,l*.1),Math.max(.1,l*.2),.03+l*.03),o.holes.push(di(n)),Nn(o,e,a,8,.5)}var Eu=(i,t=.16)=>Ur(i,{grosor:t,radios:0,eje:.028,bisel:.006});function Cu(i=.52){let t=new tn;t.absarc(0,0,i,0,Rn,!1),wu(t,3,i-.075,.09,.035),t.holes.push(di(.03));let e=Nn(t,.07,.01,40,.7),n=[];for(let s=0;s<12;s++){let r=s/12*Rn+.26,a=_n([[0,-.02],[.022,-.02],[.026,0],[.022,.02],[0,.02]],10);a.rotateX(Math.PI/2),a.rotateZ(r-Math.PI/2),a.translate(Math.cos(r)*(i+.012),Math.sin(r)*(i+.012),0),n.push(a)}return Vo([e,...n])}function Ru(i=8,t=.42){let e=new tn;for(let n=0;n<i;n++){let s=n/i*Rn,r=(n+.5)/i*Rn,a=[Math.cos(s)*t,Math.sin(s)*t],o=[Math.cos(r)*t*.58,Math.sin(r)*t*.58];n?e.lineTo(a[0],a[1]):e.moveTo(a[0],a[1]),e.lineTo(o[0],o[1])}return e.closePath(),e.holes.push(di(.045)),Nn(e,.08,.01,6,.4)}function Iu(i=.34,t=.78){let e=new tn,n=72;for(let s=0;s<=n;s++){let r=s/n,a=r*Rn,o=i+(t-i)*r,l=Math.cos(a)*o,c=Math.sin(a)*o;s?e.lineTo(l,c):e.moveTo(l,c)}return e.closePath(),e.holes.push(di(.05)),e.holes.push(di(.07,i*.55,0)),e.holes.push(di(.09,-i*.2,i*.75)),Nn(e,.1,.012,8,.7)}function Pu(i=2.2,t=Dr*1.3){let e=new tn,n=Math.PI*t,s=Math.floor(i/n),r=.2;e.moveTo(-i/2,-r),e.lineTo(i/2,-r),e.lineTo(i/2,0);for(let o=s-1;o>=0;o--){let l=-i/2+(o+.5)*n+(i-s*n)/2;e.lineTo(l+n*.31,0),e.lineTo(l+n*.12,t*2.1),e.lineTo(l-n*.12,t*2.1),e.lineTo(l-n*.31,0)}e.lineTo(-i/2,0),e.closePath();let a=new ci;return a.absarc(-i*.28,-r*.5,.035,Math.PI/2,Math.PI*1.5,!1),a.absarc(i*.28,-r*.5,.035,-Math.PI/2,Math.PI/2,!1),a.closePath(),e.holes.push(a),Nn(e,.09,.011,6,.4)}function Ls(i,t=[],e=.1,n=.02){let s=sx(i);for(let[r,a,o]of t)s.holes.push(di(o,r,a));return Nn(s,e,n,12,.75)}function Ds(i,t,e=.5,n=.2,s=[]){let r=new tn,a=i/2,o=t/2;r.moveTo(-a+e,-o),r.lineTo(a-e,-o),r.absarc(a-e,-o+e,e,-Math.PI/2,0,!1),r.lineTo(a,o-e),r.absarc(a-e,o-e,e,0,Math.PI/2,!1),r.lineTo(-a+e,o),r.absarc(-a+e,o-e,e,Math.PI/2,Math.PI,!1),r.lineTo(-a,-o+e),r.absarc(-a+e,-o+e,e,Math.PI,Math.PI*1.5,!1);for(let[l,c,h]of s)r.holes.push(di(h,l,c));return Nn(r,n,.03,14,.75)}var Yi=(i,t=[],e=.07)=>Ls(i,t,e,.012),Go=(i,t=.05,e=0)=>{let n=new tn;return n.absarc(0,0,i,0,Rn,!1),e&&n.holes.push(di(e)),Nn(n,t,Math.min(.012,t*.3),40,.75)},_c=(i,t,e=.05)=>Go(i,e,t),Lu=(i=.14,t=.022)=>{let e=new tn;return e.moveTo(-t,0),e.lineTo(t,0),e.lineTo(t,i),e.lineTo(-t,i),e.closePath(),Nn(e,.02,.004,2,0)};function Du(i=.95,t=1.25,e=.5,n=2.64){let s=new tn;return s.absarc(0,0,t,e,n,!1),s.absarc(0,0,i,n,e,!0),s.closePath(),Nn(s,.045,.008,40,.75)}var vc=(i=1.15)=>Yi([[0,0,.055],[-.2,0,.04],[i,0,.008]],[[0,0,.02]],.035),Uu=(i=.5,t=.06)=>_n([[0,0],[t*1.35,0],[t*1.35,.03],[t,.05],[t,i-.05],[t*1.35,i-.03],[t*1.35,i],[0,i]],20),Us=(i=.6,t=.028)=>_n([[0,0],[t*.6,0],[t,.03],[t,i-.03],[t*.6,i],[0,i]],12),Nu=()=>_n([[.058,0],[.108,0],[.112,.012],[.1,.03],[.07,.034],[.058,.026]],26),Fu=()=>_n([[.012,.022],[.03,.03],[.05,.031],[.062,.02],[.062,0],[0,0]],22),Ou=(i=.1)=>_n([[i*.42,0],[i,0],[i,.02],[i*.42,.02]],22);function Bu(i=.075){let t=i*.16,e=Math.asin(t/i),n=o=>{let l=new tn;return l.absarc(0,0,i,o>0?e:Math.PI+e,o>0?Math.PI-e:Rn-e,!1),l.closePath(),l},s=Nn([n(1),n(-1)],.045,.009,14,.75);s.translate(0,0,.032);let r=_n([[0,-.012],[i*.985,-.012],[i*.985,.012],[0,.012]],24),a=_n([[0,-.2],[i*.4,-.2],[i*.4,-.012],[0,-.012]],10);return Vo([s,r,a])}var zu=(i=.2)=>{let t=new tn,e=i/2;return t.moveTo(-e,-e),t.lineTo(e,-e),t.lineTo(e,e),t.lineTo(-e,e),t.closePath(),Nn(t,.07,.014,2,.3)},Vu=(i=.42)=>_n([[.03,.2],[i*.3,.195],[i*.62,.17],[i*.86,.11],[i,.02],[i*.99,0],[i*.93,.004],[i*.82,.085],[i*.6,.14],[i*.3,.165],[.03,.17]],48),Gu=()=>_n([[0,-.06],[.07,-.06],[.085,-.04],[.085,.04],[.07,.06],[0,.06]],20),ku=(i=.62)=>_n([[i-.06,0],[i+.045,0],[i+.06,.03],[i+.045,.085],[i-.045,.085],[i-.06,.05]],56),Hu=(i=.585)=>_n([[0,.05],[i*.5,.043],[i*.85,.026],[i,.008],[i,0],[0,0]],48),Wu=()=>Vo([Ur(30,{m:.03,grosor:.3,radios:0,eje:1e-4,bisel:.01}),_n([[0,-.75],[.045,-.75],[.045,-.15],[0,-.15]],12)]),Xu=(i=46)=>Ur(i,{grosor:.2,radios:4,eje:.07,bisel:.014});function yc(i=.08,t=.4,e=9,n=.007,s=0){let r=[],a=Math.ceil(e*28);for(let o=0;o<=a;o++){let l=o/a,c=l*e*Rn,h=i+(t-i)*l;r.push(new z(Math.cos(c)*h,Math.sin(c)*h,s*l))}return new xr(new _s(r),a*2,n,5,!1).toNonIndexed()}function qu(i=.16,t=1.2,e=7){let n=yc(i,t,e,.02);return n.scale(1,1,3.2),n}function Yu(i=.3,t=.3){let e=new rr(i,i,t,48,1,!0);return e.rotateZ(Math.PI/2),e.toNonIndexed()}var Zu=(i=.3,t=.3)=>{let e=_n([[.035,0],[i*.96,0],[i+.012,.012],[i+.012,.03],[i*.9,.034],[.035,.03]],40);e.rotateY(Math.PI/2);let n=e.clone();return n.rotateY(Math.PI),e.translate(t/2,0,0),n.translate(-t/2,0,0),Vo([e,n])};var Mc=Math.PI*2,be={pulido:0,cepillado:1,circular:2,arenado:3,perlado:4,azulado:5,negro:6,ginebra:7},oe={rodio:[.8,.81,.83],acero:[.56,.58,.62],rutenio:[.2,.205,.22],negro:[.03,.03,.034],negro2:[.1,.102,.11],azul:[.035,.085,.34],lat\u00F3n:[.7,.71,.74]},Ns=["ventas","clientes","operaciones","finanzas","direccion","motor","transmision","platina"],ft={placa:.06,a:.2,b:.335,pin:.27,puente:.56,alto:.62},ox=4.25;function Ju(i=!1){let t=[],e=new Map,n=[],s=[],r=[],a=(F,k)=>(e.has(F)||e.set(F,k()),F),o=0,l=0,c=0,h=(F,k={})=>{let ht={g:F,mat:k.mat||"metal",fin:k.fin??be.pulido,tono:k.tono||oe.acero,mod:k.mod??o,ord:k.ord??.5,x:l+(k.x||0),y:c+(k.y||0),z:k.z||0,rx:k.rx||0,ry:k.ry||0,rz:k.rz||0,k:k.k||0,fase:k.fase||0,tipo:k.tipo||"",dato:k.dato||null,e:k.e||1};return t.push(ht),ht},d=(F,k={})=>{let ht,vt,Rt=-1;if(k.de!==void 0){let Zt=n[k.de];if(k.coaxial)ht=Zt.x,vt=Zt.y,Rt=k.de;else{let ve=Zt.r+Ps(F)+.004;ht=Zt.x+Math.cos(k.ang)*ve,vt=Zt.y+Math.sin(k.ang)*ve}}else ht=l+k.x,vt=c+k.y;let lt=n.length,Nt=!!k.pin,Vt=k.z??(Nt?ft.pin:ft.a),de=k.geo||(Nt?`pinon${F}`:`rueda${F}${k.sierra?"s":""}`);a(de,()=>k.hacer?k.hacer():Nt?Eu(F,.22):Ur(F,{sierra:k.sierra}));let mt=h(de,{fin:Nt?be.pulido:be.circular,tono:k.tono||(Nt?oe.acero:oe.rodio),z:Vt,ord:k.ord??(Nt?.34:.3+(Vt>ft.a?.08:0)),tipo:"rueda"});if(mt.x=ht,mt.y=vt,n.push({i:lt,N:F,x:ht,y:vt,z:Vt,r:Ps(F),k:null,fase:0,pieza:mt,mod:mt.mod,pin:Nt,libre:!!k.libre}),k.de!==void 0&&s.push([k.de,lt,Rt>=0?"coaxial":"engrana"]),!Nt&&F>=26&&!k.sinCubo){let Zt=h(a("cubo",()=>Go(.085,.03)),{z:Vt+.052,fin:be.pulido,tono:oe.acero,ord:(k.ord??.38)+.03,tipo:"conRueda",dato:{rueda:lt}});Zt.x=ht,Zt.y=vt}return lt},u=[],f=(F,k,ht,vt=0)=>{let Rt=n[F],lt=Ps(k),Nt=Rt.r+lt+.004;for(let Vt=0;Vt<40;Vt++){let de=vt+(Vt%2?-1:1)*Math.ceil(Vt/2)*.16,mt=Rt.x+Math.cos(de)*Nt,Zt=Rt.y+Math.sin(de)*Nt;if(!(Math.abs(mt-l)>1.92-lt*.75||Math.abs(Zt-c)>1.92-lt*.75)&&!n.some(ve=>ve.i!==F&&ve.mod===o&&Math.abs(ve.z-ht)<.12&&Math.hypot(ve.x-mt,ve.y-Zt)<ve.r+lt+.07)&&!n.some(ve=>ve.mod===o&&Math.hypot(ve.x-mt,ve.y-Zt)<.2)&&!u.some(ve=>Math.hypot(ve[0]-mt,ve[1]-Zt)<ve[2]+lt))return d(k,{de:F,ang:de,z:ht})}return-1},x=F=>{let k=[];for(let[ht,vt,Rt,lt]of F){let Nt=ht<0?k[-ht-1]:ht;if(Nt===void 0)continue;let Vt=f(Nt,vt,Rt,lt||0);Vt>=0&&k.push(Vt)}return k},S=(F,k,ht=.15)=>n.every(vt=>vt.mod!==o||Math.hypot(vt.x-F,vt.y-k)>vt.r+ht+.07)&&u.every(vt=>Math.hypot(vt[0]-F,vt[1]-k)>vt[2]*.8+.1),g=(F,k=null,ht=1.74)=>{let vt=null,Rt=1e9;for(let lt=-ht;lt<=ht;lt+=.12)for(let Nt=-ht;Nt<=ht;Nt+=.12){let Vt=l+lt,de=c+Nt;if(!S(Vt,de)||m.some(Zt=>Math.hypot(Zt[0]-Vt,Zt[1]-de)<.44)||k&&Math.hypot(k[0]-Vt,k[1]-de)<.95)continue;let mt=Math.hypot(F[0]-Vt,F[1]-de);mt<Rt&&(Rt=mt,vt=[Vt,de])}return vt||(r.push(`sin apoyo en m\xF3dulo ${o}`),vt=[F[0],F[1]]),m.push(vt),vt},m=[],A=(F,k,ht,vt=.92,Rt=1)=>h(a("tornillo",()=>Bu()),{x:F-l,y:k-c,z:ht,fin:be.azulado,tono:oe.azul,ord:vt,tipo:"tornillo",rz:(F*7.3+k*3.1)%Mc,e:Rt}),E=(F,k,ht,vt=.86)=>{h(a("engaste",Nu),{x:F-l,y:k-c,z:ht,fin:be.pulido,tono:oe.rodio,ord:vt}),h(a("zafiro",Fu),{x:F-l,y:k-c,z:ht+.004,mat:"joya",ord:vt+.02})},v=(F,k,ht=ft.puente-.05-ft.placa)=>h(a(`pilar${ht.toFixed(2)}`,()=>Uu(ht)),{x:F-l,y:k-c,z:ft.placa,fin:be.pulido,tono:oe.acero,ord:.16}),b=0,M=(F,k={})=>{let ht=F.map(mt=>n[mt]),vt=[];vt.push(g([ht[0].x+(k.dx0||0),ht[0].y+(k.dy0||0)])),k.unPie||vt.push(g([ht[ht.length-1].x+(k.dx1||0),ht[ht.length-1].y+(k.dy1||0)],vt[0]));let Rt=ht.reduce((mt,Zt)=>mt+Zt.x,vt.reduce((mt,Zt)=>mt+Zt[0],0))/(ht.length+vt.length),lt=ht.reduce((mt,Zt)=>mt+Zt.y,vt.reduce((mt,Zt)=>mt+Zt[1],0))/(ht.length+vt.length),Nt=[...ht.map(mt=>[mt.x-Rt,mt.y-lt,.14]),...vt.map(mt=>[mt[0]-Rt,mt[1]-lt,.115])],Vt=[...ht.map(mt=>[mt.x-Rt,mt.y-lt,.062]),...vt.map(mt=>[mt[0]-Rt,mt[1]-lt,.034])],de=`puente${b++}${i?"v":"h"}`;a(de,()=>Ls(Nt,Vt,.1,.022)),h(de,{x:Rt-l,y:lt-c,z:ft.puente,fin:k.fin??be.ginebra,tono:k.tono||oe.acero,ord:.7});for(let mt of ht)E(mt.x,mt.y,ft.puente+.022),h(a("eje",()=>Us(ft.puente-ft.placa+.02)),{x:mt.x-l,y:mt.y-c,z:ft.placa,tono:oe.acero,ord:.22,tipo:"eje",dato:{rueda:mt.i}});for(let mt of vt)v(mt[0],mt[1]),A(mt[0],mt[1],ft.puente+.05)},C=(F={})=>{let k=`placa${F.w||3.9}x${F.h||3.9}`;a(k,()=>Ds(F.w||3.9,F.h||3.9,.42,.06)),h(k,{z:.03,fin:be.arenado,tono:oe.rutenio,ord:.06}).texto=o+1;for(let[ht,vt]of[[-1,-1],[1,-1],[1,1],[-1,1]])A(l+ht*1.72,c+vt*1.72,ft.placa+.012,.12,.8)},_=ox,T=i?{ventas:[-_/2,_],clientes:[_/2,_],motor:[-_/2,0],finanzas:[_/2,0],operaciones:[-_/2,-_],direccion:[_/2,-_]}:{ventas:[-_,_/2],motor:[0,_/2],clientes:[_,_/2],operaciones:[-_,-_/2],finanzas:[0,-_/2],direccion:[_,-_/2]},R=F=>{o=Ns.indexOf(F),[l,c]=T[F],m=[],u=[]},I=(F,k,ht)=>u.push([l+F,c+k,ht]),O={vertical:i,modulos:{},tambores:[],campos:null},G=F=>{O.modulos[F]={x:l,y:c,r:2.1}};o=7,l=0,c=0;let L=i?_*2+.55:_*3+.55,V=i?_*3+.55:_*2+.55;h(a("platina",()=>Ds(L,V,.7,.26)),{z:-.13,fin:be.perlado,tono:oe.negro2,ord:0}),O.platina={w:L,h:V};for(let[F,k]of[[-1,-1],[1,-1],[1,1],[-1,1]])A(F*(L/2-.34),k*(V/2-.34),.012,.05,1.5);h(a("corona",Wu),{x:L/2+.14,y:V*.24,z:ft.a,ry:Math.PI/2,fin:be.pulido,tono:oe.acero,ord:.8,tipo:"corona"}),R("motor"),C();let q=d(62,{x:-.55,y:.3,z:ft.a+.02,geo:"barrilete",hacer:()=>Xu(62),tono:oe.rodio,ord:.26});h(a("muelleReal",()=>qu(.2,.98,6.5)),{x:-.55,y:.3,z:ft.a+.14,fin:be.azulado,tono:oe.azul,ord:.5,tipo:"muelle"}),h(a("aroBarrilete",()=>_c(1.12,1,.05)),{x:-.55,y:.3,z:ft.a+.15,fin:be.cepillado,tono:oe.rodio,ord:.52,tipo:"conRueda",dato:{rueda:q}}),h(a("pixel",()=>zu(.24)),{x:-.55,y:.3,z:ft.a+.2,fin:be.azulado,tono:oe.azul,ord:.96,tipo:"pixel"}),h(a("ejeGordo",()=>Us(ft.a+.2,.07)),{x:-.55,y:.3,z:ft.placa,ord:.2});let Y=d(14,{de:q,ang:-.32,pin:!0}),rt=d(40,{de:Y,coaxial:!0,z:ft.b}),Z=d(12,{de:rt,ang:-2.05,pin:!0}),tt=d(20,{de:Z,coaxial:!0,z:ft.a,sierra:!0,tono:oe.acero}),Q=-.62,Dt=-1.32;h(a("volante",()=>Cu(.5)),{x:Q,y:Dt,z:ft.b+.1,fin:be.pulido,tono:oe.rodio,ord:.6,tipo:"volante"}),h(a("espiral",()=>yc(.05,.3,9,.006)),{x:Q,y:Dt,z:ft.b+.17,fin:be.azulado,tono:oe.azul,ord:.64,tipo:"volante",dato:{amp:.35}}),h(a("ancora",()=>Yi([[0,0,.06],[.42,.1,.035],[.42,-.1,.035],[-.3,0,.03]],[[0,0,.022]],.05)),{x:n[tt].x-.62,y:n[tt].y+.12,z:ft.b-.02,rz:.2,fin:be.pulido,tono:oe.acero,ord:.58,tipo:"ancora"}),h(a("gallo",()=>Ls([[0,0,.16],[.95,.42,.13]],[[0,0,.062],[.95,.42,.034]],.1,.022)),{x:Q,y:Dt,z:ft.alto+.04,fin:be.ginebra,tono:oe.acero,ord:.72}),E(l+Q,c+Dt,ft.alto+.062),A(l+Q+.95,c+Dt+.42,ft.alto+.09),v(l+Q+.95,c+Dt+.42,ft.alto-.01-ft.placa),m.push([l+Q+.95,c+Dt+.42]),I(Q,Dt,.62);let It=x([[rt,24,ft.b,.9],[-1,30,ft.b,1.2],[q,22,ft.a+.02,2.4],[-3,34,ft.a+.02,2]]);M([Y,Z],{dx0:.5,dy0:.5,dx1:.4,dy1:-.5}),It.length>1&&M(It.slice(0,2),{dx0:.4,dy0:.6,dx1:.5,dy1:.5}),It.length>3&&M(It.slice(2,4),{dx0:-.5,dy0:.5,dx1:-.5,dy1:-.5}),G("motor"),R("ventas"),C();let ae=d(58,{x:-.5,y:.45}),ue=d(14,{de:ae,coaxial:!0,pin:!0}),se=d(44,{de:ue,ang:-.62,z:ft.b}),$=d(12,{de:se,coaxial:!0,pin:!0}),st=d(30,{de:$,ang:-2.2,z:ft.a}),Tt=d(36,{de:ae,coaxial:!0,z:ft.b+.1,sierra:!0,tono:oe.acero,ord:.5});h(a("trinquete",()=>Yi([[0,0,.07],[.5,.06,.03],[.44,-.12,.02]],[[0,0,.025]],.05)),{x:n[Tt].x+1.02-l,y:n[Tt].y+.86-c,z:ft.b+.1,rz:-2.5,fin:be.pulido,tono:oe.acero,ord:.62,tipo:"trinquete",dato:{N:36,rueda:Tt}}),A(n[Tt].x+1.02,n[Tt].y+.86,ft.b+.15,.9,.7);let Jt=x([[st,24,ft.a,.3],[-1,34,ft.a,.9],[se,22,ft.b,.6],[-3,28,ft.b,1.2],[ae,22,ft.a,2.6]]);M([ae],{dx0:-1.2,dy0:1.2,unPie:!0}),M([se,st],{dx0:1,dy0:.6,dx1:-1,dy1:-.6}),Jt.length>1&&M(Jt.slice(0,2),{dx0:.5,dy0:-.5,dx1:.6,dy1:.4}),Jt.length>3&&M(Jt.slice(2,4),{dx0:.5,dy0:.5,dx1:.5,dy1:.6}),G("ventas"),R("clientes"),C();let wt=d(46,{x:-.75,y:-.75}),jt=d(14,{de:wt,coaxial:!0,pin:!0}),te=d(34,{de:jt,ang:.15,z:ft.b}),it=d(24,{de:te,ang:-1.1,z:ft.b});h(a("estrella",()=>Ru(8,.4)),{x:n[wt].x-l,y:n[wt].y-c,z:ft.b+.12,fin:be.pulido,tono:oe.acero,ord:.5,tipo:"conRueda",dato:{rueda:wt}});let ot=.85,ut=.75;h(a("campana",()=>Vu(.52)),{x:ot,y:ut,z:ft.a-.05,fin:be.pulido,tono:oe.rodio,ord:.55}),A(l+ot,c+ut,ft.a+.15,.9,1.1);let dt=-.95,pt=.95,Kt=Math.hypot(ot-.56-dt,ut-.1-pt),Yt=Math.atan2(ut-.1-pt,ot-.56-dt);h(a("martillo",()=>Yi([[0,0,.08],[Kt,0,.045],[-.34,-.2,.035]],[[0,0,.026]],.06)),{x:dt,y:pt,z:ft.b+.12,rz:Yt,fin:be.cepillado,tono:oe.acero,ord:.6,tipo:"martillo",dato:{largo:Kt,rueda:wt}}),h(a("cabezaMartillo",Gu),{x:dt,y:pt,z:ft.b+.12,rz:Yt,fin:be.pulido,tono:oe.rodio,ord:.62,tipo:"martillo",dato:{largo:Kt,cabeza:!0,rueda:wt}}),A(l+dt,c+pt,ft.b+.17,.9,.8),m.push([l+dt,c+pt]),I(ot,ut,.62),I(dt,pt,.2),I((dt+ot)/2,(pt+ut)/2,.3);let $t=x([[it,30,ft.a,-.4],[-1,22,ft.a,.6],[wt,24,ft.a,2.2],[-3,28,ft.a,1.6]]);M([wt],{dx0:-.9,dy0:-.9,unPie:!0}),M([te,it],{dx0:.9,dy0:.5,dx1:.8,dy1:-.8}),$t.length>1&&M($t.slice(0,2),{dx0:.5,dy0:-.5,dx1:.5,dy1:.5}),$t.length>3&&M($t.slice(2,4),{dx0:-.5,dy0:.5,dx1:-.5,dy1:-.5}),G("clientes"),R("operaciones"),C();let Qt=d(52,{x:-.72,y:.62}),P=d(14,{de:Qt,coaxial:!0,pin:!0}),Me=d(36,{de:P,ang:.42,z:ft.b}),ne=d(24,{de:Me,ang:-.9,z:ft.b}),w=n[Qt].x-l,p=n[Qt].y-c,B=ft.b+.13,U=-1.35;h(a("leva",()=>Iu(.3,.68)),{x:w,y:p,z:B,fin:be.cepillado,tono:oe.acero,ord:.5,tipo:"conRueda",dato:{rueda:Qt}});let K={rueda:Qt,ang:U,r0:.3,r1:.68},_t=w+Math.cos(U)*.3,Mt=p+Math.sin(U)*.3,j=_t+1.5,nt=Mt-.25;h(a("seguidor",()=>Yi([[0,0,.08],[-Math.hypot(1.5,.25),0,.05]],[[0,0,.026]],.06)),{x:j,y:nt,z:B,rz:Math.atan2(.25,1.5)*-1+0,fin:be.cepillado,tono:oe.rodio,ord:.6,tipo:"seguidor",dato:{leva:K,largo:Math.hypot(1.5,.25)}}),A(l+j,c+nt,B+.05,.9,.8),m.push([l+j,c+nt]);let At=-1.2,Ot=d(22,{x:.55,y:At+Ps(22)+.012,z:ft.a,libre:!0,tono:oe.rodio});n[Ot].k=0,n[Ot].pieza.tipo="pinonLibre",n[Ot].pieza.dato={leva:K,r:Ps(22)},h(a("cremallera",()=>Pu(2.3)),{x:.05,y:At,z:ft.a,fin:be.cepillado,tono:oe.rodio,ord:.45,tipo:"cremallera",dato:{leva:K}});for(let F of[-.6,.7])h(a("guia",()=>Go(.035,.16)),{x:F,y:At-.1,z:ft.a+.03,tono:oe.acero,ord:.5}),h(a("arandela",()=>Ou(.09)),{x:F,y:At-.1,z:ft.a+.05,tono:oe.acero,ord:.52}),m.push([l+F,c+At-.1]);for(let F of[-.95,-.35,.25,.85,1.3])I(F,At-.02,.36);I(j,nt,.25),I((j+_t)/2,(nt+Mt)/2,.3);let Et=x([[ne,30,ft.a,.2],[-1,22,ft.a,1],[Qt,24,ft.a,3],[-3,30,ft.a,3.6]]);M([Qt],{dx0:-1,dy0:1,unPie:!0}),M([Me,ne],{dx0:.6,dy0:.9,dx1:1,dy1:-.2}),Et.length>1&&M(Et.slice(0,2),{dx0:.5,dy0:.5,dx1:.5,dy1:-.5}),Et.length>3&&M(Et.slice(2,4),{dx0:-.5,dy0:.5,dx1:-.5,dy1:-.5}),G("operaciones"),R("finanzas"),C();let St=d(40,{x:-1.15,y:1}),Ht=d(12,{de:St,coaxial:!0,pin:!0}),Wt=d(28,{de:Ht,ang:-1.45,z:ft.b}),Bt=.95,D=.3,gt=.3,et=ft.placa+D+.09;for(let F=0;F<6;F++){let k=-.42+F*(gt+.045);O.tambores.push(h(a("tambor",()=>Yu(D,gt)),{x:k,y:Bt,z:et,mat:"tambor",ord:.55+F*.012,tipo:"tambor",dato:{k:F}})),h(a("tapaTambor",()=>Zu(D,gt)),{x:k,y:Bt,z:et,fin:be.cepillado,tono:oe.rodio,ord:.54+F*.012,tipo:"tambor",dato:{k:F,tapa:!0}})}for(let F of[-.68,1.6])h(a("soporte",()=>Ls([[.3,0,.12],[-.3,0,.12]],[[-.1,0,.034]],.08,.018)),{x:F,y:Bt,z:et-.1,ry:Math.PI/2,fin:be.cepillado,tono:oe.rutenio,ord:.5});h(a("ejeTambor",()=>{let F=Us(2.44,.03);return F.rotateY(Math.PI/2),F}),{x:-.76,y:Bt,z:et,tono:oe.acero,ord:.48});let xt=.42,bt=-.92;h(a("bandeja",()=>Ds(1.24,1.66,.1,.05)),{x:xt,y:bt,z:ft.placa+.03,fin:be.negro,tono:oe.negro,ord:.3}),O.documento={x:l+xt,y:c+bt,z:ft.placa+.066,w:1.06,h:1.06*544/384},O.lupa=h(a("lupa",()=>ku(.46)),{x:xt,y:bt,z:ft.puente-.05,fin:be.pulido,tono:oe.rodio,ord:.8,tipo:"lupa"}),O.lente=h(a("lente",()=>Hu(.4)),{x:xt,y:bt,z:ft.puente-.03,mat:"cristal",ord:.82,tipo:"lupa"}),h(a("brazoLupa",()=>Yi([[0,0,.08],[1.25,0,.05]],[[0,0,.03]],.06)),{x:xt-1.25-.46,y:bt,z:ft.puente-.02,fin:be.cepillado,tono:oe.acero,ord:.78,tipo:"lupa",dato:{brazo:!0}}),m.push([l+xt,c+bt],[l+xt-.5,c+bt-.6],[l+xt+.5,c+bt+.6],[l+xt-.5,c+bt+.6],[l+xt+.5,c+bt-.6]);for(let F=0;F<7;F++)I(-.6+F*.36,Bt,.42);I(xt,bt,.98),I(xt-1,bt,.3);let ct=x([[Wt,22,ft.a,-1.6],[-1,30,ft.a,-1.2],[-2,22,ft.b,-1],[St,22,ft.b,2.6]]);M([St,Wt],{dx0:-.6,dy0:.7,dx1:-.6,dy1:-1}),ct.length>1&&M(ct.slice(0,2),{dx0:-.5,dy0:-.5,dx1:.3,dy1:-.6}),G("finanzas"),R("direccion"),C();let Xt=d(36,{x:-1,y:1.05}),zt=d(12,{de:Xt,coaxial:!0,pin:!0}),Ae=d(30,{de:zt,ang:-.1,z:ft.b}),ye=d(22,{de:Ae,ang:.2,z:ft.b}),ze=0,Ue=-1.15;h(a("sector",()=>Du(1.02,1.36,.42,2.72)),{x:ze,y:Ue,z:ft.placa+.04,fin:be.arenado,tono:oe.negro,ord:.3});for(let F=0;F<=20;F++){let k=.5+F/20*2.14,ht=F%5===0;h(a(ht?"marcaL":"marca",()=>Lu(ht?.2:.11,ht?.014:.008)),{x:ze+Math.cos(k)*(ht?1.09:1.15),y:Ue+Math.sin(k)*(ht?1.09:1.15),z:ft.placa+.07,rz:k-Math.PI/2,tono:oe.rodio,ord:.4+F*.004})}O.aguja=h(a("aguja",()=>vc(1.22)),{x:ze,y:Ue,z:ft.a+.1,rz:2.64,fin:be.azulado,tono:oe.azul,ord:.85,tipo:"aguja"}),h(a("ejeAguja",()=>Us(ft.a+.14,.035)),{x:ze,y:Ue,z:ft.placa,ord:.3}),E(l+ze,c+Ue,ft.a+.12,.9);for(let F of[-1.35,1.35])h(a("subesfera",()=>_c(.36,.3,.04)),{x:F,y:Ue+.1,z:ft.placa+.04,fin:be.cepillado,tono:oe.rodio,ord:.35}),h(a("agujita",()=>vc(.27)),{x:F,y:Ue+.1,z:ft.placa+.1,k:F<0?1.6:-.9,tono:oe.rodio,ord:.86,tipo:"giro"}),m.push([l+F,c+Ue+.1]);m.push([l+ze,c+Ue]),I(ze,Ue,1.45),I(-1.35,Ue+.1,.42),I(1.35,Ue+.1,.42);let Li=x([[ye,28,ft.a,.3],[-1,22,ft.a,.9],[Xt,24,ft.a,1.6],[Ae,22,ft.a,1.5]]);M([Xt,Ae,ye],{dx0:-.4,dy0:-.7,dx1:.5,dy1:-.6}),Li.length>1&&M(Li.slice(0,2),{dx0:.5,dy0:.5,dx1:.5,dy1:-.4}),G("direccion"),o=6,l=0,c=0;let kn=i?[["motor","ventas"],["motor","finanzas"],["motor","operaciones"],["ventas","clientes"],["finanzas","direccion"]]:[["motor","ventas"],["motor","clientes"],["motor","finanzas"],["ventas","operaciones"],["clientes","direccion"]];O.transmisiones=[];for(let[F,k]of kn){let ht=n.filter(De=>De.mod===Ns.indexOf(F)&&!De.pin&&De.z<=ft.b+.01),vt=n.filter(De=>De.mod===Ns.indexOf(k)&&!De.pin&&De.z<=ft.b+.01),Rt=null,lt=1e9;for(let De of ht)for(let je of vt){let y=Math.hypot(De.x-je.x,De.y-je.y)-De.r-je.r;y>.8&&y<lt&&(lt=y,Rt=[De,je])}let[Nt,Vt]=Rt,de=lt>2.1?2:1,mt=lt/(2*de),Zt=Math.max(14,Math.round(2*mt/Dr)),ve=(Vt.x-Nt.x)/Math.hypot(Vt.x-Nt.x,Vt.y-Nt.y),ke=(Vt.y-Nt.y)/Math.hypot(Vt.x-Nt.x,Vt.y-Nt.y),Hn=Nt.i,Wn=[];for(let De=0;De<de;De++){let je=Nt.r+mt+De*2*mt,y=Nt.x+ve*je,N=Nt.y+ke*je,X=d(Zt,{x:y,y:N,z:De%2?Vt.z:Nt.z,tono:oe.azul,ord:.4+De*.05});n[X].pieza.fin=be.azulado,s.push([Hn,X,"engrana"]),Hn=X,Wn.push(X),h(a("puenteLoca",()=>Ls([[0,0,.2],[.42,.3,.14],[-.42,-.3,.14]],[[0,0,.062],[.42,.3,.034],[-.42,-.3,.034]],.09,.022)),{x:y,y:N,z:ft.puente+.04,rz:Math.atan2(ke,ve)+.9,fin:be.pulido,tono:oe.negro,ord:.75}),E(y,N,ft.puente+.058,.9),h(a("eje",()=>Us(ft.puente-ft.placa+.02)),{x:y,y:N,z:ft.placa,ord:.3});let W=Math.cos(Math.atan2(ke,ve)+.9),H=Math.sin(Math.atan2(ke,ve)+.9);for(let Ct of[1,-1])A(y+Ct*(.42*W-.3*H),N+Ct*(.42*H+.3*W),ft.puente+.085,.95,.85)}s.push([Hn,Vt.i,"engrana"]),O.transmisiones.push({de:F,a:k,x:(Nt.x+Vt.x)/2,y:(Nt.y+Vt.y)/2,locas:Wn})}let J=(F,k,ht)=>{n[F].k=k,n[F].fase=ht};J(q,1,0);let at=[q];for(;at.length;){let F=at.shift(),k=n[F];for(let[ht,vt,Rt]of s){let lt=ht===F?vt:vt===F?ht:-1;if(lt<0||n[lt].k!==null)continue;let Nt=n[lt];if(Rt==="coaxial")J(lt,k.k,k.fase);else{let Vt=Math.atan2(Nt.y-k.y,Nt.x-k.x),de=Mc/k.N,mt=Mc/Nt.N,Zt=((Vt-k.fase)%de+de)%de/de;J(lt,-k.k*k.N/Nt.N,Vt+Math.PI-(.5-Zt)*mt)}at.push(lt)}}for(let F of n)F.k===null&&!F.libre&&r.push(`rueda suelta ${F.i} (m\xF3dulo ${F.mod})`),F.k=F.k||0,F.pieza.k=F.k,F.pieza.fase=F.fase;for(let F of t)if(F.dato&&F.dato.rueda!==void 0){let k=n[F.dato.rueda];F.k=k.k,F.tipo!=="trinquete"&&F.tipo!=="martillo"&&(F.fase=k.fase),F.dato.kr=k.k,F.dato.fr=k.fase,F.dato.N=F.dato.N||k.N,F.dato.rr=k.r}for(let F of t)if(F.dato&&F.dato.leva){let k=n[F.dato.leva.rueda];F.dato.leva.k0=k.k,F.dato.leva.f0=k.fase}return O.ruedas=n.map(F=>({x:F.x,y:F.y,z:F.z,r:F.r,N:F.N,k:F.k,mod:F.mod})),O.z=ft,O.avisos=r,O.celda=_,{piezas:t,geos:e,info:O}}var lx="varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",cx=`
uniform sampler2D tD; uniform vec2 uPx; uniform float uUmbral; varying vec2 vUv;
void main() {
  vec3 c = (texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb) * 0.25;
  c = min(c, vec3(24.0));
  float l = max(c.r, max(c.g, c.b)), k = max(0.0, l - uUmbral); k = k * k / (k + 0.6);
  gl_FragColor = vec4(c * k / max(l, 1e-4), 1.0);
}`,hx=`
uniform sampler2D tD; uniform vec2 uPx; varying vec2 vUv;
void main() {
  vec3 a = texture2D(tD, vUv).rgb * 4.0;
  a += texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb;
  gl_FragColor = vec4(a / 8.0, 1.0);
}`,ux=`
uniform sampler2D tD; uniform vec2 uPx; uniform float uFuerza; varying vec2 vUv;
void main() {
  vec3 a = texture2D(tD, vUv + uPx * vec2(-1., 0.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 0.)).rgb + texture2D(tD, vUv + uPx * vec2(0., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(0., 1.)).rgb;
  a = a * 2.0 + texture2D(tD, vUv + uPx * vec2(-1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., -1.)).rgb + texture2D(tD, vUv + uPx * vec2(-1., 1.)).rgb + texture2D(tD, vUv + uPx * vec2(1., 1.)).rgb;
  gl_FragColor = vec4(a / 12.0 * uFuerza, 1.0);
}`,$u=i=>`
uniform sampler2D tEscena, tProf, tHalo; uniform vec2 uPx; uniform float uCerca, uLejos, uFoco, uApertura, uMaxDesenfoque, uHalo, uExposicion, uVineta, uGrano, uTiempo, uFundido, uAberracion; uniform vec3 uTinte;
varying vec2 vUv;
float zVista(vec2 uv) { float d = texture2D(tProf, uv).x; return uCerca * uLejos / (uLejos - d * (uLejos - uCerca)); }
float coc(float z) { return clamp(uApertura * abs(z - uFoco) / z, 0.0, 1.0) * uMaxDesenfoque; }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float ruido(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
void main() {
  float z0 = zVista(vUv), c0 = coc(z0);
  vec3 col = min(texture2D(tEscena, vUv).rgb, vec3(12.0));
  ${i>0?`
  float giro = ruido(gl_FragCoord.xy + 17.0) * 6.2831, tot = 1.0;
  // recogida en disco: una muestra cuenta si su propio c\xEDrculo de confusi\xF3n llega hasta el centro
  for (int i = 0; i < ${i}; i++) {
    float r = sqrt((float(i) + 0.5) / ${i}.0) * uMaxDesenfoque, a = float(i) * 2.39996 + giro;
    vec2 uv = vUv + vec2(cos(a), sin(a)) * r * uPx;
    float zi = zVista(uv), ci = coc(zi);
    if (zi > z0) ci = clamp(ci, 0.0, c0 * 2.0);
    float m = smoothstep(r - 0.5, r + 0.5, ci);
    col += mix(col / tot, min(textureLod(tEscena, uv, log2(max(1.0, ci * ${(Math.sqrt(3.1416/Math.max(1,i))*.55).toFixed(3)}))).rgb, vec3(7.0)), m); tot += 1.0;
  }
  col /= tot;`:""}
  if (uAberracion > 0.0) { vec2 d = (vUv - 0.5) * uAberracion * dot(vUv - 0.5, vUv - 0.5); col.r = mix(col.r, texture2D(tEscena, vUv + d).r, 0.6); col.b = mix(col.b, texture2D(tEscena, vUv - d).b, 0.6); }
  col += texture2D(tHalo, vUv).rgb * uHalo;
  vec2 q = vUv - 0.5; col *= mix(1.0, smoothstep(0.95, 0.25, length(q * vec2(1.0, 1.15))), uVineta);
  col = aces(col * uExposicion) * uTinte;
  col = pow(col, vec3(1.0 / 2.2));
  col += (ruido(gl_FragCoord.xy + fract(uTiempo) * 91.7) - 0.5) * uGrano;
  gl_FragColor = vec4(col * uFundido, 1.0);
}`;function Ku(i,{muestras:t=4,tomas:e=40,nivelesHalo:n=5}={}){let s=new qe;s.setAttribute("position",new Re([-1,-1,0,3,-1,0,-1,3,0],3));let r=new Ei(-1,1,1,-1,0,1),a=new vi,o=new Ge(s,null);o.frustumCulled=!1,a.add(o);let l=(C,_,T=An)=>new pn({vertexShader:lx,fragmentShader:C,uniforms:_,depthTest:!1,depthWrite:!1,blending:T,transparent:T!==An}),h=i.extensions.has("EXT_color_buffer_float")||i.extensions.has("EXT_color_buffer_half_float")?Cn:cn,d=null,u=[],f=0,x=0,S=l(cx,{tD:{value:null},uPx:{value:new yt},uUmbral:{value:1.5}}),g=l(hx,{tD:{value:null},uPx:{value:new yt}}),m=l(ux,{tD:{value:null},uPx:{value:new yt},uFuerza:{value:1}},Mr),A={tEscena:{value:null},tProf:{value:null},tHalo:{value:null},uPx:{value:new yt},uCerca:{value:.1},uLejos:{value:100},uFoco:{value:10},uApertura:{value:0},uMaxDesenfoque:{value:18},uHalo:{value:.5},uExposicion:{value:1},uVineta:{value:.5},uGrano:{value:.035},uTiempo:{value:0},uFundido:{value:1},uAberracion:{value:0},uTinte:{value:[1,1,1]}},E=l($u(e),A),v=e;function b(C,_){if(C===f&&_===x)return;f=C,x=_,d&&(d.dispose(),u.forEach(O=>O.dispose()));let T=new Kn(C,_);T.type=En,T.minFilter=T.magFilter=We,d=new Qe(C,_,{type:h,format:mn,minFilter:jn,magFilter:Ve,generateMipmaps:!0,samples:t,depthBuffer:!0,depthTexture:T,stencilBuffer:!1}),u=[];let R=Math.max(2,C>>1),I=Math.max(2,_>>1);for(let O=0;O<n&&R>8&&I>8;O++)u.push(new Qe(R,I,{type:h,format:mn,minFilter:Ve,magFilter:Ve,depthBuffer:!1})),R=Math.max(2,R>>1),I=Math.max(2,I>>1)}let M=(C,_)=>{o.material=C,i.setRenderTarget(_),i.render(a,r)};return{U:A,medir:b,get destino(){return d},tomas(C){C!==v&&(v=C,E.dispose(),E=l($u(C),A))},revelar(C,_){let T=i.autoClear;i.autoClear=!0,S.uniforms.tD.value=d.texture,S.uniforms.uPx.value.set(.5/f,.5/x),M(S,u[0]);for(let R=1;R<u.length;R++)g.uniforms.tD.value=u[R-1].texture,g.uniforms.uPx.value.set(1/u[R-1].width,1/u[R-1].height),M(g,u[R]);i.autoClear=!1;for(let R=u.length-1;R>0;R--)m.uniforms.tD.value=u[R].texture,m.uniforms.uPx.value.set(1/u[R].width,1/u[R].height),M(m,u[R-1]);i.autoClear=!0,A.tEscena.value=d.texture,A.tProf.value=d.depthTexture,A.tHalo.value=u[0].texture,A.uPx.value.set(1/f,1/x),A.uCerca.value=C.near,A.uLejos.value=C.far,A.uTiempo.value=_,M(E,null),i.autoClear=T},liberar(){d&&d.dispose(),u.forEach(C=>C.dispose()),[S,g,m,E].forEach(C=>C.dispose()),s.dispose()}}}var ju={es:{factura:"FACTURA",total:"TOTAL",base:"Base imponible",iva:"IVA 21 %",num:"N.\xBA F-2026/0412",vence:"Vence 28/10/2026",concepto:"Concepto",imp:"Importe"},en:{factura:"INVOICE",total:"TOTAL",base:"Net amount",iva:"VAT 21%",num:"No. F-2026/0412",vence:"Due 28/10/2026",concepto:"Item",imp:"Amount"}},dx="Suministros Arce, S.L.",fx={num:[.742,.912],fecha:[.802,.879],prov:[.336,.79],base:[.802,.324],iva:[.82,.279],total:[.76,.2],vence:[.247,.197]};function Sc(i="es",t=2,e={},n=null){let s=Math.round(384*t),r=Math.round(544*t),a=ju[i]||ju.es,o={base:i==="en"?"\u20AC1,240.00":"1.240,00 \u20AC",iva:i==="en"?"\u20AC260.40":"260,40 \u20AC",total:i==="en"?"\u20AC1,500.40":"1.500,40 \u20AC",lineas:["212,00","486,50","318,00","223,50"],...e},l=n?n.lienzo:document.createElement("canvas");l.width=s,l.height=r;let c=n?n.mascara:document.createElement("canvas");c.width=Math.round(s/2),c.height=Math.round(r/2);let h=l.getContext("2d"),d=c.getContext("2d");d.fillStyle="#000",d.fillRect(0,0,c.width,c.height);let u=b=>b*t,f=34,x=384-f,S=(b,M=500,C=!1)=>`${M} ${b*t}px ${C?'"Martian Mono", ui-monospace, Menlo, monospace':'"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif'}`;h.fillStyle="#f1f0ec",h.fillRect(0,0,s,r);let g=(b=1)=>`rgba(20,20,22,${b})`,m=(b,M,C,_,T=.55)=>{h.fillStyle=g(T),h.fillRect(u(b),u(M),u(C),u(_))},A=(b,M,C,_=.25)=>{h.fillStyle=g(_),h.fillRect(u(b),u(M),u(C),Math.max(1,u(1)))},E=(b,M,C,_,T,R=.92,I=!1,O="left")=>{h.font=S(_,T,I),h.fillStyle=g(R),h.textAlign=O,h.textBaseline="alphabetic",h.fillText(b,u(M),u(C))},v=(b,M,C,_)=>{d.fillStyle="#fff",d.fillRect(b*t/2,M*t/2,C*t/2,_*t/2)};return m(f,38,34,34,.9),E(a.factura,f+46,64,26,800),E(a.num,x,52,11,500,.8,!0,"right"),E("28/09/2026",x,70,11,500,.8,!0,"right"),v(x-132,40,134,16),v(x-86,58,88,16),E(dx,f,118,15,700),v(f-3,102,196,22),m(f,130,150,5,.35),m(f,141,96,5,.35),A(f,176,316,.6),E(a.concepto,f,196,10,600,.6,!0),E(a.imp,x,196,10,600,.6,!0,"right"),A(f,206,316,.3),[[o.lineas[0],150],[o.lineas[1],190],[o.lineas[2],170],[o.lineas[3],120]].forEach(([b,M],C)=>{m(f,222+C*30,M,6,.45),E(b,x,230+C*30,11,500,.75,!0,"right"),A(f,240+C*30,316,.14)}),E(a.base,172,372,11,500,.7),E(o.base,x,372,12,500,.85,!0,"right"),v(264,359,88,18),E(a.iva,172,396,11,500,.7),E(o.iva,x,396,12,500,.85,!0,"right"),v(278,383,74,18),m(162,410,188,2,.9),E(a.total,166,440,14,800),E(o.total,x,441,17,800,.95,!0,"right"),v(232,422,120,26),E(a.vence,f,440,10,500,.6,!0),v(f-3,428,128,17),m(f,478,316,5,.25),m(f,489,170,5,.25),{lienzo:l,mascara:c}}function bc(){let e=document.createElement("canvas");e.width=960,e.height=96;let n=e.getContext("2d");n.fillStyle="#0c0c0d",n.fillRect(0,0,e.width,e.height),n.fillStyle="#e9e9ea",n.textAlign="center",n.textBaseline="middle",n.font=`600 ${96*.74}px "Martian Mono", ui-monospace, Menlo, monospace`;for(let s=0;s<10;s++)n.save(),n.translate(96*(s+.5),96/2),n.rotate(-Math.PI/2),n.fillText(String(s),0,96*.04),n.restore(),n.fillStyle="rgba(255,255,255,.16)",n.fillRect(96*s,0,1,96),n.fillStyle="#e9e9ea";return e}function Tc(i,t,{ancho:e=1024,alto:n=512}={}){i||(i=document.createElement("canvas"),i.width=e,i.height=n);let s=i.getContext("2d");s.fillStyle="#000",s.fillRect(0,0,i.width,i.height),s.fillStyle="#fff",s.textAlign="center",s.textBaseline="middle",t.forEach(({t:r,y:a,px:o,mono:l,peso:c=600,esp:h=0})=>{let d=o;for(s.font=`${c} ${d}px ${l?'"Martian Mono", ui-monospace, monospace':'"Archivo", system-ui, sans-serif'}`,("letterSpacing"in s)&&(s.letterSpacing=h+"px");s.measureText(r).width>i.width*.9&&d>12;)d-=2,s.font=s.font.replace(/\d+px/,d+"px");s.fillText(r,i.width/2,a)});try{let r=document.createElement("canvas");r.width=i.width,r.height=i.height;let a=r.getContext("2d");a.filter="blur(1.6px)",a.drawImage(i,0,0),s.drawImage(r,0,0)}catch{}return i}function Ac(i,t=null){t||(t=document.createElement("canvas"),t.width=512,t.height=64*i.length);let s=t.getContext("2d");return s.fillStyle="#000",s.fillRect(0,0,t.width,t.height),s.fillStyle="#fff",s.textAlign="left",s.textBaseline="middle",s.font='500 34px "Martian Mono", ui-monospace, Menlo, monospace',"letterSpacing"in s&&(s.letterSpacing="7px"),i.forEach((r,a)=>s.fillText(r.toUpperCase(),6,64*(a+.5)+2)),t}var px=["claro","hoy","sistema","automatizacion","inteligencia","finance","resultado","demos","tuyo"],ei=Math.PI*2,vn=(i,t=0,e=1)=>i<t?t:i>e?e:i,Xe=(i,t,e)=>i+(t-i)*e;var wc=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Ec=i=>1-Math.pow(1-i,3),mx=i=>()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},Qu={es:["Ventas","Clientes","Operaciones","Finanzas","Direcci\xF3n","Motor"],en:["Sales","Clients","Operations","Finance","Management","Engine"]},gx=[.22,.34,.46,.58,.7,.1,.92,0],Nr=[{montaje:0,marcha:0,noche:0,tapa:0,doc:0,expo:1,giro:1,h:{p:[1.4,.5,6.2],m:[0,.25,0],fov:40,foco:5,ab:.55,d:[0,0]},v:{p:[.6,.4,8.6],m:[0,.3,0],fov:52,foco:6.8,ab:.5,d:[0,0]}},{montaje:0,marcha:0,noche:0,tapa:0,doc:0,expo:1,giro:.12,h:{p:[-3.2,1.2,8.4],m:[1.4,.1,0],fov:36,foco:7.6,ab:.5,d:[.3,0]},v:{p:[-1.5,1,11.5],m:[0,.2,0],fov:52,foco:10.4,ab:.45,d:[0,.42]}},{montaje:1,marcha:1,noche:0,tapa:0,doc:0,expo:1,giro:0,h:{p:[-5.5,-7.5,17.5],m:[.2,-.1,0],fov:30,foco:19.5,ab:.16,d:[.34,0]},v:{p:[-4,-9,25],m:[0,0,0],fov:40,foco:27,ab:.12,d:[0,.46]}},{montaje:1,marcha:1,noche:1,tapa:0,doc:0,expo:.9,giro:0,h:{p:[-7.4,-.6,2.5],m:[-2.4,1.8,.3],fov:34,foco:5.3,ab:.5,d:[.3,0]},v:{p:[-4.6,-4.6,3.2],m:[-1.6,.4,.3],fov:46,foco:6.4,ab:.45,d:[0,.44]}},{montaje:1,marcha:.35,noche:.25,tapa:0,doc:1,expo:1,giro:0,h:{p:[2.6,-5.6,2.9],m:[.5,-3,.35],fov:32,foco:3.9,ab:.5,d:[.3,0]},v:{p:[5,-3.2,3.4],m:[2.5,-.6,.35],fov:44,foco:4.6,ab:.45,d:[0,.44]}},{montaje:1,marcha:.35,noche:.25,tapa:0,doc:1,expo:1,giro:0,h:{p:[.5,-4.6,7.6],m:[.5,-2,.3],fov:30,foco:8,ab:.22,d:[.44,0]},v:{p:[2.2,-2.6,9.6],m:[2.2,-.2,.3],fov:40,foco:9.9,ab:.2,d:[0,.5]}},{montaje:1,marcha:1,noche:0,tapa:1,doc:0,expo:1,giro:0,h:{p:[3.5,-4.5,20],m:[0,0,.5],fov:30,foco:20.5,ab:.1,d:[.42,0]},v:{p:[2,-6,28],m:[0,0,.5],fov:40,foco:28.5,ab:.08,d:[0,.5]}},{montaje:1,marcha:1,noche:.6,tapa:1,doc:0,expo:.55,giro:0,h:{p:[0,-2,30],m:[0,0,.5],fov:30,foco:12,ab:.5,d:[0,0]},v:{p:[0,-3,40],m:[0,0,.5],fov:40,foco:14,ab:.5,d:[0,0]}},{montaje:1,marcha:1,noche:.15,tapa:1,doc:0,expo:1,giro:0,h:{p:[-1.6,-3,10.5],m:[.3,0,.6],fov:30,foco:10.6,ab:.24,d:[.36,0]},v:{p:[-1,-3.4,13.5],m:[0,0,.6],fov:42,foco:13.6,ab:.2,d:[0,.46]}}];function xx(i){let t=new vi;t.background=new re(0);let e=new gr(60,32,16),n=new Float32Array(e.attributes.position.count*3),s=e.attributes.position;for(let l=0;l<s.count;l++){let c=s.getY(l)/60,h=s.getZ(l)/60,d=.02+.3*Math.pow(Math.max(0,c*.7+h*.5+.2),1.5);n[l*3]=d,n[l*3+1]=d,n[l*3+2]=d*1.04}e.setAttribute("color",new Re(n,3)),t.add(new Ge(e,new Si({vertexColors:!0,side:en})));let r=(l,c,h,d,u,f,x=1)=>{let S=new Ge(new hi(l,c),new Si({color:new re(f,f*x,f*x*x),side:Ln}));S.position.set(h,d,u),S.lookAt(0,0,0),t.add(S)};r(20,7,2,17,9,3.4),r(2.4,15,-16,2,7,7.5),r(1.8,12,15,-3,5,3.2,.985),r(14,2.5,0,-12,8,.7),r(10,4,0,9,-12,1.8),r(1.3,1.3,7,6,14,11),r(26,14,3,4,26,.75);let a=new Rs(i),o=a.fromScene(t,.025,.1,100).texture;return a.dispose(),t.traverse(l=>{l.isMesh&&(l.geometry.dispose(),l.material.dispose())}),o}var _x=`
varying vec4 vFin; varying vec3 vObj; varying vec3 vObjN; varying vec3 vEjeU; varying vec3 vEjeV;
uniform float uSel, uAtenua, uNoche, uOclusion, uPulso; uniform sampler2D tRotulos;
float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
float h31(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
// estr\xEDas a tres escalas; cada una se apaga cuando ya no cabe en un p\xEDxel (si no, centellea)
float estrias(float u) {
  float a = fwidth(u);
  return n1(u * 300.0) * clamp(1.0 - a * 300.0 * 1.4, 0.0, 1.0) + n1(u * 86.0 + 7.3) * 1.7 * clamp(1.0 - a * 86.0 * 1.4, 0.0, 1.0) + n1(u * 23.0 + 3.1) * 2.6 * clamp(1.0 - a * 23.0 * 1.4, 0.0, 1.0);
}
float alturaAcabado(float fin, vec3 p, out float rug) {
  rug = 0.12; float h = 0.0;
  if (fin < 0.5) { rug = 0.09; }
  else if (fin < 1.5) { h = estrias(p.y); rug = 0.3; }
  else if (fin < 2.5) { h = estrias(length(p.xy)); rug = 0.25; }
  else if (fin < 3.5) { vec3 q = p * 260.0; float a = fwidth(q.x) + fwidth(q.y); h = h31(floor(q)) * 1.6 * clamp(1.0 - a * 0.9, 0.0, 1.0); rug = 0.52; }
  else if (fin < 4.5) { vec2 c = p.xy / 0.34, l1 = fract(c) - 0.5, l2 = fract(c + 0.5) - 0.5; float d = min(length(l1), length(l2)) * 0.34; h = estrias(d * 1.6) * 0.9; rug = 0.3; }
  else if (fin < 5.5) { rug = 0.15; }
  else if (fin < 6.5) { rug = 0.17; }
  else { float b = dot(p.xy, vec2(0.7071, 0.7071)) / 0.3, par = mod(floor(b), 2.0); vec2 dir = par < 0.5 ? vec2(0.8, -0.6) : vec2(0.6, -0.8); h = estrias(dot(p.xy, dir)) + smoothstep(0.4, 0.5, abs(fract(b) - 0.5)) * 1.2; rug = 0.27; }
  return h;
}
vec3 perturbar(vec3 pos, vec3 n, vec2 dH, float cara) {
  vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx); float det = dot(sx, r1) * cara;
  vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * n - g);
}
// hacia d\xF3nde van las estr\xEDas de cada acabado (en el plano de la pieza); cero si no las tiene
vec2 grano(float fin, vec3 p) {
  if (fin > 0.5 && fin < 1.5) return vec2(1.0, 0.0);
  if (fin > 1.5 && fin < 2.5) return normalize(vec2(-p.y, p.x) + 1e-5);
  if (fin > 3.5 && fin < 4.5) { vec2 c = p.xy / 0.34, l1 = fract(c) - 0.5, l2 = fract(c + 0.5) - 0.5, l = dot(l1, l1) < dot(l2, l2) ? l1 : l2; return normalize(vec2(-l.y, l.x) + 1e-5); }
  if (fin > 6.5) { float b = dot(p.xy, vec2(0.7071, 0.7071)) / 0.3, par = mod(floor(b), 2.0); return par < 0.5 ? vec2(0.6, 0.8) : vec2(0.8, 0.6); }
  return vec2(0.0);
}
// un metal estriado refleja como un haz de cilindros: se dobla la normal hacia ese cilindro
vec3 doblar(vec3 n, vec3 B, vec3 v, float cuanto) { vec3 c = cross(cross(B, v), B); float l = length(c); return l > 1e-4 ? normalize(mix(n, c / l, cuanto)) : n; }`;function vx(i,t){return i.onBeforeCompile=e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aFin; varying vec4 vFin; varying vec3 vObj; varying vec3 vObjN; varying vec3 vEjeU; varying vec3 vEjeV;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vFin = aFin; vObj = position; vObjN = normal;
#ifdef USE_INSTANCING
mat3 mInst = mat3(instanceMatrix);
#else
mat3 mInst = mat3(1.0);
#endif
vEjeU = normalize(normalMatrix * (mInst * vec3(1.0, 0.0, 0.0))); vEjeV = normalize(normalMatrix * (mInst * vec3(0.0, 1.0, 0.0)));`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+_x).replace("#include <shadowmap_pars_fragment>",`#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>`).replace("#include <color_fragment>",`#include <color_fragment>
        float rugA; float hA = alturaAcabado(vFin.x, vObj, rugA);
        float plano = pow(abs(normalize(vObjN).z), 8.0);
        if (vFin.w > 0.5) { vec2 ru = (vObj.xy - vec2(-1.74, -1.88)) / vec2(1.76, 0.22); if (ru.x > 0.0 && ru.x < 1.0 && ru.y > 0.0 && ru.y < 1.0) { float gr = texture2D(tRotulos, vec2(ru.x, 1.0 - (floor(vFin.w - 0.5) + 1.0 - ru.y) / 6.0)).r * plano * step(0.0, vObjN.z); hA -= gr * 30.0; rugA = mix(rugA, 0.22, gr); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.74, 0.76, 0.8), gr * 0.9); } }
        if (vFin.x > 4.5 && vFin.x < 5.5) { float f = pow(1.0 - abs(dot(normalize(vViewPosition), normalize(vNormal))), 2.0); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.05, 0.32), f * 0.55); }
        float elegido = uSel < -0.5 ? 1.0 : (abs(vFin.y - uSel) < 0.5 || vFin.y > 6.5 ? 1.0 : uAtenua);
        diffuseColor.rgb *= elegido;
        if (abs(vFin.y - 6.0) < 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.75, 1.5) + vec3(0.0, 0.01, 0.05), uPulso);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.1, rugA, plano);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = perturbar(-vViewPosition, normal, vec2(dFdx(hA), dFdy(hA)) * 0.0005 * plano, faceDirection);
vec2 gr2 = grano(vFin.x, vObj); if (dot(gr2, gr2) > 0.5) normal = doblar(normal, normalize(vEjeU * gr2.x + vEjeV * gr2.y), normalize(vViewPosition), (vFin.x > 6.5 ? 0.5 : 0.78) * plano);`).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
        #ifdef USE_SHADOWMAP
          float som = mix(uOclusion, 1.0, getShadowMask()); reflectedLight.indirectSpecular *= som; reflectedLight.indirectDiffuse *= som;
        #endif`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
if (vFin.x > 4.5 && vFin.x < 5.5) totalEmissiveRadiance += vec3(0.05, 0.14, 0.7) * uNoche * 0.12; totalEmissiveRadiance += vec3(0.1, 0.3, 1.0) * uPulso * 0.12 * step(abs(vFin.y - 6.0), 0.5);`)},i}var Jy=()=>{try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}};function $y(i,t={}){let e=!!t.movil,n=t.vertical!==void 0?!!t.vertical:e,s=new Oo({canvas:i,antialias:!1,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!!t.captura,stencil:!1});s.setPixelRatio(1),s.toneMapping=wn,s.shadowMap.enabled=t.sombras!==!1,s.shadowMap.type=ki,s.setClearColor(263173,1);let r=new vi;r.background=new re(263173),r.fog=new js(263173,.02),r.environment=xx(s),r.environmentIntensity=1;let a=new on(32,1,.3,90),o=new yr(16777215,1.7);o.position.set(-7,10,13),o.castShadow=t.sombras!==!1;let l=o.shadow;l.mapSize.set(t.mapaSombra||(e?1024:2048),t.mapaSombra||(e?1024:2048)),l.camera.left=-9.5,l.camera.right=9.5,l.camera.top=9.5,l.camera.bottom=-9.5,l.camera.near=4,l.camera.far=40,l.bias=-6e-4,l.normalBias=.012,l.radius=2.2,r.add(o,o.target);let{piezas:c,geos:h,info:d}=Ju(n),u=t.idioma==="en"?"en":"es",f=Ac(Qu[u]),x=new li(f);x.colorSpace=Un,x.anisotropy=4;let S={uSel:{value:-1},uAtenua:{value:.22},uNoche:{value:0},uOclusion:{value:.3},uPulso:{value:0},tRotulos:{value:x}},g=new li(bc());g.colorSpace=an,g.anisotropy=4,g.wrapS=Vi,g.wrapT=Vi,g.repeat.set(1,-1),g.offset.set(0,1);let m=Sc(u,e?1.5:2.5),A=new li(m.lienzo),E=new li(m.mascara);A.colorSpace=an,A.anisotropy=8;let v={uLectura:{value:0},uCampos:{value:0},tMascara:{value:E}},b={metal:vx(new ui({color:16777215,metalness:1,roughness:.25}),S),joya:new ys({color:new re(.012,.06,.42),metalness:0,roughness:.04,clearcoat:1,clearcoatRoughness:.03,emissive:new re(.02,.1,.7),emissiveIntensity:.25,envMapIntensity:1.6}),tambor:new ui({map:g,metalness:.55,roughness:.34}),cristal:new ys({color:16777215,metalness:0,roughness:0,transparent:!0,opacity:.14,envMapIntensity:2.2,depthWrite:!1})},M=new Pn,C=new Gn,_=new z,T=new Map;c.forEach((J,at)=>{J.i=at;let F=J.g+"|"+J.mat;T.has(F)||T.set(F,[]),T.get(F).push(J)});let R=c.length,I=[],O=new Float32Array(R),G=new Float32Array(R),L=new Float32Array(R),V=new Float32Array(R*4),q=new Float32Array(R),Y=new Float32Array(R),rt=new Float32Array(R),Z=new Float32Array(R),tt=new Uint8Array(R),Q=new Float32Array(R),Dt=new Float32Array(R),It=new Float32Array(R),ae=new Float32Array(R*3),ue=new Float32Array(R),se=new Float32Array(R*3),$=new Float32Array(R*4),st=new Float32Array(R),Tt=new Float32Array(R),Jt=new Float32Array(R),wt=new Float32Array(R),jt=new Float32Array(R),te=mx(t.semilla||11);for(let J of c){let at=J.i;O[at]=J.x,G[at]=J.y,L[at]=J.z,q[at]=J.e,Y[at]=J.k,rt[at]=J.fase,Z[at]=J.ord,tt[at]=J.mod,C.set(J.rx,J.ry,J.rz,"ZYX"),M.setFromEuler(C),V[at*4]=M.x,V[at*4+1]=M.y,V[at*4+2]=M.z,V[at*4+3]=M.w;let F=h.get(J.g);F.boundingSphere||F.computeBoundingSphere(),jt[at]=F.boundingSphere.radius*J.e;let k=jt[at]>1.15,ht=te()*ei,vt=(te()-.5)*2.2,Rt=k?3+te()*3:1.6+Math.pow(te(),.7)*6.2;Q[at]=J.x*(k?.5:.82)+Math.cos(ht)*Math.cos(vt)*Rt*1.25,Dt[at]=J.y*(k?.4:.8)+Math.sin(vt)*Rt*.8,It[at]=(k?-5.5-te()*5:(te()-.42)*9.5)+Math.sin(ht)*1.5;let lt=te()-.5,Nt=te()-.5,Vt=te()-.5,de=Math.hypot(lt,Nt,Vt)||1;ae[at*3]=lt/de,ae[at*3+1]=Nt/de,ae[at*3+2]=Vt/de,ue[at]=(k?.04:.12+te()*.5)*(te()<.5?-1:1)/Math.max(.5,Math.sqrt(jt[at]*3)),se[at*3]=te()*ei,se[at*3+1]=.1+te()*.22,se[at*3+2]=te()*ei,M.setFromAxisAngle(_.set(te()-.5,te()-.5,te()-.5).normalize(),te()*ei),$[at*4]=M.x,$[at*4+1]=M.y,$[at*4+2]=M.z,$[at*4+3]=M.w,st[at]=.7+te()*1.6}d.destacadas=[d.tambores[0],d.lupa,c.find(J=>J.g==="campana"),c.find(J=>J.g==="volante")].map(J=>J.i),(n?[[-1.3,3,2.6],[1.3,2.1,3.6],[-.9,1,4.2],[1.2,-.1,2.8]]:[[.7,1.7,2.4],[3.3,.5,3.3],[.9,-1.2,3.8],[3.6,-1.5,1.4]]).forEach((J,at)=>{let F=d.destacadas[at];Q[F]=J[0],Dt[F]=J[1],It[F]=J[2],ue[F]=.05*(at%2?-1:1),M.setFromEuler(C.set(.25-at*.12,-.3+at*.2,.2*at,"XYZ")),$[F*4]=M.x,$[F*4+1]=M.y,$[F*4+2]=M.z,$[F*4+3]=M.w,se[F*3+1]=.08});for(let[J,at]of T){let[F,k]=J.split("|"),ht=h.get(F),vt=new nr(ht,b[k],at.length);if(vt.instanceMatrix.setUsage(Wl),vt.castShadow=k!=="cristal",vt.receiveShadow=k!=="cristal",vt.frustumCulled=!1,k==="metal"){let Rt=new Float32Array(at.length*4),lt=new re;at.forEach((Nt,Vt)=>{Rt[Vt*4]=Nt.fin,Rt[Vt*4+1]=Nt.mod,Rt[Vt*4+2]=Nt.i*.618%1,Rt[Vt*4+3]=Nt.texto||0,lt.setRGB(Nt.tono[0],Nt.tono[1],Nt.tono[2]),vt.setColorAt(Vt,lt)}),ht.setAttribute("aFin",new bi(Rt,4)),vt.instanceColor.needsUpdate=!0}k==="cristal"&&(vt.renderOrder=5),at.forEach((Rt,lt)=>{Rt.malla=vt,Rt.j=lt}),r.add(vt),I.push(vt)}let it=d.documento,ot=new Ge(new hi(it.w,it.h),new ui({map:A,metalness:0,roughness:.82}));ot.material.onBeforeCompile=J=>{Object.assign(J.uniforms,v),J.fragmentShader=J.fragmentShader.replace("#include <common>",`#include <common>
uniform float uLectura, uCampos; uniform sampler2D tMascara;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
    float campo = texture2D(tMascara, vMapUv).r, leido = step(1.0 - vMapUv.y, uLectura) * uCampos;
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.45, 0.62, 1.0), campo * leido * 0.85);
    totalEmissiveRadiance += vec3(0.1, 0.3, 1.0) * campo * leido * 0.25;`)},ot.position.set(it.x,it.y,it.z),ot.receiveShadow=!0,ot.castShadow=!0,ot.visible=!1,r.add(ot);let ut=d.platina,dt=d.z.alto+.52,pt=J=>d.modulos[J],Kt=[[pt("motor").x-.62,pt("motor").y-1.32,.78],[pt("direccion").x,pt("direccion").y-.05,1.5],[pt("finanzas").x+.6,pt("finanzas").y+.95,0]],Yt=Tc(null,[{t:"D-CODE",y:256,px:120,peso:700,esp:8}]),$t=new li(Yt);$t.colorSpace=Un,$t.anisotropy=8;let Qt=Ds(ut.w+.3,ut.h+.3,.8,.12,Kt.filter(J=>J[2]>0)),P={tGrabado:{value:$t},uCaja:{value:[0,0,1,1]}},Me=new ui({color:new re(.13,.135,.145),metalness:1,roughness:.3});Me.onBeforeCompile=J=>{Object.assign(J.uniforms,P),J.vertexShader=J.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vObj; varying vec3 vObjN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position; vObjN = normal;`),J.fragmentShader=J.fragmentShader.replace("#include <common>",`#include <common>
      varying vec3 vObj; varying vec3 vObjN; uniform sampler2D tGrabado; uniform vec4 uCaja;
      float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
      float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
      float grab(vec2 p) { vec2 uv = (p - uCaja.xy) / uCaja.zw + 0.5; return (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) ? 0.0 : texture2D(tGrabado, uv).r; }
      vec3 perturbar(vec3 pos, vec3 n, vec2 dH, float cara) { vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx); float det = dot(sx, r1) * cara; vec3 g = sign(det) * (dH.x * r1 + dH.y * r2); return normalize(abs(det) * n - g); }`).replace("#include <color_fragment>",`#include <color_fragment>
        float plano = pow(abs(normalize(vObjN).z), 8.0), gr = grab(vObj.xy) * plano;
        float u = atan(vObj.y, vObj.x), au = fwidth(u);
        float hT = (n1(u * 520.0) * clamp(1.0 - au * 700.0, 0.0, 1.0) + n1(u * 140.0) * 1.8 * clamp(1.0 - au * 190.0, 0.0, 1.0) + n1(u * 36.0) * 2.4) * length(vObj.xy) * 0.25 - gr * 26.0;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.78, 0.8, 0.84), gr * 0.9);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(0.12, mix(0.3, 0.42, gr), plano);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal = perturbar(-vViewPosition, normal, vec2(dFdx(hT), dFdy(hT)) * 0.0006 * plano, faceDirection);`)};let ne=new Ge(Qt,Me);ne.castShadow=!0,ne.receiveShadow=!0,ne.visible=!1,r.add(ne),d.grabado=n?{x:pt("ventas").x+d.celda/2,y:pt("ventas").y-d.celda*.1,w:6.6,h:3.3}:{x:pt("ventas").x+.4,y:pt("ventas").y-.2,w:6.6,h:3.3},P.uCaja.value=[d.grabado.x,d.grabado.y,d.grabado.w,d.grabado.h];let w=Ku(s,{muestras:t.muestras??(e?0:4),tomas:t.tomas??(e?14:36),nivelesHalo:e?4:5}),p={cap:0,capObj:0,T:0,theta:0,intro:t.intro===!1?1:0,mano:0,manoObj:0,px:0,py:0,hayPuntero:!1,vertical:n,ancho:1,alto:1,dpr:1,lectura:0,campos:0,sel:-1,selMezcla:0,selX:0,selY:0,golpe:-1,orbX:0,orbY:0,orbVX:0,orbVY:0,aguja:.35,agujaV:0,agujaObj:.35,digitos:[0,0,0,0,0,0],digObj:[0,0,0,0,0,0],libre:null,forzar:null,escalaPx:1,calidad:0},B={montaje:0,marcha:0,noche:0,tapa:0,doc:0,expo:1,giro:1,montajeTotal:0,marchaTotal:0},U={p:[0,0,10],m:[0,0,0],fov:32,foco:10,ab:.3,d:[0,0],e:[0,0,10]},K=new Float32Array(8),_t=[];function Mt(){let J=Math.min(t.dpr||window.devicePixelRatio||1,2),at=i.clientWidth||1,F=i.clientHeight||1,k=Math.round(at*J),ht=Math.round(F*J),vt=(t.pixeles||(e?15e5:32e5))*p.escalaPx;if(k*ht>vt){let Rt=Math.sqrt(vt/(k*ht));k=Math.round(k*Rt),ht=Math.round(ht*Rt)}p.ancho=k,p.alto=ht,p.dpr=k/at,p.vertical=n,s.setSize(k,ht,!1),w.medir(k,ht),a.aspect=k/ht}function j(){let J=vn(p.cap,0,Nr.length-1),at=Math.min(Nr.length-2,Math.floor(J)),F=J-at,k=wc(vn((F-.12)/.76)),ht=Nr[at],vt=Nr[at+1],Rt=n?"v":"h",lt=ht[Rt],Nt=vt[Rt];for(let mt in ht)typeof ht[mt]=="number"&&(B[mt]=Xe(ht[mt],vt[mt],k));for(let mt=0;mt<3;mt++)U.p[mt]=Xe(lt.p[mt],Nt.p[mt],k),U.m[mt]=Xe(lt.m[mt],Nt.m[mt],k);let Vt=Math.sin(Math.PI*k)*Math.min(4,Math.hypot(lt.p[0]-Nt.p[0],lt.p[1]-Nt.p[1],lt.p[2]-Nt.p[2])*.16);if(U.p[2]+=Vt,U.fov=Xe(lt.fov,Nt.fov,k),U.foco=Xe(lt.foco,Nt.foco,k)+Vt*.8,U.ab=Xe(lt.ab,Nt.ab,k),U.d[0]=Xe(lt.d[0],Nt.d[0],k),U.d[1]=Xe(lt.d[1],Nt.d[1],k),p.selMezcla>.002){let mt=p.selMezcla*vn(1-Math.abs(p.cap-2)*1.7),Zt=n?[p.selX-1,p.selY-3.6,10.5]:[p.selX-2.4,p.selY-3.4,8.4],ve=[p.selX,p.selY,.3];for(let ke=0;ke<3;ke++)U.p[ke]=Xe(U.p[ke],Zt[ke],mt),U.m[ke]=Xe(U.m[ke],ve[ke],mt);U.foco=Xe(U.foco,Math.hypot(Zt[0]-ve[0],Zt[1]-ve[1],Zt[2]-ve[2]),mt),U.ab=Xe(U.ab,.32,mt),U.d[0]=Xe(U.d[0],n?0:.3,mt)}if(p.libre){let mt=p.libre;for(let Zt of["p","m","d"])if(mt[Zt])for(let ve=0;ve<mt[Zt].length;ve++)U[Zt][ve]=mt[Zt][ve];for(let Zt of["fov","foco","ab"])mt[Zt]!==void 0&&(U[Zt]=mt[Zt])}if(p.forzar)for(let mt in p.forzar)B[mt]=p.forzar[mt];let de=Math.max(B.montaje,p.mano,p.cap<1?1-Ec(vn(p.intro)):0);for(let mt=0;mt<8;mt++)K[mt]=vn(de*1.94-gx[mt]);B.montajeTotal=de,B.marchaTotal=Math.max(B.marcha,p.mano>.98?1:0)}let nt=new Le,At=nt.elements,Ot=[0,0,0,1],Et=[0,0,0,1],St=(J,at,F,k,ht)=>{let vt=Math.sin(ht/2);J[0]=at*vt,J[1]=F*vt,J[2]=k*vt,J[3]=Math.cos(ht/2)},Ht=(J,at,F,k)=>{let ht=at[F],vt=at[F+1],Rt=at[F+2],lt=at[F+3],Nt=k[0],Vt=k[1],de=k[2],mt=k[3];J[0]=lt*Nt+ht*mt+vt*de-Rt*Vt,J[1]=lt*Vt-ht*de+vt*mt+Rt*Nt,J[2]=lt*de+ht*Vt-vt*Nt+Rt*mt,J[3]=lt*mt-ht*Nt-vt*Vt-Rt*de},Wt=[0,0,0,1],Bt=[0,0,0,1],D=[0,0,0,1],gt={o:[0,0,0],d:[0,0,-1]};function et(){_.set(p.px,p.py,.5).unproject(a),gt.o[0]=a.position.x,gt.o[1]=a.position.y,gt.o[2]=a.position.z,_.sub(a.position).normalize(),gt.d[0]=_.x,gt.d[1]=_.y,gt.d[2]=_.z}let xt=new Float32Array(R*3);function bt(J){let at=p.T,F=p.theta,k=B.marchaTotal,ht=p.hayPuntero&&B.montajeTotal<.6;ht&&et();let vt=Math.sin(at*ei*1.6)*k;for(let Rt of c){let lt=Rt.i,Nt=K[tt[lt]],Vt=O[lt],de=G[lt],mt=L[lt],Zt=0,ve=!1;switch(Rt.tipo){case"rueda":case"conRueda":case"eje":case"giro":case"muelle":Zt=rt[lt]+Y[lt]*F;break;case"volante":Zt=(Rt.dato?Rt.dato.amp:2.3)*vt;break;case"ancora":Zt=.13*Math.tanh(Math.sin(at*ei*1.6)*5)*k;break;case"trinquete":{let he=((rt[lt]+Y[lt]*F)*Rt.dato.N/ei%1+1)%1;Zt=.075*(Y[lt]>0?he:1-he);break}case"martillo":{let he=(((Rt.dato.fr||0)+(Rt.dato.kr||0)*F)*8/ei%1+1)%1,Lt=Rt.dato.kr>0?he:1-he;if(Zt=.2*(Lt<.92?Lt/.92:(1-Lt)/.08)*k*(B.doc>.5?0:1)+.03,p.golpe>=0){let Ce=p.golpe/.5;Zt=.03+.34*(Ce<.62?Math.sin(Ce/.62*Math.PI/2):Math.max(0,1-(Ce-.62)/.1))}if(Rt.dato.cabeza){let Ce=Rt.rz+Zt;Vt+=Math.cos(Ce)*Rt.dato.largo,de+=Math.sin(Ce)*Rt.dato.largo}break}case"seguidor":case"cremallera":case"pinonLibre":{let he=Rt.dato.leva,Lt=((he.ang-(he.f0+he.k0*F))/ei%1+1)%1,Ce=(he.k0>0?1-Lt:Lt)*(he.r1-he.r0);Rt.tipo==="seguidor"?Zt=-Math.atan(Ce/Rt.dato.largo)*1:Rt.tipo==="cremallera"?Vt+=Ce*.9:Zt=-(Ce*.9)/Rt.dato.r;break}case"tambor":Zt=p.digitos[Rt.dato.k]*(ei/10),ve=!0;break;case"lupa":de+=(.5-p.lectura)*1.05*B.doc;break;case"aguja":Zt=-p.aguja*2.14;break;case"corona":Zt=F*.6;break;case"pixel":break}ve?St(Wt,1,0,0,Zt):St(Wt,0,0,1,Zt),Ht(Bt,V,lt*4,Wt);let ke=Vt,Hn=de,Wn=mt,De=Bt[0],je=Bt[1],y=Bt[2],N=Bt[3];if(Nt<.9995){let he=wc(vn((Nt-Z[lt]*.62)/.38)),Lt=B.giro,Ce=at*(.25+.75*Lt),xe=Q[lt]+Math.sin(Ce*se[lt*3+1]+se[lt*3])*.35,Je=Dt[lt]+Math.sin(Ce*se[lt*3+1]*.8+se[lt*3+2])*.3,nn=It[lt]+Math.cos(Ce*se[lt*3+1]*.6+se[lt*3])*.3;if(ht&&jt[lt]<1.15){let yn=xe-gt.o[0],gn=Je-gt.o[1],Ee=nn-gt.o[2],Pe=yn*gt.d[0]+gn*gt.d[1]+Ee*gt.d[2],un=yn-gt.d[0]*Pe,Te=gn-gt.d[1]*Pe,$e=Ee-gt.d[2]*Pe,Xn=Math.hypot(un,Te,$e)||.001,Zi=Xn<1.5?(1-Xn/1.5)**2*1.1/Xn:0;Tt[lt]+=(un*Zi-Tt[lt])*.08,Jt[lt]+=(Te*Zi-Jt[lt])*.08,wt[lt]+=($e*Zi-wt[lt])*.08}else Tt[lt]*=.95,Jt[lt]*=.95,wt[lt]*=.95;if(xe+=Tt[lt],Je+=Jt[lt],nn+=wt[lt],St(Wt,ae[lt*3],ae[lt*3+1],ae[lt*3+2],ue[lt]*Ce*2.2+(Rt.tipo==="tornillo",0)),Ht(D,$,lt*4,Wt),he<=5e-4)ke=xe,Hn=Je,Wn=nn,De=D[0],je=D[1],y=D[2],N=D[3];else{let yn=4*he*(1-he)*st[lt]+(1-he)*(1-he)*0;ke=xe+(Vt-xe)*he,Hn=Je+(de-Je)*he,Wn=nn+(mt-nn)*he+yn,Rt.tipo==="tornillo"&&(St(Wt,0,0,1,(1-he)*14),Ot[0]=Bt[0],Ot[1]=Bt[1],Ot[2]=Bt[2],Ot[3]=Bt[3],Ht(Bt,Ot,0,Wt),Wn+=(1-he)*.25);let gn=D[0]*Bt[0]+D[1]*Bt[1]+D[2]*Bt[2]+D[3]*Bt[3],Ee=gn<0?-1:1;gn=Math.abs(gn);let Pe=Math.acos(Math.min(1,gn)),un=Math.sin(Pe),Te=1-he,$e=he;un>1e-4&&(Te=Math.sin((1-he)*Pe)/un,$e=Math.sin(he*Pe)/un),$e*=Ee,De=D[0]*Te+Bt[0]*$e,je=D[1]*Te+Bt[1]*$e,y=D[2]*Te+Bt[2]*$e,N=D[3]*Te+Bt[3]*$e}}xt[lt*3]=ke,xt[lt*3+1]=Hn,xt[lt*3+2]=Wn;let X=q[lt],W=De+De,H=je+je,Ct=y+y,Ft=De*W,Pt=De*H,Gt=De*Ct,qt=je*H,fe=je*Ct,me=y*Ct,kt=N*W,we=N*H,Oe=N*Ct,pe=Rt.malla.instanceMatrix.array,ce=Rt.j*16;pe[ce]=(1-(qt+me))*X,pe[ce+1]=(Pt+Oe)*X,pe[ce+2]=(Gt-we)*X,pe[ce+3]=0,pe[ce+4]=(Pt-Oe)*X,pe[ce+5]=(1-(Ft+me))*X,pe[ce+6]=(fe+kt)*X,pe[ce+7]=0,pe[ce+8]=(Gt+we)*X,pe[ce+9]=(fe-kt)*X,pe[ce+10]=(1-(Ft+qt))*X,pe[ce+11]=0,pe[ce+12]=ke,pe[ce+13]=Hn,pe[ce+14]=Wn,pe[ce+15]=1}for(let Rt of I)Rt.instanceMatrix.needsUpdate=!0}function ct(){let J=p.hayPuntero?1:0,at=vn(Math.hypot(U.p[0]-U.m[0],U.p[1]-U.m[1],U.p[2]-U.m[2])/9,.25,1.6);p.orbX+=p.orbVX,p.orbY+=p.orbVY,p.orbVX*=.9,p.orbVY*=.9,p.orbX*=.985,p.orbY*=.985;let F=U.p[0]-U.m[0],k=U.p[1]-U.m[1],ht=U.p[2]-U.m[2],vt=Math.hypot(F,k,ht),Rt=Math.atan2(F,ht)+p.orbX+(Math.sin(p.T*.21)*.012+p.px*.05*J),lt=Math.asin(k/vt)+p.orbY+(Math.sin(p.T*.27+1)*.008+p.py*.03*J);lt=vn(lt,-1.35,1.35);let Nt=p.cap<1?(1-Ec(vn(p.intro)))*(1-p.cap):0,Vt=vt*(1+Nt*.9);U.e[0]=U.m[0]+Math.sin(Rt)*Math.cos(lt)*Vt,U.e[1]=U.m[1]+Math.sin(lt)*Vt,U.e[2]=U.m[2]+Math.cos(Rt)*Math.cos(lt)*Vt,a.position.set(U.e[0],U.e[1],U.e[2]),a.up.set(0,1,0),a.lookAt(U.m[0],U.m[1],U.m[2]),a.fov=U.fov,a.near=Math.max(.2,Vt*.04),a.far=Vt+60,a.updateProjectionMatrix(),a.projectionMatrix.elements[8]=-U.d[0],a.projectionMatrix.elements[9]=-U.d[1],a.projectionMatrixInverse.copy(a.projectionMatrix).invert(),a.updateMatrixWorld(!0)}function Xt(J){j(),ct(),bt(J);let at=B.noche;if(r.environmentIntensity=Xe(1,.16,at)*B.expo,o.intensity=Xe(1.7,.9,at),o.color.setRGB(Xe(1,.72,at),Xe(1,.8,at),1),S.uNoche.value=at,b.joya.emissiveIntensity=Xe(.2,1.1,at),S.uSel.value=p.selMezcla>.02?p.sel:-1,S.uAtenua.value=Xe(1,.2,p.selMezcla),S.uPulso.value=vn(1-Math.abs(K[6]-.55)/.5)*(1-vn((B.montajeTotal-.97)/.03))*.9,ot.visible=B.doc>.01,ot.visible){let ht=d.documento;ot.position.set(ht.x,ht.y-(1-Ec(B.doc))*2.4,ht.z+(1-B.doc)*.5),v.uLectura.value=p.lectura,v.uCampos.value=p.campos}if(ne.visible=B.tapa>.004,ne.visible){let ht=wc(vn(B.tapa));ne.position.set((1-ht)*-1.5,(1-ht)*1,dt+(1-ht)*9),ne.rotation.set((1-ht)*.5,(1-ht)*-.35,0)}let F=w.U,k=p.alto;F.uFoco.value=U.foco,F.uApertura.value=U.ab*(p.forzar&&p.forzar.ab!==void 0,1),F.uMaxDesenfoque.value=Math.max(4,k*.024),F.uExposicion.value=B.expo*.8,F.uHalo.value=Xe(.22,.6,at),F.uVineta.value=.55,F.uGrano.value=.03,s.setRenderTarget(w.destino),s.render(r,a),w.revelar(a,p.T)}let zt=!1,Ae=0,ye=0,ze=[];function Ue(J){if(p.T+=J,p.cap+=(p.capObj-p.cap)*(1-Math.exp(-J*(t.captura?60:5.5))),p.mano+=(p.manoObj-p.mano)*(1-Math.exp(-J*(p.manoObj>p.mano?2.4:3.2))),p.selMezcla+=((p.sel>=0?1:0)-p.selMezcla)*(1-Math.exp(-J*4)),p.sel>=0){let at=d.modulos[Ns[p.sel]],F=p.selMezcla<.05?1:1-Math.exp(-J*4);p.selX+=(at.x-p.selX)*F,p.selY+=(at.y-p.selY)*F}p.golpe>=0&&(p.golpe+=J,p.golpe>.7&&(p.golpe=-1)),p.theta+=J*.55*B.marchaTotal*(B.vel||1),p.agujaV+=((p.agujaObj-p.aguja)*40-p.agujaV*6.5)*J,p.aguja+=p.agujaV*J;for(let at=0;at<6;at++)p.digitos[at]+=(p.digObj[at]-p.digitos[at])*(1-Math.exp(-J*(3.2+at*.5)));Xt(J);for(let at of ze)at(J)}function Li(J){Ae=requestAnimationFrame(Li);let at=Math.min(.05,(J-ye)/1e3||.016);ye=J,Ue(at)}Mt();let kn={N:R,est:p,cam:U,info:d,capitulos:px,renderer:s,escena:r,camara:a,capitulo(J,at){p.capObj=vn(J,0,Nr.length-1),at&&(p.cap=p.capObj)},puntero(J,at,F){p.px=J,p.py=at,p.hayPuntero=!!F},arrastrar(J,at){p.orbVX+=-J*.0016,p.orbVY+=at*.0012},sostener(J){p.manoObj=J?1:0},intro(J){p.intro=J},area(J){p.sel=J==null||J===""?-1:typeof J=="number"?J:Ns.indexOf(J)},golpe(){p.golpe=0},factura(J){Sc(u,e?1.5:2.5,J,m),A.needsUpdate=!0,E.needsUpdate=!0},redibujar(){Ac(Qu[u],f),x.needsUpdate=!0,g.image=bc(),g.needsUpdate=!0},lectura(J,at){p.lectura=J,at!==void 0&&(p.campos=at)},registro(J){let at=String(Math.round(J)).padStart(6,"0").slice(-6);for(let F=0;F<6;F++)p.digObj[F]=Math.ceil(p.digitos[F]/10-.001)*10+ +at[F]+10*(1+F%2)},indicador(J){p.agujaObj=vn(J)},grabar(J){Tc(Yt,J),$t.needsUpdate=!0},rodaje(J,at){p.libre=J||null,p.forzar=at||null},proyectar(J,at,F,k={}){return _.set(J,at,F).project(a),k.x=(_.x*.5+.5)*i.clientWidth,k.y=(1-(_.y*.5+.5))*i.clientHeight,k.visible=_.z<1&&Math.abs(_.x)<1.2&&Math.abs(_.y)<1.2,k},pieza(J,at={}){return kn.proyectar(xt[J*3],xt[J*3+1],xt[J*3+2],at)},campo(J,at,F={}){let k=d.documento;return kn.proyectar(k.x+(J-.5)*k.w,k.y+(at-.5)*k.h,k.z,F)},tambor(J,at={}){let F=d.tambores[J];return kn.proyectar(F.x,F.y,F.z+.3,at)},modulo(J,at={}){let F=d.modulos[J];return kn.proyectar(F.x,F.y,.5,at)},alCuadro(J){ze.push(J)},medir:Mt,paso(J=1/60){Ue(J)},calidad(J){p.calidad=J,p.escalaPx=[1,.72,.5,.36][Math.min(3,J)],J>=2&&w.tomas(e?8:16),J>=3&&(s.shadowMap.enabled=!1),Mt()},iniciar(){zt||(zt=!0,ye=performance.now(),Ae=requestAnimationFrame(Li))},parar(){zt=!1,cancelAnimationFrame(Ae)},get vivo(){return zt},liberar(){kn.parar(),w.liberar(),s.dispose(),_t.forEach(J=>J())}};return kn}export{fx as CAMPOS,px as CAPITULOS,Ns as MODULOS,$y as crearMaquina,Jy as hayWebGL2};
