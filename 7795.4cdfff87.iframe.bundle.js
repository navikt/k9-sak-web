(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[7795],{"./node_modules/diacritics/index.js":(__unused_webpack_module,exports)=>{exports.Od=function removeDiacritics(str){return str.replace(/[^\u0000-\u007e]/g,(function(c){return diacriticsMap[c]||c}))};for(var replacementList=[{base:" ",chars:" "},{base:"0",chars:"߀"},{base:"A",chars:"ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",chars:"Ꜳ"},{base:"AE",chars:"ÆǼǢ"},{base:"AO",chars:"Ꜵ"},{base:"AU",chars:"Ꜷ"},{base:"AV",chars:"ꜸꜺ"},{base:"AY",chars:"Ꜽ"},{base:"B",chars:"ⒷＢḂḄḆɃƁ"},{base:"C",chars:"ⒸＣꜾḈĆCĈĊČÇƇȻ"},{base:"D",chars:"ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ"},{base:"Dh",chars:"Ð"},{base:"DZ",chars:"ǱǄ"},{base:"Dz",chars:"ǲǅ"},{base:"E",chars:"ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ"},{base:"F",chars:"ꝼⒻＦḞƑꝻ"},{base:"G",chars:"ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ"},{base:"H",chars:"ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",chars:"ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",chars:"ⒿＪĴɈȷ"},{base:"K",chars:"ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",chars:"ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",chars:"Ǉ"},{base:"Lj",chars:"ǈ"},{base:"M",chars:"ⓂＭḾṀṂⱮƜϻ"},{base:"N",chars:"ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ"},{base:"NJ",chars:"Ǌ"},{base:"Nj",chars:"ǋ"},{base:"O",chars:"ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OE",chars:"Œ"},{base:"OI",chars:"Ƣ"},{base:"OO",chars:"Ꝏ"},{base:"OU",chars:"Ȣ"},{base:"P",chars:"ⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",chars:"ⓆＱꝖꝘɊ"},{base:"R",chars:"ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",chars:"ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",chars:"ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"Th",chars:"Þ"},{base:"TZ",chars:"Ꜩ"},{base:"U",chars:"ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",chars:"ⓋＶṼṾƲꝞɅ"},{base:"VY",chars:"Ꝡ"},{base:"W",chars:"ⓌＷẀẂŴẆẄẈⱲ"},{base:"X",chars:"ⓍＸẊẌ"},{base:"Y",chars:"ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",chars:"ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",chars:"ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"},{base:"aa",chars:"ꜳ"},{base:"ae",chars:"æǽǣ"},{base:"ao",chars:"ꜵ"},{base:"au",chars:"ꜷ"},{base:"av",chars:"ꜹꜻ"},{base:"ay",chars:"ꜽ"},{base:"b",chars:"ⓑｂḃḅḇƀƃɓƂ"},{base:"c",chars:"ｃⓒćĉċčçḉƈȼꜿↄ"},{base:"d",chars:"ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ"},{base:"dh",chars:"ð"},{base:"dz",chars:"ǳǆ"},{base:"e",chars:"ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ"},{base:"f",chars:"ⓕｆḟƒ"},{base:"ff",chars:"ﬀ"},{base:"fi",chars:"ﬁ"},{base:"fl",chars:"ﬂ"},{base:"ffi",chars:"ﬃ"},{base:"ffl",chars:"ﬄ"},{base:"g",chars:"ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ"},{base:"h",chars:"ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",chars:"ƕ"},{base:"i",chars:"ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",chars:"ⓙｊĵǰɉ"},{base:"k",chars:"ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",chars:"ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ"},{base:"lj",chars:"ǉ"},{base:"m",chars:"ⓜｍḿṁṃɱɯ"},{base:"n",chars:"ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"},{base:"nj",chars:"ǌ"},{base:"o",chars:"ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ"},{base:"oe",chars:"œ"},{base:"oi",chars:"ƣ"},{base:"oo",chars:"ꝏ"},{base:"ou",chars:"ȣ"},{base:"p",chars:"ⓟｐṕṗƥᵽꝑꝓꝕρ"},{base:"q",chars:"ⓠｑɋꝗꝙ"},{base:"r",chars:"ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",chars:"ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ"},{base:"ss",chars:"ß"},{base:"t",chars:"ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"th",chars:"þ"},{base:"tz",chars:"ꜩ"},{base:"u",chars:"ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",chars:"ⓥｖṽṿʋꝟʌ"},{base:"vy",chars:"ꝡ"},{base:"w",chars:"ⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",chars:"ⓧｘẋẍ"},{base:"y",chars:"ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",chars:"ⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],diacriticsMap={},i=0;i<replacementList.length;i+=1)for(var chars=replacementList[i].chars,j=0;j<chars.length;j+=1)diacriticsMap[chars[j]]=replacementList[i].base},"./node_modules/i18n-iso-countries/index.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";const codes=__webpack_require__("./node_modules/i18n-iso-countries/codes.json"),supportedLocales=__webpack_require__("./node_modules/i18n-iso-countries/supportedLocales.json"),removeDiacritics=__webpack_require__("./node_modules/diacritics/index.js").Od,registeredLocales={},alpha2={},alpha3={},numeric={},invertedNumeric={};function formatNumericCode(code){return String("000"+(code||"")).slice(-3)}function hasOwnProperty(object,property){return Object.prototype.hasOwnProperty.call(object,property)}function filterNameBy(type,countryNameList){switch(type){case"official":return Array.isArray(countryNameList)?countryNameList[0]:countryNameList;case"all":return"string"==typeof countryNameList?[countryNameList]:countryNameList;case"alias":return Array.isArray(countryNameList)?countryNameList[1]||countryNameList[0]:countryNameList;default:throw new TypeError("LocaleNameType must be one of these: all, official, alias!")}}function alpha3ToAlpha2(code){return alpha3[code]}function alpha2ToAlpha3(code){return alpha2[code]}function numericToAlpha3(code){const padded=formatNumericCode(code);return alpha2ToAlpha3(numeric[padded])}function numericToAlpha2(code){const padded=formatNumericCode(code);return numeric[padded]}function toAlpha2(code){if("string"==typeof code){if(/^[0-9]*$/.test(code))return numericToAlpha2(code);if(2===code.length)return code.toUpperCase();if(3===code.length)return alpha3ToAlpha2(code.toUpperCase())}if("number"==typeof code)return numericToAlpha2(code)}codes.forEach((function(codeInformation){const s=codeInformation;alpha2[s[0]]=s[1],alpha3[s[1]]=s[0],numeric[s[2]]=s[0],invertedNumeric[s[0]]=s[2]})),exports.registerLocale=function(localeData){if(!localeData.locale)throw new TypeError("Missing localeData.locale");if(!localeData.countries)throw new TypeError("Missing localeData.countries");registeredLocales[localeData.locale]=localeData.countries},exports.alpha3ToAlpha2=alpha3ToAlpha2,exports.alpha2ToAlpha3=alpha2ToAlpha3,exports.alpha3ToNumeric=function alpha3ToNumeric(code){return invertedNumeric[alpha3ToAlpha2(code)]},exports.alpha2ToNumeric=function alpha2ToNumeric(code){return invertedNumeric[code]},exports.numericToAlpha3=numericToAlpha3,exports.numericToAlpha2=numericToAlpha2,exports.toAlpha3=function toAlpha3(code){if("string"==typeof code){if(/^[0-9]*$/.test(code))return numericToAlpha3(code);if(2===code.length)return alpha2ToAlpha3(code.toUpperCase());if(3===code.length)return code.toUpperCase()}if("number"==typeof code)return numericToAlpha3(code)},exports.toAlpha2=toAlpha2,exports.getName=function(code,lang,options={}){"select"in options||(options.select="official");try{const nameList=registeredLocales[lang.toLowerCase()][toAlpha2(code)];return filterNameBy(options.select,nameList)}catch(err){return}},exports.getNames=function(lang,options={}){"select"in options||(options.select="official");const localeList=registeredLocales[lang.toLowerCase()];return void 0===localeList?{}:function localeFilter(localeList,filter){return Object.keys(localeList).reduce((function(newLocaleList,alpha2){const nameList=localeList[alpha2];return newLocaleList[alpha2]=filter(nameList,alpha2),newLocaleList}),{})}(localeList,(function(nameList){return filterNameBy(options.select,nameList)}))},exports.getAlpha2Code=function(name,lang){const normalizeString=string=>string.toLowerCase(),areSimilar=(a,b)=>normalizeString(a)===normalizeString(b);try{const codenames=registeredLocales[lang.toLowerCase()];for(const p in codenames)if(hasOwnProperty(codenames,p)){if("string"==typeof codenames[p]&&areSimilar(codenames[p],name))return p;if(Array.isArray(codenames[p]))for(const mappedName of codenames[p])if(areSimilar(mappedName,name))return p}return}catch(err){return}},exports.getSimpleAlpha2Code=function(name,lang){const normalizeString=string=>removeDiacritics(string.toLowerCase()),areSimilar=(a,b)=>normalizeString(a)===normalizeString(b);try{const codenames=registeredLocales[lang.toLowerCase()];for(const p in codenames)if(hasOwnProperty(codenames,p)){if("string"==typeof codenames[p]&&areSimilar(codenames[p],name))return p;if(Array.isArray(codenames[p]))for(const mappedName of codenames[p])if(areSimilar(mappedName,name))return p}return}catch(err){return}},exports.getAlpha2Codes=function(){return alpha2},exports.getAlpha3Code=function(name,lang){const alpha2=exports.getAlpha2Code(name,lang);return alpha2?exports.toAlpha3(alpha2):void 0},exports.getSimpleAlpha3Code=function(name,lang){const alpha2=exports.getSimpleAlpha2Code(name,lang);return alpha2?exports.toAlpha3(alpha2):void 0},exports.getAlpha3Codes=function(){return alpha3},exports.getNumericCodes=function(){return numeric},exports.langs=function(){return Object.keys(registeredLocales)},exports.getSupportedLanguages=function(){return supportedLocales},exports.isValid=function(code){if(!code)return!1;const coerced=code.toString().toUpperCase();return hasOwnProperty(alpha3,coerced)||hasOwnProperty(alpha2,coerced)||hasOwnProperty(numeric,coerced)}},"./node_modules/i18n-iso-countries/codes.json":module=>{"use strict";module.exports=JSON.parse('[["AF","AFG","004","ISO 3166-2:AF"],["AL","ALB","008","ISO 3166-2:AL"],["DZ","DZA","012","ISO 3166-2:DZ"],["AS","ASM","016","ISO 3166-2:AS"],["AD","AND","020","ISO 3166-2:AD"],["AO","AGO","024","ISO 3166-2:AO"],["AI","AIA","660","ISO 3166-2:AI"],["AQ","ATA","010","ISO 3166-2:AQ"],["AG","ATG","028","ISO 3166-2:AG"],["AR","ARG","032","ISO 3166-2:AR"],["AM","ARM","051","ISO 3166-2:AM"],["AW","ABW","533","ISO 3166-2:AW"],["AU","AUS","036","ISO 3166-2:AU"],["AT","AUT","040","ISO 3166-2:AT"],["AZ","AZE","031","ISO 3166-2:AZ"],["BS","BHS","044","ISO 3166-2:BS"],["BH","BHR","048","ISO 3166-2:BH"],["BD","BGD","050","ISO 3166-2:BD"],["BB","BRB","052","ISO 3166-2:BB"],["BY","BLR","112","ISO 3166-2:BY"],["BE","BEL","056","ISO 3166-2:BE"],["BZ","BLZ","084","ISO 3166-2:BZ"],["BJ","BEN","204","ISO 3166-2:BJ"],["BM","BMU","060","ISO 3166-2:BM"],["BT","BTN","064","ISO 3166-2:BT"],["BO","BOL","068","ISO 3166-2:BO"],["BA","BIH","070","ISO 3166-2:BA"],["BW","BWA","072","ISO 3166-2:BW"],["BV","BVT","074","ISO 3166-2:BV"],["BR","BRA","076","ISO 3166-2:BR"],["IO","IOT","086","ISO 3166-2:IO"],["BN","BRN","096","ISO 3166-2:BN"],["BG","BGR","100","ISO 3166-2:BG"],["BF","BFA","854","ISO 3166-2:BF"],["BI","BDI","108","ISO 3166-2:BI"],["KH","KHM","116","ISO 3166-2:KH"],["CM","CMR","120","ISO 3166-2:CM"],["CA","CAN","124","ISO 3166-2:CA"],["CV","CPV","132","ISO 3166-2:CV"],["KY","CYM","136","ISO 3166-2:KY"],["CF","CAF","140","ISO 3166-2:CF"],["TD","TCD","148","ISO 3166-2:TD"],["CL","CHL","152","ISO 3166-2:CL"],["CN","CHN","156","ISO 3166-2:CN"],["CX","CXR","162","ISO 3166-2:CX"],["CC","CCK","166","ISO 3166-2:CC"],["CO","COL","170","ISO 3166-2:CO"],["KM","COM","174","ISO 3166-2:KM"],["CG","COG","178","ISO 3166-2:CG"],["CD","COD","180","ISO 3166-2:CD"],["CK","COK","184","ISO 3166-2:CK"],["CR","CRI","188","ISO 3166-2:CR"],["CI","CIV","384","ISO 3166-2:CI"],["HR","HRV","191","ISO 3166-2:HR"],["CU","CUB","192","ISO 3166-2:CU"],["CY","CYP","196","ISO 3166-2:CY"],["CZ","CZE","203","ISO 3166-2:CZ"],["DK","DNK","208","ISO 3166-2:DK"],["DJ","DJI","262","ISO 3166-2:DJ"],["DM","DMA","212","ISO 3166-2:DM"],["DO","DOM","214","ISO 3166-2:DO"],["EC","ECU","218","ISO 3166-2:EC"],["EG","EGY","818","ISO 3166-2:EG"],["SV","SLV","222","ISO 3166-2:SV"],["GQ","GNQ","226","ISO 3166-2:GQ"],["ER","ERI","232","ISO 3166-2:ER"],["EE","EST","233","ISO 3166-2:EE"],["ET","ETH","231","ISO 3166-2:ET"],["FK","FLK","238","ISO 3166-2:FK"],["FO","FRO","234","ISO 3166-2:FO"],["FJ","FJI","242","ISO 3166-2:FJ"],["FI","FIN","246","ISO 3166-2:FI"],["FR","FRA","250","ISO 3166-2:FR"],["GF","GUF","254","ISO 3166-2:GF"],["PF","PYF","258","ISO 3166-2:PF"],["TF","ATF","260","ISO 3166-2:TF"],["GA","GAB","266","ISO 3166-2:GA"],["GM","GMB","270","ISO 3166-2:GM"],["GE","GEO","268","ISO 3166-2:GE"],["DE","DEU","276","ISO 3166-2:DE"],["GH","GHA","288","ISO 3166-2:GH"],["GI","GIB","292","ISO 3166-2:GI"],["GR","GRC","300","ISO 3166-2:GR"],["GL","GRL","304","ISO 3166-2:GL"],["GD","GRD","308","ISO 3166-2:GD"],["GP","GLP","312","ISO 3166-2:GP"],["GU","GUM","316","ISO 3166-2:GU"],["GT","GTM","320","ISO 3166-2:GT"],["GN","GIN","324","ISO 3166-2:GN"],["GW","GNB","624","ISO 3166-2:GW"],["GY","GUY","328","ISO 3166-2:GY"],["HT","HTI","332","ISO 3166-2:HT"],["HM","HMD","334","ISO 3166-2:HM"],["VA","VAT","336","ISO 3166-2:VA"],["HN","HND","340","ISO 3166-2:HN"],["HK","HKG","344","ISO 3166-2:HK"],["HU","HUN","348","ISO 3166-2:HU"],["IS","ISL","352","ISO 3166-2:IS"],["IN","IND","356","ISO 3166-2:IN"],["ID","IDN","360","ISO 3166-2:ID"],["IR","IRN","364","ISO 3166-2:IR"],["IQ","IRQ","368","ISO 3166-2:IQ"],["IE","IRL","372","ISO 3166-2:IE"],["IL","ISR","376","ISO 3166-2:IL"],["IT","ITA","380","ISO 3166-2:IT"],["JM","JAM","388","ISO 3166-2:JM"],["JP","JPN","392","ISO 3166-2:JP"],["JO","JOR","400","ISO 3166-2:JO"],["KZ","KAZ","398","ISO 3166-2:KZ"],["KE","KEN","404","ISO 3166-2:KE"],["KI","KIR","296","ISO 3166-2:KI"],["KP","PRK","408","ISO 3166-2:KP"],["KR","KOR","410","ISO 3166-2:KR"],["KW","KWT","414","ISO 3166-2:KW"],["KG","KGZ","417","ISO 3166-2:KG"],["LA","LAO","418","ISO 3166-2:LA"],["LV","LVA","428","ISO 3166-2:LV"],["LB","LBN","422","ISO 3166-2:LB"],["LS","LSO","426","ISO 3166-2:LS"],["LR","LBR","430","ISO 3166-2:LR"],["LY","LBY","434","ISO 3166-2:LY"],["LI","LIE","438","ISO 3166-2:LI"],["LT","LTU","440","ISO 3166-2:LT"],["LU","LUX","442","ISO 3166-2:LU"],["MO","MAC","446","ISO 3166-2:MO"],["MG","MDG","450","ISO 3166-2:MG"],["MW","MWI","454","ISO 3166-2:MW"],["MY","MYS","458","ISO 3166-2:MY"],["MV","MDV","462","ISO 3166-2:MV"],["ML","MLI","466","ISO 3166-2:ML"],["MT","MLT","470","ISO 3166-2:MT"],["MH","MHL","584","ISO 3166-2:MH"],["MQ","MTQ","474","ISO 3166-2:MQ"],["MR","MRT","478","ISO 3166-2:MR"],["MU","MUS","480","ISO 3166-2:MU"],["YT","MYT","175","ISO 3166-2:YT"],["MX","MEX","484","ISO 3166-2:MX"],["FM","FSM","583","ISO 3166-2:FM"],["MD","MDA","498","ISO 3166-2:MD"],["MC","MCO","492","ISO 3166-2:MC"],["MN","MNG","496","ISO 3166-2:MN"],["MS","MSR","500","ISO 3166-2:MS"],["MA","MAR","504","ISO 3166-2:MA"],["MZ","MOZ","508","ISO 3166-2:MZ"],["MM","MMR","104","ISO 3166-2:MM"],["NA","NAM","516","ISO 3166-2:NA"],["NR","NRU","520","ISO 3166-2:NR"],["NP","NPL","524","ISO 3166-2:NP"],["NL","NLD","528","ISO 3166-2:NL"],["NC","NCL","540","ISO 3166-2:NC"],["NZ","NZL","554","ISO 3166-2:NZ"],["NI","NIC","558","ISO 3166-2:NI"],["NE","NER","562","ISO 3166-2:NE"],["NG","NGA","566","ISO 3166-2:NG"],["NU","NIU","570","ISO 3166-2:NU"],["NF","NFK","574","ISO 3166-2:NF"],["MP","MNP","580","ISO 3166-2:MP"],["MK","MKD","807","ISO 3166-2:MK"],["NO","NOR","578","ISO 3166-2:NO"],["OM","OMN","512","ISO 3166-2:OM"],["PK","PAK","586","ISO 3166-2:PK"],["PW","PLW","585","ISO 3166-2:PW"],["PS","PSE","275","ISO 3166-2:PS"],["PA","PAN","591","ISO 3166-2:PA"],["PG","PNG","598","ISO 3166-2:PG"],["PY","PRY","600","ISO 3166-2:PY"],["PE","PER","604","ISO 3166-2:PE"],["PH","PHL","608","ISO 3166-2:PH"],["PN","PCN","612","ISO 3166-2:PN"],["PL","POL","616","ISO 3166-2:PL"],["PT","PRT","620","ISO 3166-2:PT"],["PR","PRI","630","ISO 3166-2:PR"],["QA","QAT","634","ISO 3166-2:QA"],["RE","REU","638","ISO 3166-2:RE"],["RO","ROU","642","ISO 3166-2:RO"],["RU","RUS","643","ISO 3166-2:RU"],["RW","RWA","646","ISO 3166-2:RW"],["SH","SHN","654","ISO 3166-2:SH"],["KN","KNA","659","ISO 3166-2:KN"],["LC","LCA","662","ISO 3166-2:LC"],["PM","SPM","666","ISO 3166-2:PM"],["VC","VCT","670","ISO 3166-2:VC"],["WS","WSM","882","ISO 3166-2:WS"],["SM","SMR","674","ISO 3166-2:SM"],["ST","STP","678","ISO 3166-2:ST"],["SA","SAU","682","ISO 3166-2:SA"],["SN","SEN","686","ISO 3166-2:SN"],["SC","SYC","690","ISO 3166-2:SC"],["SL","SLE","694","ISO 3166-2:SL"],["SG","SGP","702","ISO 3166-2:SG"],["SK","SVK","703","ISO 3166-2:SK"],["SI","SVN","705","ISO 3166-2:SI"],["SB","SLB","090","ISO 3166-2:SB"],["SO","SOM","706","ISO 3166-2:SO"],["ZA","ZAF","710","ISO 3166-2:ZA"],["GS","SGS","239","ISO 3166-2:GS"],["ES","ESP","724","ISO 3166-2:ES"],["LK","LKA","144","ISO 3166-2:LK"],["SD","SDN","729","ISO 3166-2:SD"],["SR","SUR","740","ISO 3166-2:SR"],["SJ","SJM","744","ISO 3166-2:SJ"],["SZ","SWZ","748","ISO 3166-2:SZ"],["SE","SWE","752","ISO 3166-2:SE"],["CH","CHE","756","ISO 3166-2:CH"],["SY","SYR","760","ISO 3166-2:SY"],["TW","TWN","158","ISO 3166-2:TW"],["TJ","TJK","762","ISO 3166-2:TJ"],["TZ","TZA","834","ISO 3166-2:TZ"],["TH","THA","764","ISO 3166-2:TH"],["TL","TLS","626","ISO 3166-2:TL"],["TG","TGO","768","ISO 3166-2:TG"],["TK","TKL","772","ISO 3166-2:TK"],["TO","TON","776","ISO 3166-2:TO"],["TT","TTO","780","ISO 3166-2:TT"],["TN","TUN","788","ISO 3166-2:TN"],["TR","TUR","792","ISO 3166-2:TR"],["TM","TKM","795","ISO 3166-2:TM"],["TC","TCA","796","ISO 3166-2:TC"],["TV","TUV","798","ISO 3166-2:TV"],["UG","UGA","800","ISO 3166-2:UG"],["UA","UKR","804","ISO 3166-2:UA"],["AE","ARE","784","ISO 3166-2:AE"],["GB","GBR","826","ISO 3166-2:GB"],["US","USA","840","ISO 3166-2:US"],["UM","UMI","581","ISO 3166-2:UM"],["UY","URY","858","ISO 3166-2:UY"],["UZ","UZB","860","ISO 3166-2:UZ"],["VU","VUT","548","ISO 3166-2:VU"],["VE","VEN","862","ISO 3166-2:VE"],["VN","VNM","704","ISO 3166-2:VN"],["VG","VGB","092","ISO 3166-2:VG"],["VI","VIR","850","ISO 3166-2:VI"],["WF","WLF","876","ISO 3166-2:WF"],["EH","ESH","732","ISO 3166-2:EH"],["YE","YEM","887","ISO 3166-2:YE"],["ZM","ZMB","894","ISO 3166-2:ZM"],["ZW","ZWE","716","ISO 3166-2:ZW"],["AX","ALA","248","ISO 3166-2:AX"],["BQ","BES","535","ISO 3166-2:BQ"],["CW","CUW","531","ISO 3166-2:CW"],["GG","GGY","831","ISO 3166-2:GG"],["IM","IMN","833","ISO 3166-2:IM"],["JE","JEY","832","ISO 3166-2:JE"],["ME","MNE","499","ISO 3166-2:ME"],["BL","BLM","652","ISO 3166-2:BL"],["MF","MAF","663","ISO 3166-2:MF"],["RS","SRB","688","ISO 3166-2:RS"],["SX","SXM","534","ISO 3166-2:SX"],["SS","SSD","728","ISO 3166-2:SS"],["XK","XKX","983","ISO 3166-2:XK"]]')},"./node_modules/i18n-iso-countries/langs/no.json":module=>{"use strict";module.exports=JSON.parse('{"locale":"no","countries":{"AF":"Afghanistan","AL":"Albania","DZ":"Algerie","AS":"Amerikansk Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarktis","AG":"Antigua og Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Østerrike","AZ":"Aserbajdsjan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Hviterussland","BE":"Belgia","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia-Hercegovina","BW":"Botswana","BV":"Bouvetøya","BR":"Brasil","IO":"Det britiske territoriet i Indiahavet","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Kambodsja","CM":"Kamerun","CA":"Canada","CV":"Kapp Verde","KY":"Caymanøyene","CF":"Den sentralafrikanske republikk","TD":"Tsjad","CL":"Chile","CN":"Kina","CX":"Christmasøya","CC":"Kokosøyene","CO":"Colombia","KM":"Komorene","CG":"Kongo-Brazzaville","CD":"Kongo","CK":"Cookøyene","CR":"Costa Rica","CI":"Elfenbenskysten","HR":"Kroatia","CU":"Cuba","CY":"Kypros","CZ":"Tsjekkia","DK":"Danmark","DJ":"Djibouti","DM":"Dominica","DO":"Den dominikanske republikk","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Ekvatorial-Guinea","ER":"Eritrea","EE":"Estland","ET":"Etiopia","FK":"Falklandsøyene","FO":"Færøyene","FJ":"Fiji","FI":"Finland","FR":"Frankrike","GF":"Fransk Guyana","PF":"Fransk Polynesia","TF":"De franske sørterritorier","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Tyskland","GH":"Ghana","GI":"Gibraltar","GR":"Hellas","GL":"Grønland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard- og McDonaldøyene","VA":"Vatikanstaten","HN":"Honduras","HK":"Hongkong SAR Kina","HU":"Ungarn","IS":"Island","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Irak","IE":"Irland","IL":"Israel","IT":"Italia","JM":"Jamaica","JP":"Japan","JO":"Jordan","KZ":"Kasakhstan","KE":"Kenya","KI":"Kiribati","KP":"Nord-Korea","KR":"Sør-Korea","KW":"Kuwait","KG":"Kirgisistan","LA":"Laos","LV":"Latvia","LB":"Libanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Litauen","LU":"Luxemburg","MO":"Macao SAR Kina","MG":"Madagaskar","MW":"Malawi","MY":"Malaysia","MV":"Maldivene","ML":"Mali","MT":"Malta","MH":"Marshalløyene","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Mikronesiaføderasjonen","MD":"Moldova","MC":"Monaco","MN":"Mongolia","MS":"Montserrat","MA":"Marokko","MZ":"Mosambik","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Nederland","NC":"Ny-Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolkøya","MK":"Nord-Makedonia","MP":"Nord-Marianene","NO":"Norge","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Det palestinske området","PA":"Panama","PG":"Papua Ny-Guinea","PY":"Paraguay","PE":"Peru","PH":"Filippinene","PN":"Pitcairnøyene","PL":"Polen","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Réunion","RO":"Romania","RU":"Russland","RW":"Rwanda","SH":"St. Helena","KN":"Saint Kitts og Nevis","LC":"St. Lucia","PM":"Saint-Pierre-et-Miquelon","VC":"St. Vincent og Grenadinene","WS":"Samoa","SM":"San Marino","ST":"São Tomé og Príncipe","SA":"Saudi-Arabia","SN":"Senegal","SC":"Seychellene","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Salomonøyene","SO":"Somalia","ZA":"Sør-Afrika","GS":"Sør-Georgia og Sør-Sandwichøyene","ES":"Spania","LK":"Sri Lanka","SD":"Sudan","SR":"Surinam","SJ":"Svalbard og Jan Mayen","SZ":"Eswatini","SE":"Sverige","CH":"Sveits","SY":"Syria","TW":"Taiwan","TJ":"Tadsjikistan","TZ":"Tanzania","TH":"Thailand","TL":"Øst-Timor","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad og Tobago","TN":"Tunisia","TR":"Tyrkia","TM":"Turkmenistan","TC":"Turks- og Caicosøyene","TV":"Tuvalu","UG":"Uganda","UA":"Ukraina","AE":"De forente arabiske emirater","GB":"Storbritannia","US":"USA","UM":"USAs ytre øyer","UY":"Uruguay","UZ":"Usbekistan","VU":"Vanuatu","VE":"Venezuela","VN":"Vietnam","VG":"De britiske jomfruøyene","VI":"De amerikanske jomfruøyene","WF":"Wallis og Futuna","EH":"Vest-Sahara","YE":"Jemen","ZM":"Zambia","ZW":"Zimbabwe","AX":"Åland","BQ":"Karibisk Nederland","CW":"Curaçao","GG":"Guernsey","IM":"Man","JE":"Jersey","ME":"Montenegro","BL":"Saint-Barthélemy","MF":"Saint-Martin","RS":"Serbia","SX":"Sint Maarten","SS":"Sør-Sudan","XK":"Kosovo"}}')},"./node_modules/i18n-iso-countries/supportedLocales.json":module=>{"use strict";module.exports=JSON.parse('["br","cy","dv","sw","eu","af","am","ha","ku","ml","no","ps","sd","so","sq","ta","tg","tt","ug","ur","vi","ar","az","be","bg","bn","bs","ca","cs","da","de","el","en","es","et","fa","fi","fr","gl","he","hi","hr","hu","hy","id","is","it","ja","ka","kk","km","ko","ky","lt","lv","mk","mn","mr","ms","nb","nl","nn","pl","pt","ro","ru","sk","sl","sr","sv","th","tr","uk","uz","zh"]')}}]);