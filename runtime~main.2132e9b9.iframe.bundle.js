(()=>{"use strict";var deferred,leafPrototypes,getProto,inProgress,__webpack_modules__={},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.amdO={},deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){for(var[chunkIds,fn,priority]=deferred[i],fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.n=module=>{var getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},getProto=Object.getPrototypeOf?obj=>Object.getPrototypeOf(obj):obj=>obj.__proto__,__webpack_require__.t=function(value,mode){if(1&mode&&(value=this(value)),8&mode)return value;if("object"==typeof value&&value){if(4&mode&&value.__esModule)return value;if(16&mode&&"function"==typeof value.then)return value}var ns=Object.create(null);__webpack_require__.r(ns);var def={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var current=2&mode&&value;"object"==typeof current&&!~leafPrototypes.indexOf(current);current=getProto(current))Object.getOwnPropertyNames(current).forEach((key=>def[key]=()=>value[key]));return def.default=()=>value,__webpack_require__.d(ns,def),ns},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>(({427:"sak-MenyTaAvVentIndex-stories",483:"sak-FatterVedtakApprovalModalSakIndex-stories",551:"omsorgspenger-Uttaksplan-stories",627:"prosess-TilkjentYtelseProsessIndex-stories",654:"fakta-tilbakekreving-FeilutbetalingFaktaIndex-stories",984:"prosess-anke-AnkeMerknaderProsessIndex-stories",1270:"sak-BehandlingVelgerSakIndex-stories",1283:"prosess-VedtakProsessIndex-stories",1451:"sak-FagsakProfilSakIndex-stories",1656:"prosess-VilkarresultatMedOverstyringProsessIndex-stories",2017:"sak-DokumenterSakIndex-stories",2029:"prosess-AvregningProsessIndex-stories",2057:"prosess-klage-KlagevurderingProsessIndex-stories",2176:"tidslinje-Legendbox-stories",2624:"sharedComponents-LoadingPanel-stories",3028:"sak-AktorSakIndex-stories",3070:"sak-MenySakIndex-stories",3072:"sak-HistorikkSakIndex-stories",3288:"prosess-CheckPersonStatusIndex-stories",3431:"prosess-anke-AnkeProsessIndex-stories",3518:"fakta-VergeFaktaIndex-stories",3593:"sharedComponents-DateLabel-stories",3743:"prosess-innsyn-VedtakInnsynProsessIndex-stories",3780:"prosess-anke-AnkeResultatProsessIndex-stories",3822:"sak-BehandlingVelgerSakIndexOld-stories",4129:"fakta-OpplysningerFraSoknaden-stories",4184:"fakta-ArbeidsforholdFaktaIndex-stories",4238:"prosess-ProsessSjekkTilbakekreving-stories",4255:"prosess-klage-VedtakKlageProsessIndex-stories",4626:"sak-MenySettPaVentIndex-stories",4941:"omsorgspenger-RammevedtakFaktaIndex-stories",5115:"sak-MenyMarkerBehandling-stories",5200:"prosess-tilbakekreving-VedtakTilbakekrevingProsessIndex-stories",5246:"sak-DekoratorSakIndex-stories",5426:"prosess-tilbakekreving-TilbakekrevingProsessIndex-stories",5798:"prosess-VilkarresultatSoknadsfristProsessIndex-stories",5858:"sak-SupportMenySakIndex-stories",6077:"sak-MenyHenleggIndex-stories",6200:"prosess-uttak-UttakAntallDagerLivetsSluttfase-stories",6297:"fakta-pleiepenger-Utenlandsopphold-stories",6303:"sak-TotrinnskontrollSakIndex-stories",6532:"fakta-beregning-OverstyrBeregningInputIndex-stories",6594:"sak-FagsakSokSakIndex-stories",6859:"sharedComponents-ArrowBox-stories",6932:"sak-MenyEndreBehandlendeEnhetIndex-stories",6945:"sak-InfosiderSakIndex-stories",7089:"prosess-tilbakekreving-ForeldelseProsessIndex-stories",7414:"fakta-OpptjeningFaktaIndexOms-stories",7651:"fakta-BostedSokerFaktaIndex-stories",7858:"sharedComponents-OkAvbrytModal-stories",7959:"prosess-klage-FormkravProsessIndex-stories",8008:"sak-VisittkortSakIndex-stories",8071:"prosess-OpptjeningVilkarProsessIndexOms-stories",8519:"prosess-innsyn-InnsynProsessIndex-stories",8789:"sak-MeldingerSakIndex-stories",8892:"fakta-beregning-DirekteOvergangIndex-stories",9021:"fakta-MedlemskapFaktaIndex-stories",9145:"sak-MenyNyBehandlingIndex-stories",9146:"prosess-SokersOpplysningspliktVilkarProsessIndex-stories",9234:"omsorgspenger-Barn-stories",9312:"prosess-VarselOmRevurderingProsessIndex-stories",9458:"sak-NotatISakIndex-stories",9529:"sak-RisikoklassifiseringSakIndex-stories",9570:"fakta-pleiepenger-Soknadsperioder-stories",9742:"sak-MenyVergeIndex-stories",9908:"sak-Soknadsperiodestripe-stories",9932:"sharedComponents-DataFetchPendingModal-stories"}[chunkId]||chunkId)+"."+{39:"b6bb713c",94:"d97c1591",427:"d89b295c",483:"ec45db11",551:"c38a36b2",627:"13af4e94",654:"bb5d8804",867:"65a70ff2",984:"10515c21",1112:"143d2b43",1270:"699c361b",1280:"6a20968a",1283:"fc30722d",1341:"157318ca",1451:"0b88e4ab",1656:"9fb319fa",1729:"e8f64460",1762:"1d6e70d9",2017:"0ad9a893",2029:"132ae3fa",2057:"c1b6004e",2176:"630e0f88",2307:"c0182517",2372:"a8dc238a",2624:"533993ce",2984:"fc6ab8a6",2994:"acab5e3f",3028:"f58c0f08",3070:"e9a0636b",3072:"c151e0fa",3246:"0f326fb0",3288:"c4ab52a9",3370:"72fb3770",3426:"571652de",3431:"677db5da",3518:"3b70d478",3593:"21ca95ca",3743:"b8700e1c",3780:"f479489d",3822:"ad04f22d",3866:"d4ff479d",3978:"d5ce65d5",3984:"e1ea2c32",4051:"99145563",4129:"6ab834fc",4184:"ef16b92d",4202:"bf9758dd",4238:"16700d88",4255:"cd4f3558",4498:"2fb34bfd",4626:"26bebb88",4841:"eb1aa9b2",4941:"3b233621",4970:"5fee469f",5099:"e941fb3f",5115:"4f008ed3",5200:"9928e144",5246:"bf67b9ea",5277:"86076f41",5314:"82adfe32",5426:"72843e92",5590:"946aa0fe",5691:"f207dd00",5798:"96f159d0",5858:"0c8c2a81",5950:"bb160ff2",5964:"d264b682",5970:"82f34be6",6077:"8ea930f3",6108:"b20183df",6200:"d9c7ea00",6297:"94fa9111",6303:"4e161301",6307:"f670a7b9",6532:"36e40a07",6594:"42081f64",6745:"a562090a",6859:"5f69f8bc",6868:"07ddcf73",6879:"9cc48ba1",6932:"ccf39ee3",6945:"c58b98a8",7089:"cf7e59d5",7332:"62c22554",7414:"d22d987a",7644:"4929939f",7651:"b24ee6b0",7795:"4cdfff87",7858:"d3f15e2d",7959:"ac69f0a8",8008:"7389cbd8",8071:"0ac52aa8",8519:"5e2a3e88",8580:"568ef6ad",8767:"7d4ff824",8789:"7660648c",8856:"a2fb5742",8892:"27bfcc0e",9021:"a25ae2b2",9145:"11b71260",9146:"78a586e6",9234:"df0068bb",9312:"7160a02b",9422:"f7445cab",9458:"f5c325df",9474:"6e043c47",9501:"3fbf5404",9504:"cb7c80ab",9512:"e190c3e3",9529:"4bf37287",9566:"18795433",9570:"e9bc7932",9655:"30b7530a",9698:"494ad2fa",9730:"6000e610",9732:"d7978d85",9742:"87acf481",9908:"e15538e7",9932:"d2b756c7"}[chunkId]+".iframe.bundle.js"),__webpack_require__.miniCssF=chunkId=>"style"+({483:"sak-FatterVedtakApprovalModalSakIndex-stories",551:"omsorgspenger-Uttaksplan-stories",627:"prosess-TilkjentYtelseProsessIndex-stories",654:"fakta-tilbakekreving-FeilutbetalingFaktaIndex-stories",984:"prosess-anke-AnkeMerknaderProsessIndex-stories",1270:"sak-BehandlingVelgerSakIndex-stories",1283:"prosess-VedtakProsessIndex-stories",1451:"sak-FagsakProfilSakIndex-stories",1656:"prosess-VilkarresultatMedOverstyringProsessIndex-stories",2029:"prosess-AvregningProsessIndex-stories",2057:"prosess-klage-KlagevurderingProsessIndex-stories",3028:"sak-AktorSakIndex-stories",3072:"sak-HistorikkSakIndex-stories",3288:"prosess-CheckPersonStatusIndex-stories",3431:"prosess-anke-AnkeProsessIndex-stories",3518:"fakta-VergeFaktaIndex-stories",3743:"prosess-innsyn-VedtakInnsynProsessIndex-stories",3780:"prosess-anke-AnkeResultatProsessIndex-stories",3822:"sak-BehandlingVelgerSakIndexOld-stories",4129:"fakta-OpplysningerFraSoknaden-stories",4184:"fakta-ArbeidsforholdFaktaIndex-stories",4238:"prosess-ProsessSjekkTilbakekreving-stories",4255:"prosess-klage-VedtakKlageProsessIndex-stories",4626:"sak-MenySettPaVentIndex-stories",4941:"omsorgspenger-RammevedtakFaktaIndex-stories",5115:"sak-MenyMarkerBehandling-stories",5200:"prosess-tilbakekreving-VedtakTilbakekrevingProsessIndex-stories",5426:"prosess-tilbakekreving-TilbakekrevingProsessIndex-stories",5798:"prosess-VilkarresultatSoknadsfristProsessIndex-stories",6077:"sak-MenyHenleggIndex-stories",6297:"fakta-pleiepenger-Utenlandsopphold-stories",6303:"sak-TotrinnskontrollSakIndex-stories",6532:"fakta-beregning-OverstyrBeregningInputIndex-stories",6594:"sak-FagsakSokSakIndex-stories",6932:"sak-MenyEndreBehandlendeEnhetIndex-stories",6945:"sak-InfosiderSakIndex-stories",7089:"prosess-tilbakekreving-ForeldelseProsessIndex-stories",7414:"fakta-OpptjeningFaktaIndexOms-stories",7651:"fakta-BostedSokerFaktaIndex-stories",7959:"prosess-klage-FormkravProsessIndex-stories",8008:"sak-VisittkortSakIndex-stories",8071:"prosess-OpptjeningVilkarProsessIndexOms-stories",8519:"prosess-innsyn-InnsynProsessIndex-stories",8789:"sak-MeldingerSakIndex-stories",9021:"fakta-MedlemskapFaktaIndex-stories",9145:"sak-MenyNyBehandlingIndex-stories",9146:"prosess-SokersOpplysningspliktVilkarProsessIndex-stories",9312:"prosess-VarselOmRevurderingProsessIndex-stories",9529:"sak-RisikoklassifiseringSakIndex-stories"}[chunkId]||chunkId)+".css",__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.hmd=module=>((module=Object.create(module)).children||(module.children=[]),Object.defineProperty(module,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+module.id)}}),module),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),inProgress={},__webpack_require__.l=(url,done,key,chunkId)=>{if(inProgress[url])inProgress[url].push(done);else{var script,needAttach;if(void 0!==key)for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;i++){var s=scripts[i];if(s.getAttribute("src")==url||s.getAttribute("data-webpack")=="k9-sak-web:"+key){script=s;break}}script||(needAttach=!0,(script=document.createElement("script")).charset="utf-8",script.timeout=120,__webpack_require__.nc&&script.setAttribute("nonce",__webpack_require__.nc),script.setAttribute("data-webpack","k9-sak-web:"+key),script.src=url),inProgress[url]=[done];var onScriptComplete=(prev,event)=>{script.onerror=script.onload=null,clearTimeout(timeout);var doneFns=inProgress[url];if(delete inProgress[url],script.parentNode&&script.parentNode.removeChild(script),doneFns&&doneFns.forEach((fn=>fn(event))),prev)return prev(event)},timeout=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:script}),12e4);script.onerror=onScriptComplete.bind(null,script.onerror),script.onload=onScriptComplete.bind(null,script.onload),needAttach&&document.head.appendChild(script)}},__webpack_require__.r=exports=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(exports,"__esModule",{value:!0})},__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.p="",(()=>{if("undefined"!=typeof document){var loadStylesheet=chunkId=>new Promise(((resolve,reject)=>{var href=__webpack_require__.miniCssF(chunkId),fullhref=__webpack_require__.p+href;if(((href,fullhref)=>{for(var existingLinkTags=document.getElementsByTagName("link"),i=0;i<existingLinkTags.length;i++){var dataHref=(tag=existingLinkTags[i]).getAttribute("data-href")||tag.getAttribute("href");if("stylesheet"===tag.rel&&(dataHref===href||dataHref===fullhref))return tag}var existingStyleTags=document.getElementsByTagName("style");for(i=0;i<existingStyleTags.length;i++){var tag;if((dataHref=(tag=existingStyleTags[i]).getAttribute("data-href"))===href||dataHref===fullhref)return tag}})(href,fullhref))return resolve();((chunkId,fullhref,oldTag,resolve,reject)=>{var linkTag=document.createElement("link");linkTag.rel="stylesheet",linkTag.type="text/css",linkTag.onerror=linkTag.onload=event=>{if(linkTag.onerror=linkTag.onload=null,"load"===event.type)resolve();else{var errorType=event&&("load"===event.type?"missing":event.type),realHref=event&&event.target&&event.target.href||fullhref,err=new Error("Loading CSS chunk "+chunkId+" failed.\n("+realHref+")");err.code="CSS_CHUNK_LOAD_FAILED",err.type=errorType,err.request=realHref,linkTag.parentNode&&linkTag.parentNode.removeChild(linkTag),reject(err)}},linkTag.href=fullhref,oldTag?oldTag.parentNode.insertBefore(linkTag,oldTag.nextSibling):document.head.appendChild(linkTag)})(chunkId,fullhref,null,resolve,reject)})),installedCssChunks={1303:0};__webpack_require__.f.miniCss=(chunkId,promises)=>{installedCssChunks[chunkId]?promises.push(installedCssChunks[chunkId]):0!==installedCssChunks[chunkId]&&{483:1,551:1,627:1,654:1,984:1,1270:1,1283:1,1451:1,1656:1,2029:1,2057:1,3028:1,3072:1,3288:1,3431:1,3518:1,3743:1,3780:1,3822:1,4129:1,4184:1,4238:1,4255:1,4498:1,4626:1,4941:1,5115:1,5200:1,5426:1,5798:1,6077:1,6297:1,6303:1,6532:1,6594:1,6932:1,6945:1,7089:1,7414:1,7651:1,7959:1,8008:1,8071:1,8519:1,8789:1,9021:1,9145:1,9146:1,9312:1,9422:1,9529:1}[chunkId]&&promises.push(installedCssChunks[chunkId]=loadStylesheet(chunkId).then((()=>{installedCssChunks[chunkId]=0}),(e=>{throw delete installedCssChunks[chunkId],e})))}}})(),(()=>{__webpack_require__.b=document.baseURI||self.location.href;var installedChunks={1303:0};__webpack_require__.f.j=(chunkId,promises)=>{var installedChunkData=__webpack_require__.o(installedChunks,chunkId)?installedChunks[chunkId]:void 0;if(0!==installedChunkData)if(installedChunkData)promises.push(installedChunkData[2]);else if(1303!=chunkId){var promise=new Promise(((resolve,reject)=>installedChunkData=installedChunks[chunkId]=[resolve,reject]));promises.push(installedChunkData[2]=promise);var url=__webpack_require__.p+__webpack_require__.u(chunkId),error=new Error;__webpack_require__.l(url,(event=>{if(__webpack_require__.o(installedChunks,chunkId)&&(0!==(installedChunkData=installedChunks[chunkId])&&(installedChunks[chunkId]=void 0),installedChunkData)){var errorType=event&&("load"===event.type?"missing":event.type),realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")",error.name="ChunkLoadError",error.type=errorType,error.request=realSrc,installedChunkData[1](error)}}),"chunk-"+chunkId,chunkId)}else installedChunks[chunkId]=0},__webpack_require__.O.j=chunkId=>0===installedChunks[chunkId];var webpackJsonpCallback=(parentChunkLoadingFunction,data)=>{var moduleId,chunkId,[chunkIds,moreModules,runtime]=data,i=0;if(chunkIds.some((id=>0!==installedChunks[id]))){for(moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);if(runtime)var result=runtime(__webpack_require__)}for(parentChunkLoadingFunction&&parentChunkLoadingFunction(data);i<chunkIds.length;i++)chunkId=chunkIds[i],__webpack_require__.o(installedChunks,chunkId)&&installedChunks[chunkId]&&installedChunks[chunkId][0](),installedChunks[chunkId]=0;return __webpack_require__.O(result)},chunkLoadingGlobal=self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[];chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null,0)),chunkLoadingGlobal.push=webpackJsonpCallback.bind(null,chunkLoadingGlobal.push.bind(chunkLoadingGlobal))})(),__webpack_require__.nc=void 0})();