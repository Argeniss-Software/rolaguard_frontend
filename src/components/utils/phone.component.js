import * as React from "react";
import { Dropdown, Grid, Input, Form } from 'semantic-ui-react'

import "./phone.component.css";

class PhoneComponent extends React.Component {

  constructor(props) {
    super(props);

    const phone = props.currentPhone ? props.currentPhone.split('-') : '' ;
    const phoneNumber = this.getCountryCodeAndPhone(phone);

    this.state = {
      countryCode: phoneNumber.countryCode,
      number: phoneNumber.number,
      countries: [
        {
          "text":"Empty",
          "value":"",
          "key":1000,
          "flag":""
        },
        {
          "text":"Afghanistan (+93)",
          "value":"+93",
          "key":0,
          "flag":"af"
        },
        {
          "text":"Albania (+355)",
          "value":"+355",
          "key":1,
          "flag":"al"
        },
        {
          "text":"Algeria (+213)",
          "value":"+213",
          "key":2,
          "flag":"dz"
        },
        {
          "text":"American Samoa (+1684)",
          "value":"+1684",
          "key":3,
          "flag":"ws"
        },
        {
          "text":"Andorra (+376)",
          "value":"+376",
          "key":4,
          "flag":"ad"
        },
        {
          "text":"Angola (+244)",
          "value":"+244",
          "key":5,
          "flag":"ao"
        },
        {
          "text":"Anguilla (+1264)",
          "value":"+1264",
          "key":6,
          "flag":"ai"
        },
        {
          "text":"Antarctica (Australian bases) (+6721)",
          "value":"+6721",
          "key":7,
          "flag":"au"
        },
        {
          "text":"Antigua and Barbuda (+1268)",
          "value":"+1268",
          "key":8,
          "flag":"ag"
        },
        {
          "text":"Argentina (+54)",
          "value":"+54",
          "key":9,
          "flag":"ar"
        },
        {
          "text":"Armenia (+374)",
          "value":"+374",
          "key":10,
          "flag":"am"
        },
        {
          "text":"Aruba (+297)",
          "value":"+297",
          "key":11,
          "flag":"aw"
        },
        {
          "text":"Ascension (+247)",
          "value":"+247",
          "key":12
        },
        {
          "text":"Australia (+61)",
          "value":"+61",
          "key":13,
          "flag":"au"
        },
        {
          "text":"Austria (+43)",
          "value":"+43",
          "key":14,
          "flag":"at"
        },
        {
          "text":"Azerbaijan (+994)",
          "value":"+994",
          "key":15,
          "flag":"az"
        },
        {
          "text":"Bahamas (+1242)",
          "value":"+1242",
          "key":16,
          "flag":"bs"
        },
        {
          "text":"Bahrain (+973)",
          "value":"+973",
          "key":17,
          "flag":"bh"
        },
        {
          "text":"Bangladesh (+880)",
          "value":"+880",
          "key":18,
          "flag":"bd"
        },
        {
          "text":"Barbados (+1246)",
          "value":"+1246",
          "key":19,
          "flag":"bb"
        },
        {
          "text":"Belarus (+375)",
          "value":"+375",
          "key":20,
          "flag":"by"
        },
        {
          "text":"Belgium (+32)",
          "value":"+32",
          "key":21,
          "flag":"be"
        },
        {
          "text":"Belize (+501)",
          "value":"+501",
          "key":22,
          "flag":"bz"
        },
        {
          "text":"Benin (+229)",
          "value":"+229",
          "key":23,
          "flag":"bj"
        },
        {
          "text":"Bermuda (+1441)",
          "value":"+1441",
          "key":24,
          "flag":"bm"
        },
        {
          "text":"Bhutan (+975)",
          "value":"+975",
          "key":25,
          "flag":"bt"
        },
        {
          "text":"Bolivia (+591)",
          "value":"+591",
          "key":26,
          "flag":"bo"
        },
        {
          "text":"Bonaire (+599)",
          "value":"+599",
          "key":27
        },
        {
          "text":"Bosnia and Herzegovina (+387)",
          "value":"+387",
          "key":28,
          "flag":"ba"
        },
        {
          "text":"Botswana (+267)",
          "value":"+267",
          "key":29,
          "flag":"bw"
        },
        {
          "text":"Brazil (+55)",
          "value":"+55",
          "key":30,
          "flag":"br"
        },
        {
          "text":"British Virgin Islands (+1284)",
          "value":"+1284",
          "key":31,
          "flag":"vg"
        },
        {
          "text":"Brunei (+673)",
          "value":"+673",
          "key":32,
          "flag":"bn"
        },
        {
          "text":"Bulgaria (+359)",
          "value":"+359",
          "key":33,
          "flag":"bg"
        },
        {
          "text":"Burkina Faso (+226)",
          "value":"+226",
          "key":34,
          "flag":"bf"
        },
        {
          "text":"Burundi (+257)",
          "value":"+257",
          "key":35,
          "flag":"bi"
        },
        {
          "text":"Cabo Verde (+238)",
          "value":"+238",
          "key":36
        },
        {
          "text":"Cambodia (+855)",
          "value":"+855",
          "key":37,
          "flag":"kh"
        },
        {
          "text":"Cameroon (+237)",
          "value":"+237",
          "key":38,
          "flag":"cm"
        },
        {
          "text":"Canada (+1)",
          "value":"+1",
          "key":39,
          "flag":"ca"
        },
        {
          "text":"Cayman Islands (+1345)",
          "value":"+1345",
          "key":40,
          "flag":"ky"
        },
        {
          "text":"Central African Republic (+236)",
          "value":"+236",
          "key":41,
          "flag":"cf"
        },
        {
          "text":"Chad (+235)",
          "value":"+235",
          "key":42,
          "flag":"td"
        },
        {
          "text":"Chile (+56)",
          "value":"+56",
          "key":43,
          "flag":"cl"
        },
        {
          "text":"China (+86)",
          "value":"+86",
          "key":44,
          "flag":"cn"
        },
        {
          "text":"Colombia (+57)",
          "value":"+57",
          "key":45,
          "flag":"co"
        },
        {
          "text":"Comoros (+269)",
          "value":"+269",
          "key":46,
          "flag":"km"
        },
        {
          "text":"Congo, Democratic Republic of the (+243)",
          "value":"+243",
          "key":47,
          "flag":"cd"
        },
        {
          "text":"Congo, Republic of the (+242)",
          "value":"+242",
          "key":48,
          "flag":"cd"
        },
        {
          "text":"Cook Islands (+682)",
          "value":"+682",
          "key":49,
          "flag":"ck"
        },
        {
          "text":"Costa Rica (+506)",
          "value":"+506",
          "key":50,
          "flag":"cr"
        },
        {
          "text":"Cote d'Ivoire (+225)",
          "value":"+225",
          "key":51
        },
        {
          "text":"Croatia (+385)",
          "value":"+385",
          "key":52,
          "flag":"hr"
        },
        {
          "text":"Cuba (+53)",
          "value":"+53",
          "key":53,
          "flag":"cu"
        },
        {
          "text":"Curaçao (+599)",
          "value":"+599",
          "key":54
        },
        {
          "text":"Cyprus (+357)",
          "value":"+357",
          "key":55,
          "flag":"cy"
        },
        {
          "text":"Czech Republic (+420)",
          "value":"+420",
          "key":56,
          "flag":"cz"
        },
        {
          "text":"Denmark (+45)",
          "value":"+45",
          "key":57,
          "flag":"dk"
        },
        {
          "text":"Diego Garcia (+246)",
          "value":"+246",
          "key":58
        },
        {
          "text":"Djibouti (+253)",
          "value":"+253",
          "key":59,
          "flag":"dj"
        },
        {
          "text":"Dominica (+1767)",
          "value":"+1767",
          "key":60,
          "flag":"dm"
        },
        {
          "text":"Dominican Republic (+1809)",
          "value":"+1809",
          "key":61,
          "flag":"do"
        },
        {
          "text":"Dominican Republic (+1829)",
          "value":"+1829",
          "key":62,
          "flag":"do"
        },
        {
          "text":"Dominican Republic (+1849)",
          "value":"+1849",
          "key":63,
          "flag":"do"
        },
        {
          "text":"Ecuador (+593)",
          "value":"+593",
          "key":64,
          "flag":"ec"
        },
        {
          "text":"Egypt (+20)",
          "value":"+20",
          "key":65,
          "flag":"eg"
        },
        {
          "text":"El Salvador (+503)",
          "value":"+503",
          "key":66,
          "flag":"sv"
        },
        {
          "text":"Equatorial Guinea (+240)",
          "value":"+240",
          "key":67,
          "flag":"gn"
        },
        {
          "text":"Eritrea (+291)",
          "value":"+291",
          "key":68,
          "flag":"er"
        },
        {
          "text":"Estonia (+372)",
          "value":"+372",
          "key":69,
          "flag":"ee"
        },
        {
          "text":"Eswatini (+268)",
          "value":"+268",
          "key":70
        },
        {
          "text":"Ethiopia (+251)",
          "value":"+251",
          "key":71,
          "flag":"et"
        },
        {
          "text":"Falkland Islands (+500)",
          "value":"+500",
          "key":72,
          "flag":"fk"
        },
        {
          "text":"Faroe Islands (+298)",
          "value":"+298",
          "key":73,
          "flag":"fo"
        },
        {
          "text":"Fiji (+679)",
          "value":"+679",
          "key":74,
          "flag":"fj"
        },
        {
          "text":"Finland (+358)",
          "value":"+358",
          "key":75,
          "flag":"fi"
        },
        {
          "text":"France (+33)",
          "value":"+33",
          "key":76,
          "flag":"fr"
        },
        {
          "text":"French Guiana (+594)",
          "value":"+594",
          "key":77,
          "flag":"gf"
        },
        {
          "text":"French Polynesia (+689)",
          "value":"+689",
          "key":78,
          "flag":"pf"
        },
        {
          "text":"Gabon (+241)",
          "value":"+241",
          "key":79,
          "flag":"ga"
        },
        {
          "text":"Gambia (+220)",
          "value":"+220",
          "key":80,
          "flag":"gm"
        },
        {
          "text":"Georgia (+995)",
          "value":"+995",
          "key":81,
          "flag":"ge"
        },
        {
          "text":"Germany (+49)",
          "value":"+49",
          "key":82,
          "flag":"de"
        },
        {
          "text":"Ghana (+233)",
          "value":"+233",
          "key":83,
          "flag":"gh"
        },
        {
          "text":"Gibraltar (+350)",
          "value":"+350",
          "key":84,
          "flag":"gi"
        },
        {
          "text":"Greece (+30)",
          "value":"+30",
          "key":85,
          "flag":"gr"
        },
        {
          "text":"Greenland (+299)",
          "value":"+299",
          "key":86,
          "flag":"gl"
        },
        {
          "text":"Grenada (+1473)",
          "value":"+1473",
          "key":87,
          "flag":"gd"
        },
        {
          "text":"Guadeloupe (+590)",
          "value":"+590",
          "key":88,
          "flag":"gp"
        },
        {
          "text":"Guam (+1671)",
          "value":"+1671",
          "key":89,
          "flag":"gu"
        },
        {
          "text":"Guatemala (+502)",
          "value":"+502",
          "key":90,
          "flag":"gt"
        },
        {
          "text":"Guinea (+224)",
          "value":"+224",
          "key":91,
          "flag":"gn"
        },
        {
          "text":"Guinea-Bissau (+245)",
          "value":"+245",
          "key":92,
          "flag":"gw"
        },
        {
          "text":"Guyana (+592)",
          "value":"+592",
          "key":93,
          "flag":"gy"
        },
        {
          "text":"Haiti (+509)",
          "value":"+509",
          "key":94,
          "flag":"ht"
        },
        {
          "text":"Honduras (+504)",
          "value":"+504",
          "key":95,
          "flag":"hn"
        },
        {
          "text":"Hong Kong (+852)",
          "value":"+852",
          "key":96,
          "flag":"hk"
        },
        {
          "text":"Hungary (+36)",
          "value":"+36",
          "key":97,
          "flag":"hu"
        },
        {
          "text":"Iceland (+354)",
          "value":"+354",
          "key":98,
          "flag":"is"
        },
        {
          "text":"India (+91)",
          "value":"+91",
          "key":99,
          "flag":"in"
        },
        {
          "text":"Indonesia (+62)",
          "value":"+62",
          "key":100,
          "flag":"id"
        },
        {
          "text":"Iran (+98)",
          "value":"+98",
          "key":101,
          "flag":"ir"
        },
        {
          "text":"Iraq (+964)",
          "value":"+964",
          "key":102,
          "flag":"iq"
        },
        {
          "text":"Ireland (Eire) (+353)",
          "value":"+353",
          "key":103,
          "flag":"ie"
        },
        {
          "text":"Israel (+972)",
          "value":"+972",
          "key":104,
          "flag":"il"
        },
        {
          "text":"Italy (+39)",
          "value":"+39",
          "key":105,
          "flag":"it"
        },
        {
          "text":"Jamaica (+1876)",
          "value":"+1876",
          "key":106,
          "flag":"jm"
        },
        {
          "text":"Japan (+81)",
          "value":"+81",
          "key":107,
          "flag":"jp"
        },
        {
          "text":"Jordan (+962)",
          "value":"+962",
          "key":108,
          "flag":"jo"
        },
        {
          "text":"Kazakhstan (+7)",
          "value":"+7",
          "key":109,
          "flag":"kz"
        },
        {
          "text":"Kenya (+254)",
          "value":"+254",
          "key":110,
          "flag":"ke"
        },
        {
          "text":"Kiribati (+686)",
          "value":"+686",
          "key":111,
          "flag":"ki"
        },
        {
          "text":"Kosovo (+383)",
          "value":"+383",
          "key":112
        },
        {
          "text":"Kuwait (+965)",
          "value":"+965",
          "key":113,
          "flag":"kw"
        },
        {
          "text":"Kyrgyzstan (+996)",
          "value":"+996",
          "key":114,
          "flag":"kg"
        },
        {
          "text":"Laos (+856)",
          "value":"+856",
          "key":115,
          "flag":"la"
        },
        {
          "text":"Latvia (+371)",
          "value":"+371",
          "key":116,
          "flag":"lv"
        },
        {
          "text":"Lebanon (+961)",
          "value":"+961",
          "key":117,
          "flag":"lb"
        },
        {
          "text":"Lesotho (+266)",
          "value":"+266",
          "key":118,
          "flag":"ls"
        },
        {
          "text":"Liberia (+231)",
          "value":"+231",
          "key":119,
          "flag":"lr"
        },
        {
          "text":"Libya (+218)",
          "value":"+218",
          "key":120,
          "flag":"ly"
        },
        {
          "text":"Liechtenstein (+423)",
          "value":"+423",
          "key":121,
          "flag":"li"
        },
        {
          "text":"Lithuania (+370)",
          "value":"+370",
          "key":122,
          "flag":"lt"
        },
        {
          "text":"Luxembourg (+352)",
          "value":"+352",
          "key":123,
          "flag":"lu"
        },
        {
          "text":"Macau (+853)",
          "value":"+853",
          "key":124,
          "flag":"mo"
        },
        {
          "text":"Madagascar (+261)",
          "value":"+261",
          "key":125,
          "flag":"mg"
        },
        {
          "text":"Malawi (+265)",
          "value":"+265",
          "key":126,
          "flag":"mw"
        },
        {
          "text":"Malaysia (+60)",
          "value":"+60",
          "key":127,
          "flag":"my"
        },
        {
          "text":"Maldives (+960)",
          "value":"+960",
          "key":128,
          "flag":"mv"
        },
        {
          "text":"Mali (+223)",
          "value":"+223",
          "key":129,
          "flag":"ml"
        },
        {
          "text":"Malta (+356)",
          "value":"+356",
          "key":130,
          "flag":"mt"
        },
        {
          "text":"Marshall Islands (+692)",
          "value":"+692",
          "key":131,
          "flag":"mh"
        },
        {
          "text":"Martinique (+596)",
          "value":"+596",
          "key":132,
          "flag":"mq"
        },
        {
          "text":"Mauritania (+222)",
          "value":"+222",
          "key":133,
          "flag":"mr"
        },
        {
          "text":"Mauritius (+230)",
          "value":"+230",
          "key":134,
          "flag":"mu"
        },
        {
          "text":"Mayotte (+262)",
          "value":"+262",
          "key":135,
          "flag":"yt"
        },
        {
          "text":"Mexico (+52)",
          "value":"+52",
          "key":136,
          "flag":"mx"
        },
        {
          "text":"Micronesia, Federated States of (+691)",
          "value":"+691",
          "key":137,
          "flag":"fm"
        },
        {
          "text":"Moldova (+373)",
          "value":"+373",
          "key":138,
          "flag":"md"
        },
        {
          "text":"Monaco (+377)",
          "value":"+377",
          "key":139,
          "flag":"mc"
        },
        {
          "text":"Mongolia (+976)",
          "value":"+976",
          "key":140,
          "flag":"mn"
        },
        {
          "text":"Montenegro (+382)",
          "value":"+382",
          "key":141,
          "flag":"me"
        },
        {
          "text":"Montserrat (+1664)",
          "value":"+1664",
          "key":142,
          "flag":"ms"
        },
        {
          "text":"Morocco (+212)",
          "value":"+212",
          "key":143,
          "flag":"ma"
        },
        {
          "text":"Mozambique (+258)",
          "value":"+258",
          "key":144,
          "flag":"mz"
        },
        {
          "text":"Myanmar (+95)",
          "value":"+95",
          "key":145
        },
        {
          "text":"Namibia (+264)",
          "value":"+264",
          "key":146,
          "flag":"na"
        },
        {
          "text":"Nauru (+674)",
          "value":"+674",
          "key":147,
          "flag":"nr"
        },
        {
          "text":"Nepal (+977)",
          "value":"+977",
          "key":148,
          "flag":"np"
        },
        {
          "text":"Netherlands (+31)",
          "value":"+31",
          "key":149,
          "flag":"nl"
        },
        {
          "text":"New Caledonia (+687)",
          "value":"+687",
          "key":150,
          "flag":"nc"
        },
        {
          "text":"New Zealand (+64)",
          "value":"+64",
          "key":151,
          "flag":"nz"
        },
        {
          "text":"Nicaragua (+505)",
          "value":"+505",
          "key":152,
          "flag":"ni"
        },
        {
          "text":"Niger (+227)",
          "value":"+227",
          "key":153,
          "flag":"ne"
        },
        {
          "text":"Nigeria (+234)",
          "value":"+234",
          "key":154,
          "flag":"ng"
        },
        {
          "text":"Niue (+683)",
          "value":"+683",
          "key":155,
          "flag":"nu"
        },
        {
          "text":"Norfolk Island (+6723)",
          "value":"+6723",
          "key":156,
          "flag":"nf"
        },
        {
          "text":"North Korea (+850)",
          "value":"+850",
          "key":157,
          "flag":"kp"
        },
        {
          "text":"North Macedonia (+389)",
          "value":"+389",
          "key":158,
          "flag":"mk"
        },
        {
          "text":"Northern Mariana Islands (+1670)",
          "value":"+1670",
          "key":159,
          "flag":"mp"
        },
        {
          "text":"Norway (+47)",
          "value":"+47",
          "key":160,
          "flag":"no"
        },
        {
          "text":"Oman (+968)",
          "value":"+968",
          "key":161,
          "flag":"om"
        },
        {
          "text":"Pakistan (+92)",
          "value":"+92",
          "key":162,
          "flag":"pk"
        },
        {
          "text":"Palau (+680)",
          "value":"+680",
          "key":163,
          "flag":"pw"
        },
        {
          "text":"Palestine (+970)",
          "value":"+970",
          "key":164,
          "flag":"ps"
        },
        {
          "text":"Panama (+507)",
          "value":"+507",
          "key":165,
          "flag":"pa"
        },
        {
          "text":"Papua New Guinea (+675)",
          "value":"+675",
          "key":166,
          "flag":"pg"
        },
        {
          "text":"Paraguay (+595)",
          "value":"+595",
          "key":167,
          "flag":"py"
        },
        {
          "text":"Peru (+51)",
          "value":"+51",
          "key":168,
          "flag":"pe"
        },
        {
          "text":"Philippines (+63)",
          "value":"+63",
          "key":169,
          "flag":"ph"
        },
        {
          "text":"Poland (+48)",
          "value":"+48",
          "key":170,
          "flag":"pl"
        },
        {
          "text":"Portugal (+351)",
          "value":"+351",
          "key":171,
          "flag":"pt"
        },
        {
          "text":"Puerto Rico 1787 and 193(+9)",
          "value":"+17871939",
          "key":172,
          "flag":"pr"
        },
        {
          "text":"Qatar (+974)",
          "value":"+974",
          "key":173,
          "flag":"qa"
        },
        {
          "text":"Reunion (+262)",
          "value":"+262",
          "key":174,
          "flag":"re"
        },
        {
          "text":"Romania (+40)",
          "value":"+40",
          "key":175,
          "flag":"ro"
        },
        {
          "text":"Russia (+7)",
          "value":"+7",
          "key":176,
          "flag":"ru"
        },
        {
          "text":"Rwanda (+250)",
          "value":"+250",
          "key":177,
          "flag":"rw"
        },
        {
          "text":"Saba (+599)",
          "value":"+599",
          "key":178
        },
        {
          "text":"Saint-Barthelemy (+590)",
          "value":"+590",
          "key":179
        },
        {
          "text":"Saint Helena (+290)",
          "value":"+290",
          "key":180,
          "flag":"sh"
        },
        {
          "text":"Saint Kitts and Nevis (+1869)",
          "value":"+1869",
          "key":181,
          "flag":"kn"
        },
        {
          "text":"Saint Lucia (+1758)",
          "value":"+1758",
          "key":182,
          "flag":"lc"
        },
        {
          "text":"Saint Martin (French side) (+590)",
          "value":"+590",
          "key":183
        },
        {
          "text":"Saint Pierre and Miquelon (+508)",
          "value":"+508",
          "key":184,
          "flag":"pm"
        },
        {
          "text":"Saint Vincent and the Grenadines (+1784)",
          "value":"+1784",
          "key":185,
          "flag":"vc"
        },
        {
          "text":"Samoa (+685)",
          "value":"+685",
          "key":186,
          "flag":"ws"
        },
        {
          "text":"San Marino (+378)",
          "value":"+378",
          "key":187,
          "flag":"sm"
        },
        {
          "text":"Sao Tome and Principe (+239)",
          "value":"+239",
          "key":188,
          "flag":"st"
        },
        {
          "text":"Saudi Arabia (+966)",
          "value":"+966",
          "key":189,
          "flag":"sa"
        },
        {
          "text":"Senegal (+221)",
          "value":"+221",
          "key":190,
          "flag":"sn"
        },
        {
          "text":"Serbia (+381)",
          "value":"+381",
          "key":191,
          "flag":"rs"
        },
        {
          "text":"Seychelles (+248)",
          "value":"+248",
          "key":192,
          "flag":"sc"
        },
        {
          "text":"Sierra Leone (+232)",
          "value":"+232",
          "key":193,
          "flag":"sl"
        },
        {
          "text":"Singapore (+65)",
          "value":"+65",
          "key":194,
          "flag":"sg"
        },
        {
          "text":"Sint Eustatius (+599)",
          "value":"+599",
          "key":195
        },
        {
          "text":"Sint Maarten (Dutch side) (+1721)",
          "value":"+1721",
          "key":196
        },
        {
          "text":"Slovakia (+421)",
          "value":"+421",
          "key":197,
          "flag":"sk"
        },
        {
          "text":"Slovenia (+386)",
          "value":"+386",
          "key":198,
          "flag":"si"
        },
        {
          "text":"Solomon Islands (+677)",
          "value":"+677",
          "key":199,
          "flag":"sb"
        },
        {
          "text":"Somalia (+252)",
          "value":"+252",
          "key":200,
          "flag":"so"
        },
        {
          "text":"South Africa (+27)",
          "value":"+27",
          "key":201,
          "flag":"za"
        },
        {
          "text":"South Korea (+82)",
          "value":"+82",
          "key":202,
          "flag":"kr"
        },
        {
          "text":"South Sudan (+211)",
          "value":"+211",
          "key":203,
          "flag":"sd"
        },
        {
          "text":"Spain (+34)",
          "value":"+34",
          "key":204,
          "flag":"es"
        },
        {
          "text":"Sri Lanka (+94)",
          "value":"+94",
          "key":205,
          "flag":"lk"
        },
        {
          "text":"Sudan (+249)",
          "value":"+249",
          "key":206,
          "flag":"sd"
        },
        {
          "text":"Suriname (+597)",
          "value":"+597",
          "key":207,
          "flag":"sr"
        },
        {
          "text":"Sweden (+46)",
          "value":"+46",
          "key":208,
          "flag":"se"
        },
        {
          "text":"Switzerland (+41)",
          "value":"+41",
          "key":209,
          "flag":"ch"
        },
        {
          "text":"Syria (+963)",
          "value":"+963",
          "key":210,
          "flag":"sy"
        },
        {
          "text":"Taiwan (+886)",
          "value":"+886",
          "key":211,
          "flag":"tw"
        },
        {
          "text":"Tajikistan (+992)",
          "value":"+992",
          "key":212,
          "flag":"tj"
        },
        {
          "text":"Tanzania (+255)",
          "value":"+255",
          "key":213,
          "flag":"tz"
        },
        {
          "text":"Thailand (+66)",
          "value":"+66",
          "key":214,
          "flag":"th"
        },
        {
          "text":"Timor-Leste (+670)",
          "value":"+670",
          "key":215
        },
        {
          "text":"Togo (+228)",
          "value":"+228",
          "key":216,
          "flag":"tg"
        },
        {
          "text":"Tokelau (+690)",
          "value":"+690",
          "key":217,
          "flag":"tk"
        },
        {
          "text":"Tonga (+676)",
          "value":"+676",
          "key":218,
          "flag":"to"
        },
        {
          "text":"Trinidad and Tobago (+1868)",
          "value":"+1868",
          "key":219,
          "flag":"tt"
        },
        {
          "text":"Tristan da Cunha (+290)",
          "value":"+290",
          "key":220
        },
        {
          "text":"Tunisia (+216)",
          "value":"+216",
          "key":221,
          "flag":"tn"
        },
        {
          "text":"Turkey (+90)",
          "value":"+90",
          "key":222,
          "flag":"tr"
        },
        {
          "text":"Turkmenistan (+993)",
          "value":"+993",
          "key":223,
          "flag":"tm"
        },
        {
          "text":"Turks and Caicos Islands (+1649)",
          "value":"+1649",
          "key":224,
          "flag":"tc"
        },
        {
          "text":"Tuvalu (+688)",
          "value":"+688",
          "key":225,
          "flag":"tv"
        },
        {
          "text":"Uganda (+256)",
          "value":"+256",
          "key":226,
          "flag":"ug"
        },
        {
          "text":"Ukraine (+380)",
          "value":"+380",
          "key":227,
          "flag":"ua"
        },
        {
          "text":"United Arab Emirates (+971)",
          "value":"+971",
          "key":228
        },
        {
          "text":"United Kingdom (+44)",
          "value":"+44",
          "key":229,
          "flag":"gb"
        },
        {
          "text":"United States of America (+1)",
          "value":"+1",
          "key":230,
          "flag":"us"
        },
        {
          "text":"Uruguay (+598)",
          "value":"+598",
          "key":231,
          "flag":"uy"
        },
        {
          "text":"Uzbekistan (+998)",
          "value":"+998",
          "key":232,
          "flag":"uz"
        },
        {
          "text":"Vanuatu (+678)",
          "value":"+678",
          "key":233,
          "flag":"vu"
        },
        {
          "text":"Vatican City State (+39)",
          "value":"+39",
          "key":234,
          "flag":"va"
        },
        {
          "text":"Venezuela (+58)",
          "value":"+58",
          "key":235,
          "flag":"ve"
        },
        {
          "text":"Vietnam (+84)",
          "value":"+84",
          "key":236,
          "flag":"vn"
        },
        {
          "text":"U.S. Virgin Islands (+1340)",
          "value":"+1340",
          "key":237
        },
        {
          "text":"Wallis and Futuna (+681)",
          "value":"+681",
          "key":238,
          "flag":"wf"
        },
        {
          "text":"Yemen (+967)",
          "value":"+967",
          "key":239,
          "flag":"ye"
        },
        {
          "text":"Zambia (+260)",
          "value":"+260",
          "key":240,
          "flag":"zm"
        },
        {
          "text":"Zimbabwe (+263)",
          "value":"+263",
          "key":241,
          "flag":"zw"
        }
      ]
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.currentPhone !== this.props.currentPhone) {
      const phone = this.props.currentPhone ? this.props.currentPhone.split('-') : '' ;
      const phoneNumber = this.getCountryCodeAndPhone(phone);

      this.setState({
        countryCode: phoneNumber.countryCode,
        number: phoneNumber.number
      })
    }
  }

  getCountryCodeAndPhone(phone) {
    let countryCode;
    let number;

    // Old phones might not have '-'
    if(phone.length === 1) {
      number = phone[0];
    } else {
      countryCode = phone[0];
      number = phone[1];
    }

    return {
      countryCode : countryCode,
      number : number
    }
  }

  handleChange = ({ name, value }, ev) => {
    this.state[ev.name] = ev.value
    const phone = (this.state.countryCode? this.state.countryCode : "") + "-" + (this.state.number ? this.state.number : "");

    this.props.onPhoneChange(phone === "-" ? "": phone);
  }

  render() {
    return (
      <div className="form-label form-css-label">
        <Grid style={{display: "initial"}}>
          <Grid.Column id="phone-component-country-code" mobile={16} tablet={8} computer={8}>
            <div className="dropdown-label-wrapper">
              <label className="dropdown-label">Phone code</label>
              <Dropdown
                required
                fluid
                search
                selection
                autoComplete="new-password"
                value={this.state.countryCode}
                name="countryCode"
                onChange={this.handleChange.bind(this)}
                options={this.state.countries}
              />
            </div>
          </Grid.Column>
          <Grid.Column id="phone-component-number" mobile={16} tablet={8} computer={8}>
            <Form.Field required>
              <Input
                required
                fluid
                value={this.state.number}
                autoComplete="new-password"
                name="number"
                onChange={this.handleChange.bind(this)}
              >
                <input />
                <label>Phone number</label>
              </Input>
            </Form.Field>

          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default PhoneComponent;
