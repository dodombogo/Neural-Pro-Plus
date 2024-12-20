const t=43200,n=Symbol.for("constructDateFrom");function e(t,e){return"function"==typeof t?t(e):t&&"object"==typeof t&&n in t?t[n](e):t instanceof Date?new t.constructor(e):new Date(e)}function a(t,n){return e(t,t)}let r={};function o(t){const n=a(t),e=new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds()));return e.setUTCFullYear(n.getFullYear()),+t-+e}function i(t,...n){const a=e.bind(null,t||n.find((t=>"object"==typeof t)));return n.map(a)}function u(t,n){const e=+a(t)-+a(n);return e<0?-1:e>0?1:e}function s(t,n){const e=a(t);return+function(t){const n=a(t);return n.setHours(23,59,59,999),n}(e)==+function(t){const n=a(t),e=n.getMonth();return n.setFullYear(n.getFullYear(),e+1,0),n.setHours(23,59,59,999),n}(e)}function d(t,n,e){const[a,r,o]=i(null==e?void 0:e.in,t,t,n),d=u(r,o),l=Math.abs(function(t,n,e){const[a,r]=i(null==e?void 0:e.in,t,n);return 12*(a.getFullYear()-r.getFullYear())+(a.getMonth()-r.getMonth())}(r,o));if(l<1)return 0;1===r.getMonth()&&r.getDate()>27&&r.setDate(30),r.setMonth(r.getMonth()-d*l);let c=u(r,o)===-d;s(a)&&1===l&&1===u(a,o)&&(c=!1);const h=d*(l-+c);return 0===h?0:h}function l(t,n,e){const r=function(t,n){return+a(t)-+a(n)}(t,n)/1e3;return(o=null==e?void 0:e.roundingMethod,t=>{const n=(o?Math[o]:Math.trunc)(t);return 0===n?0:n})(r);var o}const c={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};function h(t){return(n={})=>{const e=n.width?String(n.width):t.defaultWidth;return t.formats[e]||t.formats[t.defaultWidth]}}const m={date:h({formats:{full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},defaultWidth:"full"}),time:h({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:h({formats:{full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})},f={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"};function g(t){return(n,e)=>{let a;if("formatting"===((null==e?void 0:e.context)?String(e.context):"standalone")&&t.formattingValues){const n=t.defaultFormattingWidth||t.defaultWidth,r=(null==e?void 0:e.width)?String(e.width):n;a=t.formattingValues[r]||t.formattingValues[n]}else{const n=t.defaultWidth,r=(null==e?void 0:e.width)?String(e.width):t.defaultWidth;a=t.values[r]||t.values[n]}return a[t.argumentCallback?t.argumentCallback(n):n]}}function y(t){return(n,e={})=>{const a=e.width,r=a&&t.matchPatterns[a]||t.matchPatterns[t.defaultMatchWidth],o=n.match(r);if(!o)return null;const i=o[0],u=a&&t.parsePatterns[a]||t.parsePatterns[t.defaultParseWidth],s=Array.isArray(u)?function(t,n){for(let e=0;e<t.length;e++)if(n(t[e]))return e;return}(u,(t=>t.test(i))):function(t,n){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e)&&n(t[e]))return e;return}(u,(t=>t.test(i)));let d;d=t.valueCallback?t.valueCallback(s):s,d=e.valueCallback?e.valueCallback(d):d;return{value:d,rest:n.slice(i.length)}}}var b;const v={code:"en-US",formatDistance:(t,n,e)=>{let a;const r=c[t];return a="string"==typeof r?r:1===n?r.one:r.other.replace("{{count}}",n.toString()),(null==e?void 0:e.addSuffix)?e.comparison&&e.comparison>0?"in "+a:a+" ago":a},formatLong:m,formatRelative:(t,n,e,a)=>f[t],localize:{ordinalNumber:(t,n)=>{const e=Number(t),a=e%100;if(a>20||a<10)switch(a%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd"}return e+"th"},era:g({values:{narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},defaultWidth:"wide"}),quarter:g({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},defaultWidth:"wide",argumentCallback:t=>t-1}),month:g({values:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},defaultWidth:"wide"}),day:g({values:{narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},defaultWidth:"wide"}),dayPeriod:g({values:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},defaultWidth:"wide",formattingValues:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},defaultFormattingWidth:"wide"})},match:{ordinalNumber:(b={matchPattern:/^(\d+)(th|st|nd|rd)?/i,parsePattern:/\d+/i,valueCallback:t=>parseInt(t,10)},(t,n={})=>{const e=t.match(b.matchPattern);if(!e)return null;const a=e[0],r=t.match(b.parsePattern);if(!r)return null;let o=b.valueCallback?b.valueCallback(r[0]):r[0];return o=n.valueCallback?n.valueCallback(o):o,{value:o,rest:t.slice(a.length)}}),era:y({matchPatterns:{narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^b/i,/^(a|c)/i]},defaultParseWidth:"any"}),quarter:y({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:t=>t+1}),month:y({matchPatterns:{narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},defaultParseWidth:"any"}),day:y({matchPatterns:{narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},defaultParseWidth:"any"}),dayPeriod:y({matchPatterns:{narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},defaultParseWidth:"any"})},options:{weekStartsOn:0,firstWeekContainsDate:1}};function p(n,e,a){const s=r,c=(null==a?void 0:a.locale)??s.locale??v,h=u(n,e);if(isNaN(h))throw new RangeError("Invalid time value");const m=Object.assign({},a,{addSuffix:null==a?void 0:a.addSuffix,comparison:h}),[f,g]=i(null==a?void 0:a.in,...h>0?[e,n]:[n,e]),y=l(g,f),b=(o(g)-o(f))/1e3,p=Math.round((y-b)/60);let w;if(p<2)return(null==a?void 0:a.includeSeconds)?y<5?c.formatDistance("lessThanXSeconds",5,m):y<10?c.formatDistance("lessThanXSeconds",10,m):y<20?c.formatDistance("lessThanXSeconds",20,m):y<40?c.formatDistance("halfAMinute",0,m):y<60?c.formatDistance("lessThanXMinutes",1,m):c.formatDistance("xMinutes",1,m):0===p?c.formatDistance("lessThanXMinutes",1,m):c.formatDistance("xMinutes",p,m);if(p<45)return c.formatDistance("xMinutes",p,m);if(p<90)return c.formatDistance("aboutXHours",1,m);if(p<1440){const t=Math.round(p/60);return c.formatDistance("aboutXHours",t,m)}if(p<2520)return c.formatDistance("xDays",1,m);if(p<t){const t=Math.round(p/1440);return c.formatDistance("xDays",t,m)}if(p<86400)return w=Math.round(p/t),c.formatDistance("aboutXMonths",w,m);if(w=d(g,f),w<12){const n=Math.round(p/t);return c.formatDistance("xMonths",n,m)}{const t=w%12,n=Math.trunc(w/12);return t<3?c.formatDistance("aboutXYears",n,m):t<9?c.formatDistance("overXYears",n,m):c.formatDistance("almostXYears",n+1,m)}}function w(t,n){return p(t,function(t){return e(t,Date.now())}(t),n)}const M=[];for(let x=0;x<256;++x)M.push((x+256).toString(16).slice(1));let D;const W=new Uint8Array(16);function S(){if(!D){if("undefined"==typeof crypto||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");D=crypto.getRandomValues.bind(crypto)}return D(W)}const P={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function k(t,n,e){if(P.randomUUID&&!n&&!t)return P.randomUUID();const a=(t=t||{}).random||(t.rng||S)();return a[6]=15&a[6]|64,a[8]=63&a[8]|128,function(t,n=0){return(M[t[n+0]]+M[t[n+1]]+M[t[n+2]]+M[t[n+3]]+"-"+M[t[n+4]]+M[t[n+5]]+"-"+M[t[n+6]]+M[t[n+7]]+"-"+M[t[n+8]]+M[t[n+9]]+"-"+M[t[n+10]]+M[t[n+11]]+M[t[n+12]]+M[t[n+13]]+M[t[n+14]]+M[t[n+15]]).toLowerCase()}(a)}export{w as f,k as v};