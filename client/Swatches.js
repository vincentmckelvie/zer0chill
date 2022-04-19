
class Swatches {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
      /// shoot man
     this.shootManDefault = [
      {
        name:"assault-main-color",
        color:"1b1b1b",
        emissive:"000000"
      },{
        name:"Material.015", // assault clips
        color: "4d4d4d",
        emissive:"000000",
      },{
        name:"Material.013",
        color: "00cc02",
        emissive:"000000",
        
      },{
        name:"Red",
        color: "ff160b",
        emissive:"000000",
        
      },{
        name:"Blue",
        color: "0a34cb",
        emissive:"000000",
        
      },{
        name:"assault-sight",
        color: "363636",
        emissive:"000000",
        
      },{
        name:"Green",
        color: "c7ff00",
        emissive:"000000",
        
      },{
        name:"Grey.005",
        color: "010101",
        emissive:"000000",
        
      },{
        name:"WhiteEmissive", // bright green
        color: "010101",
        emissive:"ffd7e5",
        
      },{
        name:"whiteNonEmissive",
        color: "9c9c9c",
        emissive:"000000",
      },{
        name:"emissive",
        color: "202020",
        emissive:"0a34cb",
      },{
        name:"assault-secondcolor",
        color: "3b3b3b",
        emissive:"000000",
      }
    
      
    ];

    this.shootManDark = [
      {
        name:"assault-main-color",
        color:"030303", // bright purple
        emissive:"000000",
      },{
        name:"Material.015", // assault clips
        color:"1c1c1c",
        emissive:"000000",
      },{
        name:"Material.013",
        color:"00ff15",
        emissive:"005c01",
      },{
        name:"Red",
        color:"030303", //dark purple main color
        emissive:"000000",
      },{
        name:"Blue",
        color:"030303", // dark purple body
        emissive:"000000",
      },{
        name:"assault-sight",
        color:"00ff15",
        emissive:"000000",
      },{
        name:"Green",
        color:"1c1c1c", //dark grey
        emissive:"000000",
      },{
        name:"Grey.005",
        color:"141414",
        emissive:"000000",
      },{
        name:"WhiteEmissive", // bright green
        color: "00ff15",
        emissive:"005c01",
      },{
        name:"whiteNonEmissive",
        color: "141414",
        emissive:"000000",
      },{
        name:"emissive",
        color: "010101",
        emissive:"0f0",
      },{
        name:"assault-secondcolor",
        color: "030303",
        emissive:"000000",
      }
      
    ];


    this.shootManKawaii = [
      {
        name:"assault-main-color",
        color:"8557fa", // bright purple
        emissive:"000000",
      },{
        name:"Material.015", // assault clips
        color:"ed3bbd",
        emissive:"000000",
      },{
        name:"Material.013",
        color:"020082",
        emissive:"000000",
      },{
        name:"Red",
        color:"ed3bbd", //light yellow
        emissive:"000000",
      },{
        name:"Blue",
        color:"e1eb34", // dark purple body
        emissive:"000000",
      },{
        name:"assault-sight",
        color:"00ff15",
        emissive:"000000",
      },{
        name:"Green",
        color:"5741b0", //dark grey
        emissive:"000000",
      },{
        name:"Grey.005",
        color:"8557fa",
        emissive:"000000",
      },{
        name:"WhiteEmissive", // bright green eyes
        color: "ffffff",
        emissive:"ffffff",
      },{
        name:"whiteNonEmissive",
        color: "2eccf0", // light blue 
        emissive:"000000",
      },{
        name:"emissive",
        color: "5a5a5a",
        emissive:"00ff15",
      },{
        name:"assault-secondcolor",
        color: "ed3bbd",
        emissive:"000000",
      }
      
    ];

    this.shootManRGB = [
      {
        name:"assault-main-color",
        color:"f00", // bright purple
        emissive:"f00",
      },{
        name:"Material.015", // assault clips
        color:"0f0",
        emissive:"0f0",
      },{
        name:"Material.013",
        color:"00f",
        emissive:"00f",
      },{
        name:"Red",
        color:"f00", //light yellow
        emissive:"f00",
      },{
        name:"Blue",
        color:"00f", // dark purple body
        emissive:"00f",
      },{
        name:"assault-sight",
        color:"0f0",
        emissive:"0f0",
      },{
        name:"Green",
        color:"0f0", //dark grey
        emissive:"0f0",
      },{
        name:"Grey.005",
        color:"f00",
        emissive:"f00",
      },{
        name:"WhiteEmissive", // bright green eyes
        color: "0f0",
        emissive:"0f0",
      },{
        name:"whiteNonEmissive",
        color: "00f", // light blue 
        emissive:"00f",
      },{
        name:"emissive",
        color: "000000",
        emissive:"0f0",
      },{
        name:"assault-secondcolor",
        color: "00f",
        emissive:"000000",
      }
      
    ];



    /// STICKY

    this.stickyDefault = [
    { name : "light",
      color : "494949",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"00ccc3",
      emissive:"000000"
    },{
      name:"PinkKawaii",
      color:"4414ff",
      emissive : "000000" 
    },{
      name: "Material.012",
      color:"f7fff9",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"746b61",
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"ffa422",
      emissive:"000000"
    },{
      name:"white-eye",
      color:"cccccc",
      emissive:"000000"
    },{
      name :"blacksmile",
      color:"000000",
      emissive:"000000"
    },{
      name:"white-kawaii",
      color:"cccccc",
      emissive:"000000"
    },{
      name:"YellowKawaii",
      color:"ffa422",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"000000",
      emissive:"000000"
    },{
      name:"BlueLight",
      color:"ff0625",
      emissive:"000000"
    },{
      name:"WhiteFat",
      color:"cccccc",
      emissive:"cccccc"
    },{
      name:"DarkGreen",
      color:"042140",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"746b61",
      emissive:"000000"
    },{
      name:"Material",
      color:"f7fff9",
      emissive:"000000"
    },{
      name:"dark-sticky",
      color:"4313ff",
      emissive:"000000"
    },{
      name:"emissive",
      color:"363636",
      emissive:"ff61da"
    }
    ]

    this.stickyDark = [
    { name : "light",
      color : "030303",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"PinkKawaii",
      color:"ff6a00",
      emissive : "ff0000" 
    },{
      name: "Material.012",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"333333",
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"030303",
      emissive:"030303"
    },{
      name:"white-eye",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"blacksmile",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"white-kawaii",
      color:"0008ff",
      emissive:"1e00ff"
    },{
      name:"YellowKawaii",
      color:"030303",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"0008ff",
      emissive:"1e00ff"
    },{
      name:"BlueLight",
      color:"0008ff",
      emissive:"1e00ff"
    },{
      name:"WhiteFat",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"DarkGreen",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"333333",
      emissive:"000000"
    },{
      name:"Material",
      color:"ff6a00",
      emissive : "ff0000" 
     
    },{
      name:"dark-sticky",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"emissive",
      color:"030303",
      emissive : "ff6a00" 
    }
    ]

    this.stickyKawaii = [
    { name : "light",
      color : "e4f05d",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"ea59f7",
      emissive:"000000"
    },{
      name:"PinkKawaii",
      color:"ea59f7",
      emissive : "000000" 
    },{
      name: "Material.012",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"85ffd8",//green
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"e0e647",
      emissive:"000000"
    },{
      name:"YellowKawaii",
      color:"e0e647",
      emissive:"000000"
    },{
      name:"white-eye",
      color:"2ec96f",
      emissive:"000000"
    },{
      name:"blacksmile",
      color:"2ec96f",
      emissive:"000000"
    },{
      name:"white-kawaii",
      color:"2ec96f",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"2ec96f",
      emissive:"000000"
    },{
      name:"BlueLight",
      color:"2ec96f",
      emissive:"000000"
    },{
      name:"WhiteFat",
      color:"ffffff",
      emissive:"000000"
    },{
      name:"DarkGreen",
      color:"383854",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"41b0ae",
      emissive:"000000"
    },{
      name:"Material",
      color:"ea59f7",
      emissive : "000000" 
    },{
      name:"dark-sticky",
      color:"ea59f7",
      emissive:"000000"
    },{
      name:"emissive",
      color:"2ec96f",
      emissive : "ea59f7" 
    }
    ]


    this.stickyRGB = [
    { name : "light",
      color : "f00",
      emissive: "f00" 
    },{
      name:"emissive.001",
      color:"0f0",
      emissive:"0f0"
    },{
      name:"PinkKawaii",
      color:"00f",
      emissive : "00f" 
    },{
      name: "Material.012",
      color:"f00",
      emissive:"f00"
    },{
      name:"GreyKawaii.001",
      color:"0f0",//green
      emissive:"0f0",
    },{
      name:"YellowKawaii.001",
      color:"f00",
      emissive:"f00"
    },{
      name:"YellowKawaii",
      color:"0f0",
      emissive:"0f0"
    },{
      name:"white-eye",
      color:"00f",
      emissive:"00f"
    },{
      name:"blacksmile",
      color:"00f",
      emissive:"00f"
    },{
      name:"white-kawaii",
      color:"f00",
      emissive:"f00"
    },{
      name:"blackKawaii",
      color:"00f",
      emissive:"00f"
    },{
      name:"BlueLight",
      color:"f00",
      emissive:"f00"
    },{
      name:"WhiteFat",
      color:"f00",
      emissive:"f00"
    },{
      name:"DarkGreen",
      color:"00f",
      emissive:"00f"
    },{
      name:"GreyKawaii",
      color:"0f0",
      emissive:"0f0"
    },{
      name:"Material",
      color:"00f",
      emissive : "00f" 
    },{
      name:"dark-sticky",
      color:"00f",
      emissive:"00f"
    },{
      name:"emissive",
      color:"000",
      emissive : "f00" 
    }
    ]



    this.nitroDefault = [
    {
      name:'darkgreysub',
      color:'0a0a0a',
      emissive:'000000'
    },{
      name:'greensub',
      color:'00cc00',
      emissive:'000000'
    },{
      name:'light grey sub',
      color:'060606',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'000000',
      emissive:'ff6600'
    },{
      name:'tip.005',
      color:'00cb03',
      emissive:'000000'
    },{
      name:'GreenPunk',
      color:'00cb03',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'606060',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'111111',
      emissive:'000000'
    },{
      name:'tip.005',
      color:'00cb03',
      emissive:'000000'
    },{
      name:'GreenPunk.003',
      color:'00cc03',
      emissive:'000000'
    },{
      name:'emissive',
      color:'000000',
      emissive:'ff6600'
    }
    ]

    this.nitroDark = [
    {
      name:'darkgreysub',
      color:'0a0a0a',
      emissive:'000000'
    },{
      name:'greensub',
      color:'ff0000',
      emissive:'ff0000'
    },{
      name:'light grey sub',
      color:'060606',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'000000',
      emissive:'ff0000'
    },{
      name:'GreenPunk',
      color:'333333',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'333333',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'111111',
      emissive:'000000'
    },{
      name:'tip.005',
      color:'ff0000',
      emissive:'000000'
    },{
      name:'GreenPunk.003',
      color:'333333',
      emissive:'000000'
    },{
      name:'emissive',
      color:'000000',
      emissive:'ff0000'
    }];

    this.nitroKawaii = [
    {
      name:'darkgreysub',
      color:'504480',
      emissive:'000000'
    },{
      name:'greensub',
      color:'ff1c7e',
      emissive:'ff1c7e'
    },{
      name:'light grey sub',
      color:'504480',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'ff1c7e',
      emissive:'ff1c7e'
    },{
      name:'GreenPunk',
      color:'d12c6e',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'504480',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'07524d',
      emissive:'000000'
    },{
      name:'tip.005',
      color:'d12c6e',
      emissive:'000000'
    },{
      name:'GreenPunk.003',
      color:'d12c6e',
      emissive:'000000'
    },{
      name:'emissive',
      color:'434343',
      emissive:'ff1c7e'
    }
    ]

    this.nitroRGB = [
    {
      name:'darkgreysub',
      color:'00f',
      emissive:'00f'
    },{
      name:'greensub',
      color:'0f0',
      emissive:'0f0'
    },{
      name:'light grey sub',
      color:'00f',
      emissive:'00f'
    },{
      name:'Eyes',
      color:'f00',
      emissive:'f00'
    },{
      name:'GreenPunk',
      color:'0f0',
      emissive:'0f0'
    },{
      name:'Grey.006',
      color:'00f',
      emissive:'00f'
    },{
      name:'DarkGrey',
      color:'f00',
      emissive:'f00'
    },{
      name:'tip.005',
      color:'f00',
      emissive:'f00'
    },{
      name:'GreenPunk.003',
      color:'0f0',
      emissive:'0f0'
    },{
      name:'emissive',
      color:'000',
      emissive:'f00'
    }]


    this.starfishDefault = [
      {
        name:'RedShiny',
        color:'c9cc1b',
        emissive:'000000'
      },
      {
        name:'light-sniper',
        color:'494949',
        emissive:'000000'
      },
      {
        name:'dark-sniper',
        color:'151515',
        emissive:'000000'
      },
      {
        name:'SpkeyBoySniperColor',
        color:'035aff',
        emissive:'000000'
      },
      {
        name:'blast.002',
        color:'cc2c00',
        emissive:'000000'
      },
      {
        name:'WhiteEmissive',
        color:'010101',
        emissive:'ffd7e5'
      },
      {
        name:'HighlightShiny',
        color:'ff3701',
        emissive:'000000'
      },
      {
        name:'GreyShiny',
        color:'616161',
        emissive:'000000'
      },
      {
        name:'BlueShiny',
        color:'035aff',
        emissive:'000000'
      },{
        name:'DarkGreyShiny',
        color:'111111',
        emissive:'000000'
      },{
        name:'emissive',
        color:'151515',
        emissive:'035aff'
      }
    ]

    this.starfishDark = [
      {
        name:'RedShiny',
        color:'333333',
        emissive:'000000'
      },
      {
        name:'light-sniper',
        color:'333333',
        emissive:'000000'
      },
      {
        name:'dark-sniper',
        color:'151515',
        emissive:'000000'
      },
      {
        name:'SpkeyBoySniperColor',
        color:'2f00ff',
        emissive:'2f00ff'
      },
      {
        name:'BlueShiny',
        color:'2f00ff',
        emissive:'2f00ff'
      },
      {
        name:'WhiteEmissive',
        color:'dd00ff',
        emissive:'dd00ff'
      },
      {
        name:'HighlightShiny',
        color:'030303',
        emissive:'000000'
      },
      {
        name:'GreyShiny',
        color:'333333',
        emissive:'000000'
      },
      { 
        name:'DarkGreyShiny',
        color:'030303',
        emissive:'000000'
      },{
        name:'emissive',
        color:'000000',
        emissive:'2f00ff'
      }
    ]

    this.starfishKawaii = [
      {
        name:'RedShiny',
        color:'40de94',
        emissive:'000000'
      },
      {
        name:'light-sniper',
        color:'333333',
        emissive:'000000'
      },
      {
        name:'dark-sniper',
        color:'151515',
        emissive:'000000'
      },
      {
        name:'SpkeyBoySniperColor',
        color:'40de94',
        emissive:'000000'
      },
      {
        name:'BlueShiny',
        color:'704beb',
        emissive:'000000'
      },
      {
        name:'WhiteEmissive',
        color:'55d8fa',
        emissive:'55d8fa'
      },
      {
        name:'HighlightShiny',
        color:'e8d933',
        emissive:'000000'
      },
      {
        name:'GreyShiny',
        color:'4a4a4d',
        emissive:'000000'
      },
      {
        name:'DarkGreyShiny',
        color:'704beb',
        emissive:'000000'
      },{
        name:'emissive',
        color:'464646',
        emissive:'2f00ff'
      }
    ]

    this.starfishRGB = [
      {
        name:'RedShiny',
        color:'f00',
        emissive:'f00'
      },
      {
        name:'light-sniper',
        color:'0f0',
        emissive:'0f0'
      },
      {
        name:'dark-sniper',
        color:'00f',
        emissive:'00f'
      },
      {
        name:'SpkeyBoySniperColor',
        color:'f00',
        emissive:'f00'
      },
      {
        name:'BlueShiny',
        color:'00f',
        emissive:'00f'
      },
      {
        name:'WhiteEmissive',
        color:'0f0',
        emissive:'0f0'
      },
      {
        name:'HighlightShiny',
        color:'0f0',
        emissive:'0f0'
      },
      {
        name:'GreyShiny',
        color:'f00',
        emissive:'f00'
      },
      {
        name:'DarkGreyShiny',
        color:'00f',
        emissive:'00f'
      },{
        name:'emissive',
        color:'000',
        emissive:'f00'
      }
    ]

    this.thrustDefault = [
      {
      name:'metal',
      color:'777777',
      emissive:'000303'
      },
      {
      name:'emissive.003',
      color:'00ccc3',
      emissive:'000000'
      },
      {
      name:'redemissive',
      color:'040404',
      emissive:'ff0003'
      },
      {
      name:'blast.003',
      color:'cc2c00',
      emissive:'000000'
      },
      {
        name:'redmetal',
        color:'814314',
        emissive:'000000'
      },{
        name:'emissive',
        color:'000',
        emissive:'f00'
      }
    ]

    this.thrustDark = [
      {
      name:'metal',
      color:'333333',
      emissive:'000000'
      },
      {
      name:'emissive.003',
      color:'000000',
      emissive:'6007fa'
      },
      {
        name:'redemissive',
        color:'000000',
        emissive:'6007fa'
      },
      {
        name:'redmetal',
        color:'1c1c1c',
        emissive:'000000'
      },{
        name:'emissive',
        color:'000',
        emissive:'6007fa'
      }
    ]

    this.thrustKawaii = [
      {
        name:'metal',
        color:'2462ff',
        emissive:'1a2278'
      },{
        name:'emissive.003',
        color:'000000',
        emissive:'e6d540'
      },{
        name:'redemissive',
        color:'000000',
        emissive:'e6d540'
      },{
        name:'redmetal',
        color:'e6880e',
        emissive:'855921'
      },{
        name:'emissive',
        color:'252525',
        emissive:'855921'
      }
    ]

    this.thrustRGB = [
      {
        name:'metal',
        color:'00f',
        emissive:'00f'
      },{
        name:'emissive.003',
        color:'0f0',
        emissive:'0f0'
      },{
        name:'redemissive',
        color:'f00',
        emissive:'f00'
      },{
        name:'redmetal',
        color:'0f0',
        emissive:'0f0'
      },{
        name:'emissive',
        color:'000',
        emissive:'f00'
      }
    ]

    this.bugDefault = [
      {
        name:'dark-sixgunn',
        color:'292929',
        emissive:'000000'
      },{
        name:'BugColor3',
        color:'0569ec',
        emissive:'000000'
      },{
        name:'YellowBug',
        color:'cc6600',
        emissive:'000000'
      },{
        name:'LightSixGun',
        color:'0b0b0b',
        emissive:'000000'
      },{
        name:'BlackBug',
        color:'010101',
        emissive:'000000'
      },{
        name:'WhiteBug',
        color:'cccccc',
        emissive:'e4e4e4'
      },{
        name:'emissive',
        color:'292929',
        emissive:'0bc5d6'
      }
    ]

    this.bugDark = [
      {
        name:'dark-sixgunn',
        color:'313131',
        emissive:'000000'
      },{
        name:'BugColor3',
        color:'000000',
        emissive:'ffb224'
      },{
        name:'YellowBug',
        color:'030303',
        emissive:'000000'
      },{
        name:'LightSixGun',
        color:'0b0b0b',
        emissive:'000000'
      },{
        name:'BlackBug',
        color:'313131',
        emissive:'000000'
      },{
        name:'WhiteBug',
        color:'000000',
        emissive:'ffb224'
      },{
        name:'emissive',
        color:'000000',
        emissive:'ffb224'
      }
    ]
    this.bugKawaii = [
      {
        name:'dark-sixgunn',
        color:'dbff59',
        emissive:'000000'
      },{
        name:'BugColor3',
        color:'7c57eb',
        emissive:'000000'
      },{
        name:'YellowBug',
        color:'38d953',
        emissive:'000000'
      },{
        name:'LightSixGun',
        color:'38d953',
        emissive:'000000'
      },{
        name:'BlackBug',
        color:'13005e',
        emissive:'000000'
      },{
        name:'WhiteBug',
        color:'000000',
        emissive:'dbff59'
      },{
        name:'emissive',
        color:'000000',
        emissive:'7c57eb'
      }
    ]

    this.bugRGB = [
      {
        name:'dark-sixgunn',
        color:'00f',
        emissive:'00f'
      },{
        name:'BugColor3',
        color:'f00',
        emissive:'f00'
      },{
        name:'YellowBug',
        color:'0f0',
        emissive:'0f0'
      },{
        name:'LightSixGun',
        color:'f00',
        emissive:'f00'
      },{
        name:'BlackBug',
        color:'00f',
        emissive:'00f'
      },{
        name:'WhiteBug',
        color:'f00',
        emissive:'f00'
      },{
        name:'emissive',
        color:'000',
        emissive:'0f0'
      }
    ]

    this.arr = [
      {
        name:"assault",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.shootManDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.shootManDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.shootManKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.shootManRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe", 
            icon:"wireframe", 
            array:this.shootManDefault
          }
        ]
      },
      {
        name:"sticky",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.stickyDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.stickyDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.stickyKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.stickyRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe", 
            icon:"wireframe", 
            array:this.stickyDefault
          }
        ]
      },{
        name:"submachine",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.nitroDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.nitroDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.nitroKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.nitroRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe", 
            icon:"wireframe", 
            array:this.nitroDefault
          }
        ]
      },{
        name:"sniper",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.starfishDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.starfishDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.starfishKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.starfishRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe", 
            icon:"wireframe", 
            array:this.starfishDefault
          }
        ]
      },{
        name:"launcher",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.thrustDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.thrustDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.thrustKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.thrustRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe", 
            icon:"wireframe", 
            array:this.thrustDefault
          }
        ]
      },{
        name:"sixgun",
        swatches:[
          {
            name:"default",
            icon:"default",
            array:this.bugDefault
          },{
            name:"dark",
            icon:"dark", 
            array:this.bugDark
          },{
            name:"kawaii", 
            icon:"kawaii", 
            array:this.bugKawaii
          },{
            name:"rgb", 
            icon:"rgb", 
            array:this.bugRGB
          },{
            name:"normal", 
            icon:"normal", 
            array:null
          },{
            name:"wireframe",
            icon:"wireframe",
            array:this.bugDefault
          }
        ]
      },
    ];

    
  }

  getSwatchEmissive(array){
    for(let i = 0;i<array.length; i++){
      if(array[i].name=="emissive")
        return array[i];
    }
  }

  checkIfMaterialMatchesSwatch(mat, swatches){
    for(let i = 0; i<swatches.length; i++){
      if(mat.name == swatches[i].name){
        return {name:swatches[i].name, material:mat, color:swatches[i].color, emissive:swatches[i].emissive};
      }  
    }
    return null;
  }

  getSwatchByName(character, name){
    const swatch = this.getSwatchesArrayFromName(character);
    return this.getSwatch(swatch, name);
  }

  getSwatchesArrayFromName(name){
    for(let i = 0; i<this.arr.length; i++){
      if(name==this.arr[i].name)
        return this.arr[i].swatches;
    }
  }

  getSwatch(array, name){
    for(let i = 0; i<array.length; i++){
      if(array[i].name == name){
        return array[i];
      }
    }
  }

  getSwatch(array, name){
    for(let i = 0; i<array.length; i++){
      if(array[i].name == name){
        return array[i];
      }
    }
  }

}

export { Swatches };