const lunisolar = require("lunisolar");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 声明全局干支变量
let nianzhu, yuezhu, rizhu1, shizhu, rizhu; // 年月日时柱和日主（取原本的对象在这个上面取）
let nian_gan, nian_zhi, yue_gan, yue_zhi, ri_gan, ri_zhi, shi_gan, shi_zhi; // 我的会变的天干地支对象（带分数）
let geju, xi, ji;

let wuxing_score = {
  木: {
    score: 0,
  },
  火: {
    score: 0,
  },
  土: {
    score: 0,
  },
  金: {
    score: 0,
  },
  水: {
    score: 0,
  },
};

let wuxinglist = {
  木: {
    counteracting: "金",
    overcoming: "土",
    generating: "火",
    weakening: "水",
  },
  火: {
    counteracting: "水",
    overcoming: "金",
    generating: "土",
    weakening: "木",
  },
  土: {
    counteracting: "木",
    overcoming: "水",
    generating: "金",
    weakening: "火",
  },
  金: {
    counteracting: "火",
    overcoming: "木",
    generating: "水",
    weakening: "土",
  },
  水: {
    counteracting: "土",
    overcoming: "火",
    generating: "木",
    weakening: "金",
  },
};
let tianganlist = {
  甲: {
    e5: "木",
    score: 40,
    yinyang: "阳",
    wuhe: "己",
    wuhehou_e5: "土",
  },
  乙: {
    e5: "木",
    score: 40,
    yinyang: "阴",
    wuhe: "庚",
    wuhehou_e5: "金",
  },
  丙: {
    e5: "火",
    score: 40,
    yinyang: "阳",
    wuhe: "辛",
    wuhehou_e5: "水",
  },
  丁: {
    e5: "火",
    score: 40,
    yinyang: "阴",
    wuhe: "壬",
    wuhehou_e5: "木",
  },
  戊: {
    e5: "土",
    score: 40,
    yinyang: "阳",
    wuhe: "癸",
    wuhehou_e5: "火 ",
  },
  己: {
    e5: "土",
    score: 40,
    yinyang: "阴",
    wuhe: "甲",
    wuhehou_e5: "土",
  },
  庚: {
    e5: "金",
    score: 40,
    yinyang: "阳",
    wuhe: "乙",
    wuhehou_e5: "金",
  },
  辛: {
    e5: "金",
    score: 40,
    yinyang: "阴",
    hehua: "丙",
    wuhehou_e5: "水",
  },
  壬: {
    e5: "水",
    score: 40,
    yinyang: "阳",
    wuhe: "丁",
    wuhehou_e5: "木",
  },
  癸: {
    e5: "水",
    score: 40,
    yinyang: "阴",
    wuhe: "戊",
    wuhehou_e5: "火 ",
  },
};

let dizhilist = {
  子: {
    e5: "水",
    canggan: {
      癸: {
        e5: "水",
        score: 100,
        yinyang: "阴",
      },
    },
    chong: "午",
    hai: "未",
    woxing: "卯",
    xingwo: "卯",
    sanhuifang: {
      0: "亥",
      1: "丑",
      sanhufang_e5: "水",
    },
  },
  丑: {
    e5: "土",
    canggan: {
      己: {
        e5: "土",
        score: 60,
        yinyang: "阴",
      },
      癸: {
        e5: "水",
        score: 30,
        yinyang: "阴",
      },
      辛: {
        e5: "金",
        score: 10,
        yinyang: "阴",
      },
    },
    chong: "未",
    hai: "午",
    woxing: "戌",
    xingwo: "未",
    sanhuifang: {
      0: "子",
      1: "亥",
      sanhufang_e5: "水",
    },
  },
  寅: {
    e5: "木",
    canggan: {
      甲: {
        e5: "木",
        score: 70,
        yinyang: "阳",
      },
      丙: {
        e5: "火",
        score: 20,
        yinyang: "阳",
      },
      戊: {
        e5: "土",
        score: 10,
        yinyang: "阳",
      },
    },
    chong: "申",
    hai: "巳",
    woxing: "巳",
    xingwo: "申",
    sanhuifang: {
      0: "卯",
      1: "辰",
      sanhufang_e5: "木",
    },
  },
  卯: {
    e5: "木",
    canggan: {
      乙: {
        e5: "木",
        score: 100,
        yinyang: "阴",
      },
    },
    chong: "酉",
    hai: "辰",
    woxing: "子",
    xingwo: "子",
    sanhuifang: {
      0: "寅",
      1: "辰",
      sanhufang_e5: "木",
    },
  },
  辰: {
    e5: "土",
    canggan: {
      戊: {
        e5: "土",
        score: 60,
        yinyang: "阳",
      },
      乙: {
        e5: "木",
        score: 30,
        yinyang: "阴",
      },
      癸: {
        e5: "水",
        score: 10,
        yinyang: "阴",
      },
    },
    chong: "戌",
    hai: "卯",
    woxing: "辰",
    xingwo: "辰",
    sanhuifang: {
      0: "寅",
      1: "卯",
      sanhufang_e5: "木",
    },
  },
  巳: {
    e5: "火",
    canggan: {
      丙: {
        e5: "火",
        score: 70,
        yinyang: "阳",
      },
      庚: {
        e5: "金",
        score: 20,
        yinyang: "阳",
      },
      戊: {
        e5: "土",
        score: 10,
        yinyang: "阳",
      },
    },
    chong: "亥",
    hai: "寅",
    woxing: "申",
    xingwo: "寅",
    sanhuifang: {
      0: "午",
      1: "未",
      sanhufang_e5: "火",
    },
  },
  午: {
    e5: "火",
    canggan: {
      丁: {
        e5: "火",
        score: 70,
        yinyang: "阴",
      },
      己: {
        e5: "土",
        score: 30,
        yinyang: "阴",
      },
    },
    chong: "子",
    hai: "丑",
    woxing: "午",
    xingwo: "午",
    sanhuifang: {
      0: "巳",
      1: "未",
      sanhufang_e5: "火",
    },
  },
  未: {
    e5: "土",
    canggan: {
      己: {
        e5: "土",
        score: 60,
        yinyang: "阴",
      },
      丁: {
        e5: "火",
        score: 30,
        yinyang: "阴",
      },
      乙: {
        e5: "木",
        score: 10,
        yinyang: "阴",
      },
    },
    chong: "丑",
    hai: "子",
    woxing: "丑",
    xingwo: "戌",
    sanhuifang: {
      0: "巳",
      1: "午",
      sanhufang_e5: "火",
    },
  },
  申: {
    e5: "金",
    canggan: {
      庚: {
        e5: "金",
        score: 70,
        yinyang: "阳",
      },
      壬: {
        e5: "水",
        score: 20,
        yinyang: "阳",
      },
      戊: {
        e5: "土",
        score: 10,
        yinyang: "阳",
      },
    },
    chong: "寅",
    hai: "亥",
    woxing: "寅",
    xingwo: "巳",
    sanhuifang: {
      0: "酉",
      1: "戌",
      sanhufang_e5: "金",
    },
  },
  酉: {
    e5: "金",
    canggan: {
      辛: {
        e5: "金",
        score: 100,
        yinyang: "阴",
      },
    },
    chong: "卯",
    hai: "戌",
    woxing: "酉",
    xingwo: "酉",
    sanhuifang: {
      0: "申",
      1: "戌",
      sanhufang_e5: "金",
    },
  },
  戌: {
    e5: "土",
    canggan: {
      戊: {
        e5: "土",
        score: 60,
        yinyang: "阳",
      },
      辛: {
        e5: "金",
        score: 30,
        yinyang: "阴",
      },
      丁: {
        e5: "火",
        score: 10,
        yinyang: "阴",
      },
    },
    chong: "辰",
    hai: "酉",
    woxing: "未",
    xingwo: "丑",
    sanhuifang: {
      0: "申",
      1: "酉",
      sanhufang_e5: "金",
    },
  },
  亥: {
    e5: "水",
    canggan: {
      壬: {
        e5: "水",
        score: 70,
        yinyang: "阳",
      },
      甲: {
        e5: "木",
        score: 30,
        yinyang: "阳",
      },
    },
    chong: "巳",
    hai: "申",
    woxing: "亥",
    xingwo: "亥",
    sanhuifang: {
      0: "子",
      1: "丑",
      sanhufang_e5: "水",
    },
  },
};

function tiangan(tian_gan, hehua) {
  this.tian_gan = tian_gan.name;
  this.wuxing = tian_gan.e5.name;

  this.kewo = tian_gan.e5.counteracting().name;
  this.woke = tian_gan.e5.overcoming().name;
  this.wosheng = tian_gan.e5.generating().name;
  this.shengwo = tian_gan.e5.weakening().name;

  //之后可以再加合化
  this.score = tianganlist[tian_gan.name]?.score;
  this.hehua = hehua; //0代表未合化，1代表已合化
}

function dizhi(di_zhi, hehua) {
  this.di_zhi = di_zhi.name;
  this.wuxing = di_zhi.e5.name;

  this.kewo = di_zhi.e5.counteracting().name;
  this.woke = di_zhi.e5.overcoming().name;
  this.wosheng = di_zhi.e5.generating().name;
  this.shengwo = di_zhi.e5.weakening().name;

  this.canggan = di_zhi.hiddenStems; //返回的是天干对象stem的列表[]

  this.score = [];

  for (var i = 0; i < this.canggan.length; i++) {
    this.score[i] = [];
    this.score[i][0] =
      dizhilist[this.di_zhi]?.canggan[this.canggan[i].name]?.score;
    this.score[i][1] =
      dizhilist[this.di_zhi]?.canggan[this.canggan[i].name]?.e5;
    this.score[i][2] =
      dizhilist[this.di_zhi]?.canggan[this.canggan[i].name]?.yinyang;
  }

  this.sanhuifang = dizhilist[this.di_zhi]?.sanhuifang;

  this.hehua = hehua; //0代表未合化，1代表已合化
}

function jisuan(dateTimeStr, gender) {
  const shijian = lunisolar(dateTimeStr);
  console.log("八字：");
  console.log("性别：" + gender);

  // 赋值全局干支变量
  nianzhu = shijian.char8.year;
  yuezhu = shijian.char8.month;
  rizhu = shijian.char8.day; //日柱
  shizhu = shijian.char8.hour;

  console.log("年柱：" + nianzhu.name);
  console.log("月柱：" + yuezhu.name);
  console.log("日柱：" + rizhu.name);
  console.log("时柱：" + shizhu.name);

  rizhu1 = shijian.char8.me; //日主
  console.log("日主：" + rizhu1.name);
  console.log("月令：" + yuezhu.branch.name);
  //这个地方之后可以放生成初始格局

  console.log("年干");
  nian_gan = new tiangan(nianzhu.stem, 0);
  console.log(nian_gan.score, nian_gan.wuxing);

  console.log("年支");
  nian_zhi = new dizhi(nianzhu.branch, 0);
  for (var i = 0; i < nianzhu.branch.hiddenStems.length; i++) {
    console.log(nian_zhi.score[i][0], nian_zhi.score[i][1]);
  }

  console.log("月干");
  yue_gan = new tiangan(yuezhu.stem, 0);
  console.log(yue_gan.score, yue_gan.wuxing);
  console.log("月支");
  yue_zhi = new dizhi(yuezhu.branch, 0);
  for (var i = 0; i < yuezhu.branch.hiddenStems.length; i++) {
    yue_zhi.score[i][0] = yue_zhi.score[i][0] * 1.5;
    console.log(yue_zhi.score[i][0], yue_zhi.score[i][1]);
  }

  console.log("日干");
  ri_gan = new tiangan(rizhu.stem, 0);
  console.log(ri_gan.score, ri_gan.wuxing);
  console.log("日支");
  ri_zhi = new dizhi(rizhu.branch, 0);
  for (var i = 0; i < rizhu.branch.hiddenStems.length; i++) {
    console.log(ri_zhi.score[i][0], ri_zhi.score[i][1]);
  }

  console.log("时干");
  shi_gan = new tiangan(shizhu.stem, 0);
  console.log(shi_gan.score, shi_gan.wuxing);
  console.log("时支");
  shi_zhi = new dizhi(shizhu.branch, 0);
  for (var i = 0; i < shizhu.branch.hiddenStems.length; i++) {
    console.log(shi_zhi.score[i][0], shi_zhi.score[i][1]);
  }

  //合化判断

  tianganwuhe();

  if (dizhi_sanheju() == 1) {
    console.log("地支三合局成功");
  } else {
    console.log("地支三合局失败");
    if (dizhi_sanhuifang() == 1) {
      console.log("地支三会方成功");
    } else {
      console.log("地支三会方失败");
      if (dizhi_liuhe() == 1) {
        console.log("地支六合成功");
      } else {
        console.log("地支六合失败");
      }
    }
  }

  //计算五行分数
  e5scoresum();

  geju = geju1();

  /* 
if(ri_gan.hehua==0){
  console.log("日干未合化");
  if(){ 
    判断分数有没有达到专旺格
  } 
  else if(){
  判断分数有没有到从强格
  }  
  else{
  进入十神正格
  
  }
    
}else{
  console.log("日干已合化，进入化气格");

}
*/
  //最后判断
  /*   if(yue_zhi.score[0][1]==nian_gan.wuxing.name||yue_zhi.score[0][1]==yue_gan.wuxing.name||yue_zhi.score[0][1]==ri_gan.wuxing.name||yue_zhi.score[0][1]==shi_gan.wuxing.name){
    chushi_geju(yue_zhi,ri_gan);//实际上是月支和日主来判断十神正格

  } */
}

function tianganwuhe() {
  console.log("天干五合判断：");
  let hasValidHehua = false; //日干月干合化标记
  let hasValidHehua_2 = false; //日干时干合化标记
  let hasValidHehua_3 = false; //月干年干合化标记

  // 第一个判断：日干和月干合化
  if (
    !hasValidHehua &&
    tianganlist[ri_gan.tian_gan]?.wuhe == yue_gan.tian_gan
  ) {
    console.log("日干和月干可合化");

    let tiaojian_1 = true;
    let tiaojian_2 = true;
    let tiaojian_3 = true;
    // 检查后续条件

    // 条件1判断
    if (
      nian_gan.woke == ri_gan.wuxing ||
      nian_gan.woke == yue_gan.wuxing ||
      nian_gan.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("年干五行克制日干五行或月干五行或合化后五行");
      if (shi_gan.woke == nian_gan.wuxing) {
        // 如果条件1满足，标记为已满足有效合化条件一
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua = false;
        console.log("条件1不满足反克制,年干克制,条件1不成立");
      }
    }
    if (
      (tiaojian_1 == true && shi_gan.woke == yue_gan.wuxing) ||
      shi_gan.woke == ri_gan.wuxing ||
      shi_gan.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("时干五行克制日干五行或月干五行或合化后五行");
      if (nian_gan.woke == shi_gan.wuxing) {
        //上一个是年干判断五行克制，这一个是时干判断五行克制
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua = false;
        console.log("条件1不满足反克制,时干克制,条件1不成立");
      }
    }

    //条件2判断
    if (yue_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5) {
      tiaojian_2 = true;
      console.log("月令五行等于合化后五行，条件2满足，得令");
    } else {
      tiaojian_2 = false;
      hasValidHehua = false;
      console.log("月令五行不等于合化后五行，条件2不满足，不得令");
    }

    //条件3判断
    if (
      nian_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
      ri_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
      shi_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      if (
        nian_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
        ri_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
        shi_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
      ) {
        tiaojian_3 = false;
        hasValidHehua = false;
        console.log(
          "年支/日支/时支的五行中有等于合化后的五行，但是也有别的地支，克制该强根五行（合化后的五行），条件3不满足，无强根"
        );
      } else {
        tiaojian_3 = true;
        console.log(
          "年支/日支/时支的五行中任意一个等于合化后的五行，条件3满足，有强根"
        );
      }
    } else {
      tiaojian_3 = false;
      hasValidHehua = false;
      console.log(
        "年支/日支/时支的五行中没有一个等于合化后的五行，条件3不满足，无强根"
      );
    }

    // 条件4判断
    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("条件1、2、3都满足，日干月干合化成功");
      hasValidHehua = true;

      ri_gan.wuxing = wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5];
      ri_gan.kewo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].counteracting;
      ri_gan.woke =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].overcoming;
      ri_gan.wosheng =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].generating;
      ri_gan.shengwo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].weakening;

      ri_gan.hehua = 1;

      yue_gan.wuxing = wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5];
      yue_gan.kewo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].counteracting;
      yue_gan.woke =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].overcoming;
      yue_gan.wosheng =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].generating;
      yue_gan.shengwo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].weakening;

      yue_gan.hehua = 1;
    }

    // 如果后续条件不满足，不会标记hasValidHehua为true，会继续检查下一个判断
  }

  // 第二个判断：日干和时干合化
  if (
    !hasValidHehua &&
    tianganlist[ri_gan.tian_gan]?.wuhe == shi_gan.tian_gan
  ) {
    console.log("日干和时干可合化");
    let tiaojian_1 = true;
    let tiaojian_2 = true;
    let tiaojian_3 = true;

    if (
      nian_gan.woke == ri_gan.wuxing ||
      nian_gan.woke == shi_gan.wuxing ||
      nian_gan.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("年干五行克制日干五行或时干五行或合化后五行");
      if (yue_gan.woke == nian_gan.wuxing) {
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua_2 = false;
        console.log("条件1不满足反克制,年干克制,条件1不成立");
      }
    }
    if (
      (tiaojian_1 == true && yue_gan.woke == shi_gan.wuxing) ||
      yue_gan.woke == ri_gan.wuxing ||
      yue_gan.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("月干五行克制日干五行或时干五行或合化后五行");

      if (nian_gan.woke == yue_gan.wuxing) {
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua_2 = false;
        console.log("条件1不满足反克制,月干克制,条件1不成立");
      }
    }

    if (yue_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5) {
      tiaojian_2 = true;
      console.log("月令五行等于合化后五行");
    } else {
      tiaojian_2 = false;
      hasValidHehua_2 = false;
      console.log("月令五行不等于合化后五行，条件2不满足，不得令");
    }

    if (
      nian_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
      ri_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
      shi_zhi.wuxing == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
    ) {
      if (
        nian_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
        ri_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5 ||
        shi_zhi.woke == tianganlist[ri_gan.tian_gan]?.wuhehou_e5
      ) {
        tiaojian_3 = false;
        hasValidHehua = false;
        console.log(
          "年支/日支/时支的五行中有等于合化后的五行，但是也有别的地支，克制该强根五行（合化后的五行），条件3不满足，无强根"
        );
      } else {
        tiaojian_3 = true;
        console.log(
          "年支/日支/时支的五行中任意一个等于合化后的五行，条件3满足，有强根"
        );
      }
    } else {
      tiaojian_3 = false;
      hasValidHehua = false;
      console.log(
        "年支/日支/时支的五行中没有一个等于合化后的五行，条件3不满足，无强根"
      );
    }

    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("条件1、2、3都满足，日干时干合化成功");
      hasValidHehua_2 = true;

      ri_gan.wuxing = wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5];
      ri_gan.kewo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].counteracting;
      ri_gan.woke =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].overcoming;
      ri_gan.wosheng =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].generating;
      ri_gan.shengwo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].weakening;

      ri_gan.hehua = 1;

      shi_gan.wuxing = wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5];
      shi_gan.kewo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].counteracting;
      shi_gan.woke =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].overcoming;
      shi_gan.wosheng =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].generating;
      shi_gan.shengwo =
        wuxinglist[tianganlist[ri_gan.tian_gan]?.wuhehou_e5].weakening;

      shi_gan.hehua = 1;
    }
  }

  // 第三个判断：月干和年干合化
  if (
    !hasValidHehua &&
    tianganlist[yue_gan.tian_gan]?.wuhe == nian_gan.tian_gan
  ) {
    console.log("月干和年干可合化");

    let tiaojian_1 = true;
    let tiaojian_2 = true;
    let tiaojian_3 = true;

    if (
      ri_gan.woke == nian_gan.wuxing ||
      ri_gan.woke == yue_gan.wuxing ||
      ri_gan.woke == tianganlist[yue_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("日干五行克制年干五行或月干五行或合化后五行");
      if (shi_gan.woke == ri_gan.wuxing) {
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua_3 = false;
        console.log("条件1不满足反克制,年干克制,条件1不成立");
      }
    }
    if (
      (tiaojian_1 == true && shi_gan.woke == nian_gan.wuxing) ||
      shi_gan.woke == yue_gan.wuxing ||
      shi_gan.woke == tianganlist[yue_gan.tian_gan]?.wuhehou_e5
    ) {
      console.log("时干五行克制年干五行或月干五行或合化后五行");
      if (ri_gan.woke == shi_gan.wuxing) {
        tiaojian_1 = true;
        console.log("条件1满足反克制，条件1成立");
      } else {
        tiaojian_1 = false;
        hasValidHehua_3 = false;
        console.log("条件1不满足反克制,时干克制,条件1不成立");
      }
    }

    if (yue_zhi.wuxing == tianganlist[yue_gan.tian_gan]?.wuhehou_e5) {
      tiaojian_2 = true;
      console.log("月支五行等于合化后五行");
    } else {
      tiaojian_2 = false;
      hasValidHehua_3 = false;
      console.log("月支五行不等于合化后五行，条件2不满足，不得令");
    }

    if (
      nian_zhi.wuxing == tianganlist[yue_gan.tian_gan]?.wuhehou_e5 ||
      ri_zhi.wuxing == tianganlist[yue_gan.tian_gan]?.wuhehou_e5 ||
      shi_zhi.wuxing == tianganlist[yue_gan.tian_gan]?.wuhehou_e5
    ) {
      if (
        nian_zhi.woke == tianganlist[yue_gan.tian_gan]?.wuhehou_e5 ||
        ri_zhi.woke == tianganlist[yue_gan.tian_gan]?.wuhehou_e5 ||
        shi_zhi.woke == tianganlist[yue_gan.tian_gan]?.wuhehou_e5
      ) {
        tiaojian_3 = false;
        hasValidHehua = false;
        console.log(
          "年支/日支/时支的五行中有等于合化后的五行，但是也有别的地支，克制该强根五行（合化后的五行），条件3不满足，无强根"
        );
      } else {
        tiaojian_3 = true;
        console.log(
          "年支/日支/时支的五行中任意一个等于合化后的五行，条件3满足，有强根"
        );
      }
    } else {
      tiaojian_3 = false;
      hasValidHehua = false;
      console.log(
        "年支/日支/时支的五行中没有一个等于合化后的五行，条件3不满足，无强根"
      );
    }

    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("条件1、2、3都满足，月干年干合化成功");
      hasValidHehua_3 = true;

      yue_gan.wuxing = wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5];
      yue_gan.kewo =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].counteracting;
      yue_gan.woke =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].overcoming;
      yue_gan.wosheng =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].generating;
      yue_gan.shengwo =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].weakening;

      yue_gan.hehua = 1;

      nian_gan.wuxing = wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5];
      nian_gan.kewo =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].counteracting;
      nian_gan.woke =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].overcoming;
      nian_gan.wosheng =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].generating;
      nian_gan.shengwo =
        wuxinglist[tianganlist[yue_gan.tian_gan]?.wuhehou_e5].weakening;

      nian_gan.hehua = 1;
    }
  }

  // 如果没有找到任何有效的合化
  if (!hasValidHehua && !hasValidHehua_2 && !hasValidHehua_3) {
    console.log("没有有效的天干合化");
  }
  console.log("天干五合判断结束");
}

function dizhi_sanheju() {
  var count = 2;
  let yuezhi_sanhe = false; //以月支为中心的地支三合标记
  let rizhi_sanhe = false; //以日支为中心的地支三合标记

  let tiaojian_1 = false;
  let tiaojian_2 = false;
  let tiaojian_3 = false;

  let sanhe = false; //三合成功标记

  console.log("地支三合局判断：");
  for (var i = 0; i < 2; i++) {
    if (yuezhu.branch.triad[i].name == nian_zhi.di_zhi) {
      count = i;
    }
  }
  if (count == 2) {
    for (var i = 0; i < 2; i++) {
      if (rizhu.branch.triad[i].name == yue_zhi.di_zhi) {
        count = i;
      }
    }
    if (count == 2) {
      console.log("地支三合组合失败");
      return 0;
    } else if (count == 1) {
      if (rizhu.branch.triad[0].name == shi_zhi.di_zhi) {
        console.log("以日支为中心的地支三合组合成功");
        rizhi_sanhe = true;
      }
    } else if (count == 0) {
      if (rizhu.branch.triad[1].name == shi_zhi.di_zhi) {
        console.log("以日支为中心的地支三合组合成功");
        rizhi_sanhe = true;
      }
    }
  } else if (count == 0) {
    if (yuezhu.branch.triad[1].name == ri_zhi.di_zhi) {
      console.log("以月支为中心的地支三合组合成功");
      yuezhi_sanhe = true;
    }
  } else if (count == 1) {
    if (yuezhu.branch.triad[0].name == ri_zhi.di_zhi) {
      console.log("以月支为中心的地支三合组合成功");
      yuezhi_sanhe = true;
    }
  }

  //上面是组合判断，下面是规则判断
  if (yuezhi_sanhe == true) {
    //条件1
    if (
      shi_zhi.wuxing == yue_zhi.kewo ||
      shi_zhi.wuxing == nian_zhi.kewo ||
      shi_zhi.wuxing == ri_zhi.kewo
    ) {
      console.log("时支五行克制月支五行或年支五行或日支五行");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.woxing == ri_zhi.di_zhi
    ) {
      console.log("时支刑年月日支");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == ri_zhi.di_zhi
    ) {
      console.log("时支冲年月日支");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == ri_zhi.di_zhi
    ) {
      console.log("时支害年月日支");
      tiaojian_1 = false;
    } else {
      console.log("时支不克制月支不刑不冲不害年月日支");
      tiaojian_1 = true;
    }

    //条件2
    if (yue_zhi.wuxing == yuezhu.branch.triadE5.name) {
      console.log("月支五行与合化后五行相同");
      tiaojian_2 = true;
    } else {
      console.log("时支五行与月支、年支、日支五行不同");
      tiaojian_2 = false;
    }

    //条件3
    let countcanggan = 3; //藏干最多三个设置为3避免有误
    if (
      yuezhu.branch.triadE5.name == nian_gan.wuxing ||
      yuezhu.branch.triadE5.name == yue_gan.wuxing ||
      yuezhu.branch.triadE5.name == ri_gan.wuxing ||
      yuezhu.branch.triadE5.name == shi_gan.wuxing
    ) {
      console.log("合化后五行与天干五行有相同");
      for (var i = 0; i < shi_zhi.canggan.length; i++) {
        if (yuezhu.branch.triadE5.name == shi_zhi.score[i][1]) {
          countcanggan = i;
        }
      }
      if (countcanggan == 3) {
        console.log("合化后五行与剩余地支藏干五行无相同");
        tiaojian_3 = false;
      } else {
        let cangganmeiyoukezhi = true;
        console.log("合化后五行与剩余地支藏干五行有相同");
        for (var i = 0; i < shi_zhi.canggan.length; i++) {
          if (i == countcanggan) {
            continue;
          }
          if (
            yuezhu.branch.triadE5.counteracting().name == shi_zhi.score[i][1]
          ) {
            console.log("藏干的五行中有克制合化后五行的");
            tiaojian_3 = false;
            cangganmeiyoukezhi = false;
            break;
          }
        }
        if (
          nian_gan.woke == yuezhu.branch.triadE5.name ||
          yue_gan.woke == yuezhu.branch.triadE5.name ||
          ri_gan.woke == yuezhu.branch.triadE5.name ||
          shi_gan.woke == yuezhu.branch.triadE5.name
        ) {
          console.log("天干的五行中有克制合化后五行的");
          tiaojian_3 = false;
        } else if (cangganmeiyoukezhi == true) {
          console.log("藏干和天干的五行中没有克制合化后五行的");
          tiaojian_3 = true;
        }
      }
    }
    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("三个条件都成立，合化成功");
      sanhe = true;

      nian_zhi.wuxing = yuezhu.branch.triadE5.name;
      nian_zhi.kewo = wuxinglist[yuezhu.branch.triadE5.name]?.counteracting;
      nian_zhi.woke = wuxinglist[yuezhu.branch.triadE5.name]?.overcoming;
      nian_zhi.wosheng = wuxinglist[yuezhu.branch.triadE5.name]?.generating;
      nian_zhi.shengwo = wuxinglist[yuezhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < nian_zhi.canggan.length; i++) {
        nian_zhi.score[i][1] = yuezhu.branch.triadE5.name;
        //年支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      nian_zhi.hehua = 1;
      yue_zhi.wuxing = yuezhu.branch.triadE5.name;
      yue_zhi.kewo = wuxinglist[yuezhu.branch.triadE5.name]?.counteracting;
      yue_zhi.woke = wuxinglist[yuezhu.branch.triadE5.name]?.overcoming;
      yue_zhi.wosheng = wuxinglist[yuezhu.branch.triadE5.name]?.generating;
      yue_zhi.shengwo = wuxinglist[yuezhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < yue_zhi.canggan.length; i++) {
        yue_zhi.score[i][1] = yuezhu.branch.triadE5.name;
        //月支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      yue_zhi.hehua = 1;
      shi_zhi.wuxing = yuezhu.branch.triadE5.name;
      shi_zhi.kewo = wuxinglist[yuezhu.branch.triadE5.name]?.counteracting;
      shi_zhi.woke = wuxinglist[yuezhu.branch.triadE5.name]?.overcoming;
      shi_zhi.wosheng = wuxinglist[yuezhu.branch.triadE5.name]?.generating;
      shi_zhi.shengwo = wuxinglist[yuezhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < shi_zhi.canggan.length; i++) {
        shi_zhi.score[i][1] = yuezhu.branch.triadE5.name;
        //时支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      shi_zhi.hehua = 1;

      return 1;
    }
  }
  if (sanhe == false && rizhi_sanhe == true) {
    //条件1
    if (
      nian_zhi.wuxing == yue_zhi.kewo ||
      nian_zhi.wuxing == ri_zhi.kewo ||
      nian_zhi.wuxing == shi_zhi.kewo
    ) {
      console.log("年支五行克制月支、日支、时支五行");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.woxing == shi_zhi.di_zhi
    ) {
      console.log("年支刑日月时支");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == shi_zhi.di_zhi
    ) {
      console.log("年支冲日月时支");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == shi_zhi.di_zhi
    ) {
      console.log("年支害日月时支");
      tiaojian_1 = false;
    } else {
      console.log("年支不克制月支不刑不冲不害日月时支");
      tiaojian_1 = true;
    }
    //条件2
    if (yue_zhi.wuxing == rizhu.branch.triadE5.name) {
      console.log("月支五行与合化后五行相同");
      tiaojian_2 = true;
    } else {
      console.log("月支五行与合化后五行不同");
      tiaojian_2 = false;
    }

    //条件3
    let countcanggan = 3;
    if (
      rizhu.branch.triadE5.name == nian_gan.wuxing ||
      rizhu.branch.triadE5.name == yue_gan.wuxing ||
      rizhu.branch.triadE5.name == ri_gan.wuxing ||
      rizhu.branch.triadE5.name == shi_gan.wuxing
    ) {
      console.log("合化后五行与天干五行有相同");
      for (var i = 0; i < nian_zhi.canggan.length; i++) {
        if (rizhu.branch.triadE5.name == nian_zhi.score[i][1]) {
          countcanggan = i;
        }
      }
      if (countcanggan == 3) {
        console.log("合化后五行与剩余地支藏干五行无相同");
        tiaojian_3 = false;
      } else {
        let cangganmeiyoukezhi = true;
        console.log("合化后五行与剩余地支藏干五行有相同");
        for (var i = 0; i < nian_zhi.canggan.length; i++) {
          if (i == countcanggan) {
            continue;
          }
          if (
            rizhu.branch.triadE5.counteracting().name == nian_zhi.score[i][1]
          ) {
            console.log("藏干的五行中有克制合化后五行的");
            tiaojian_3 = false;
            cangganmeiyoukezhi = false;
            break;
          }
        }
        if (
          nian_gan.woke == rizhu.branch.triadE5.name ||
          yue_gan.woke == rizhu.branch.triadE5.name ||
          ri_gan.woke == rizhu.branch.triadE5.name ||
          shi_gan.woke == rizhu.branch.triadE5.name
        ) {
          console.log("天干的五行中有克制合化后五行的");
          tiaojian_3 = false;
        } else if (cangganmeiyoukezhi == true) {
          console.log("藏干和天干的五行中没有克制合化后五行的");
          tiaojian_3 = true;
        }
      }
    }
    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("三个条件都成立，合化成功");
      sanhe = true;

      yue_zhi.wuxing = rizhu.branch.triadE5.name;
      yue_zhi.kewo = wuxinglist[rizhu.branch.triadE5.name]?.counteracting;
      yue_zhi.woke = wuxinglist[rizhu.branch.triadE5.name]?.overcoming;
      yue_zhi.wosheng = wuxinglist[rizhu.branch.triadE5.name]?.generating;
      yue_zhi.shengwo = wuxinglist[rizhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < yue_zhi.canggan.length; i++) {
        yue_zhi.score[i][1] = rizhu.branch.triadE5.name;
        //月支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      yue_zhi.hehua = 1;
      ri_zhi.wuxing = rizhu.branch.triadE5.name;
      ri_zhi.kewo = wuxinglist[rizhu.branch.triadE5.name]?.counteracting;
      ri_zhi.woke = wuxinglist[rizhu.branch.triadE5.name]?.overcoming;
      ri_zhi.wosheng = wuxinglist[rizhu.branch.triadE5.name]?.generating;
      ri_zhi.shengwo = wuxinglist[rizhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < ri_zhi.canggan.length; i++) {
        ri_zhi.score[i][1] = rizhu.branch.triadE5.name;
        //日支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      ri_zhi.hehua = 1;
      shi_zhi.wuxing = rizhu.branch.triadE5.name;
      shi_zhi.kewo = wuxinglist[rizhu.branch.triadE5.name]?.counteracting;
      shi_zhi.woke = wuxinglist[rizhu.branch.triadE5.name]?.overcoming;
      shi_zhi.wosheng = wuxinglist[rizhu.branch.triadE5.name]?.generating;
      shi_zhi.shengwo = wuxinglist[rizhu.branch.triadE5.name]?.weakening;
      for (var i = 0; i < shi_zhi.canggan.length; i++) {
        shi_zhi.score[i][1] = rizhu.branch.triadE5.name;
        //时支藏干的阴阳合化后没有意义了，算分时也不考虑，所以在此处不写score[i][2]
      }
      shi_zhi.hehua = 1;
      return 1;
    }
  }
  return 0;
}

function dizhi_sanhuifang() {
  let yuezhi_sanhui = false;
  let rizhi_sanhui = false;
  var count = 2;

  let tiaojian_1 = false;

  console.log("地支三会方判断：");

  for (var i = 0; i < 2; i++) {
    if (yue_zhi.sanhuifang[i] == nian_zhi.di_zhi) {
      count = i;
    }
  }
  if (count == 0) {
    if (yue_zhi.sanhuifang[1] == ri_zhi.di_zhi) {
      yuezhi_sanhui = true;
      console.log("年月日支三会方组合成功");
    }
  } else if (count == 1) {
    if (yue_zhi.sanhuifang[0] == ri_zhi.di_zhi) {
      yuezhi_sanhui = true;
      console.log("年月日支三会方组合成功");
    }
  } else if (count == 2) {
    for (var i = 0; i < 2; i++) {
      if (ri_zhi.sanhuifang[i] == yue_zhi.di_zhi) {
        count = i;
      }
    }
    if (count == 0) {
      if (ri_zhi.sanhuifang[1] == shi_zhi.di_zhi) {
        rizhi_sanhui = true;
        console.log("月日时支三会方组合成功");
      }
    } else if (count == 1) {
      if (ri_zhi.sanhuifang[0] == shi_zhi.di_zhi) {
        rizhi_sanhui = true;
        console.log("月日时支三会方组合成功");
      }
    }
  }

  if (yuezhi_sanhui == true) {
    if (
      shi_zhi.wuxing == yue_zhi.kewo ||
      shi_zhi.wuxing == nian_zhi.kewo ||
      shi_zhi.wuxing == ri_zhi.kewo
    ) {
      console.log("时支五行克制月支五行或年支五行或日支五行");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.woxing == ri_zhi.di_zhi
    ) {
      console.log("时支刑年月日支");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == ri_zhi.di_zhi
    ) {
      console.log("时支冲年月日支");
      tiaojian_1 = false;
    } else if (
      dizhilist[shi_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == nian_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == ri_zhi.di_zhi
    ) {
      console.log("时支害年月日支");
      tiaojian_1 = false;
    } else {
      console.log("时支不克制月支不刑不冲不害年月日支");
      tiaojian_1 = true;
    }

    if (tiaojian_1 == true) {
      console.log("地支三会方成功");

      nian_zhi.wuxing = yue_zhi.sanhuifang.sanhufang_e5;
      nian_zhi.kewo =
        wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      nian_zhi.woke = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      nian_zhi.wosheng =
        wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.generating;
      nian_zhi.shengwo = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < nian_zhi.canggan.length; i++) {
        nian_zhi.score[i][1] = yue_zhi.sanhuifang.sanhufang_e5;
      }
      nian_zhi.hehua = 1;

      yue_zhi.wuxing = yue_zhi.sanhuifang.sanhufang_e5;
      yue_zhi.kewo = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      yue_zhi.woke = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      yue_zhi.wosheng = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.generating;
      yue_zhi.shengwo = wuxinglist[yue_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < yue_zhi.canggan.length; i++) {
        yue_zhi.score[i][1] = yue_zhi.sanhuifang.sanhufang_e5;
      }
      yue_zhi.hehua = 1;

      ri_zhi.wuxing = ri_zhi.sanhuifang.sanhufang_e5;
      ri_zhi.kewo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      ri_zhi.woke = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      ri_zhi.wosheng = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.generating;
      ri_zhi.shengwo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < ri_zhi.canggan.length; i++) {
        ri_zhi.score[i][1] = yue_zhi.sanhuifang.sanhufang_e5;
      }
      ri_zhi.hehua = 1;

      return 1;
    } else {
      console.log("地支三会方失败");
      return 0;
    }
  } else if (rizhi_sanhui == true) {
    //条件1
    if (
      nian_zhi.wuxing == yue_zhi.kewo ||
      nian_zhi.wuxing == ri_zhi.kewo ||
      nian_zhi.wuxing == shi_zhi.kewo
    ) {
      console.log("年支五行克制月支、日支、时支五行");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.woxing == shi_zhi.di_zhi
    ) {
      console.log("年支刑日月时支");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == shi_zhi.di_zhi
    ) {
      console.log("年支冲日月时支");
      tiaojian_1 = false;
    } else if (
      dizhilist[nian_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == shi_zhi.di_zhi
    ) {
      console.log("年支害日月时支");
      tiaojian_1 = false;
    } else {
      console.log("年支不克制月支不刑不冲不害日月时支");
      tiaojian_1 = true;
    }

    if (tiaojian_1 == true) {
      console.log("地支三会方成功");

      shi_zhi.wuxing = ri_zhi.sanhuifang.sanhufang_e5;
      shi_zhi.kewo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      shi_zhi.woke = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      shi_zhi.wosheng = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.generating;
      shi_zhi.shengwo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < shi_zhi.canggan.length; i++) {
        shi_zhi.score[i][1] = ri_zhi.sanhuifang.sanhufang_e5;
      }
      shi_zhi.hehua = 1;

      ri_zhi.wuxing = ri_zhi.sanhuifang.sanhufang_e5;
      ri_zhi.kewo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      ri_zhi.woke = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      ri_zhi.wosheng = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.generating;
      ri_zhi.shengwo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < ri_zhi.canggan.length; i++) {
        ri_zhi.score[i][1] = ri_zhi.sanhuifang.sanhufang_e5;
      }
      ri_zhi.hehua = 1;

      yue_zhi.wuxing = ri_zhi.sanhuifang.sanhufang_e5;
      yue_zhi.kewo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.counteracting;
      yue_zhi.woke = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.overcoming;
      yue_zhi.wosheng = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.generating;
      yue_zhi.shengwo = wuxinglist[ri_zhi.sanhuifang.sanhufang_e5]?.weakening;
      for (var i = 0; i < yue_zhi.canggan.length; i++) {
        yue_zhi.score[i][1] = ri_zhi.sanhuifang.sanhufang_e5;
      }
      yue_zhi.hehua = 1;

      return 1;
    } else {
      console.log("地支三会方失败");
      return 0;
    }
  } else {
    console.log("地支三会方组合失败");
    return 0;
  }
}

function dizhi_liuhe() {
  let yuerihe = false;
  let rishihe = false;
  let nianyuehe = false;
  let yuerihe_jieguo = false;
  //判断六合组合
  if (yuezhu.branch.group6.name == ri_zhi.di_zhi) {
    console.log("月支日支六合组合成功");
    yuerihe = true;
  } else {
    if (rizhu.branch.group6.name == shi_zhi.di_zhi) {
      console.log("日支时支六合组合成功");
      rishihe = true;
    }
    if (yuezhu.branch.group6.name == nian_zhi.di_zhi) {
      console.log("月支年支六合组合成功");
      nianyuehe = true;
    }
    if (rishihe == false && nianyuehe == false) {
      console.log("六合组合失败");
      return 0;
    }
  }

  //判断合化条件
  if (yuerihe == true) {
    console.log("月支日支六合合化判断：");

    let tiaojian_1 = false;
    let tiaojian_2 = false;
    let tiaojian_3 = false;
    //条件1
    if (
      nian_zhi.wuxing == yue_zhi.kewo ||
      nian_zhi.wuxing == ri_zhi.kewo ||
      nian_zhi.woke == yuezhu.branch.group6E5.name ||
      dizhilist[nian_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[nian_zhi.di_zhi]?.hai == ri_zhi.di_zhi
    ) {
      console.log("年支刑冲克害月日支及合化后五行");
      if (
        shi_zhi.wuxing == nian_zhi.kewo ||
        dizhilist[shi_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.hai == nian_zhi.di_zhi
      ) {
        console.log("时支刑冲克害年支，反克制成功");
        tiaojian_1 = true;
      } else {
        console.log("时支不刑冲克害年支，反克制失败");
        tiaojian_1 = false;
      }
    } else if (
      shi_zhi.wuxing == yue_zhi.kewo ||
      shi_zhi.wuxing == ri_zhi.kewo ||
      shi_zhi.woke == yuezhu.branch.group6E5.name ||
      dizhilist[shi_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
      dizhilist[shi_zhi.di_zhi]?.hai == ri_zhi.di_zhi
    ) {
      console.log("时支刑冲克害月日支及合化后五行");
      if (
        nian_zhi.wuxing == shi_zhi.kewo ||
        dizhilist[nian_zhi.di_zhi]?.woxing == shi_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.chong == shi_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.hai == shi_zhi.di_zhi
      ) {
        console.log("年支刑冲克害时支，反克制成功");
        tiaojian_1 = true;
      } else {
        console.log("年支不刑冲克害时支，反克制失败");
        tiaojian_1 = false;
      }
    } else {
      console.log("时支与月日支无刑冲克害关系");
      tiaojian_1 = true;
    }

    //条件2
    if (yuezhu.branch.e5.name == yuezhu.branch.group6E5.name) {
      console.log("月令与月日支合化后五行相同");
      tiaojian_2 = true;
    }

    //条件3
    let countcanggan_1 = 3;
    let countcanggan_2 = 3;
    if (
      yuezhu.branch.group6E5.name == nian_gan.wuxing ||
      yuezhu.branch.group6E5.name == yue_gan.wuxing ||
      yuezhu.branch.group6E5.name == ri_gan.wuxing ||
      yuezhu.branch.group6E5.name == shi_gan.wuxing
    ) {
      console.log("合化后五行与天干五行有相同");
      for (var i = 0; i < nian_zhi.canggan.length; i++) {
        if (yuezhu.branch.group6E5.name == nian_zhi.score[i][1]) {
          countcanggan_1 = i;
        }
      }
      for (var i = 0; i < shi_zhi.canggan.length; i++) {
        if (yuezhu.branch.group6E5.name == shi_zhi.score[i][1]) {
          countcanggan_2 = i;
        }
      }
      if (countcanggan_1 == 3 && countcanggan_2 == 3) {
        console.log("合化后五行与其他地支藏干没有相同");
        tiaojian_3 = false;
      } else {
        let cangganmeiyoukezhi = true;
        console.log("合化后五行与其他地支藏干有相同");
        for (var i = 0; i < nian_zhi.canggan.length; i++) {
          if (countcanggan_1 != i) {
            if (
              yuezhu.branch.group6E5.counteracting().name ==
              nian_zhi.score[i][1]
            ) {
              console.log("年支藏干的五行有克制合化后的");
              tiaojian_3 = false;
              cangganmeiyoukezhi = false;
              break;
            }
          }
        }
        for (var i = 0; i < shi_zhi.canggan.length; i++) {
          if (countcanggan_2 != i) {
            if (
              yuezhu.branch.group6E5.counteracting().name == shi_zhi.score[i][1]
            ) {
              console.log("时支藏干的五行有克制合化后的");
              tiaojian_3 = false;
              cangganmeiyoukezhi = false;
              break;
            }
          }
        }
        if (
          nian_gan.woke == yuezhu.branch.group6E5.name ||
          yue_gan.woke == yuezhu.branch.group6E5.name ||
          ri_gan.woke == yuezhu.branch.group6E5.name ||
          shi_gan.woke == yuezhu.branch.group6E5.name
        ) {
          console.log("天干的五行有克制合化后的五行");
          tiaojian_3 = false;
        } else if (cangganmeiyoukezhi == true) {
          console.log("合化后五行与其他地支藏干和天干没有被克制关系");
          tiaojian_3 = true;
        }
      }
    }
    if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
      console.log("三个条件都成立，合化成功");
      yuerihe_jieguo = true;

      yue_zhi.wuxing = yuezhu.branch.group6E5.name;
      yue_zhi.kewo = wuxinglist[yuezhu.branch.group6E5.name]?.counteracting;
      yue_zhi.woke = wuxinglist[yuezhu.branch.group6E5.name]?.overcoming;
      yue_zhi.wosheng = wuxinglist[yuezhu.branch.group6E5.name]?.generating;
      yue_zhi.shengwo = wuxinglist[yuezhu.branch.group6E5.name]?.weakening;
      for (let i = 0; i < yue_zhi.canggan.length; i++) {
        yue_zhi.score[i][1] = yuezhu.branch.group6E5.name;
      }
      yue_zhi.hehua = 1;

      ri_zhi.wuxing = yuezhu.branch.group6E5.name;
      ri_zhi.kewo = wuxinglist[yuezhu.branch.group6E5.name]?.counteracting;
      ri_zhi.woke = wuxinglist[yuezhu.branch.group6E5.name]?.overcoming;
      ri_zhi.wosheng = wuxinglist[yuezhu.branch.group6E5.name]?.generating;
      ri_zhi.shengwo = wuxinglist[yuezhu.branch.group6E5.name]?.weakening;
      for (let i = 0; i < ri_zhi.canggan.length; i++) {
        ri_zhi.score[i][1] = yuezhu.branch.group6E5.name;
      }
      ri_zhi.hehua = 1;

      return 1;
    }
  }
  if (yuerihe_jieguo == true) {
    console.log("月支日支六合合化成功");
  } else {
    if (rishihe == true) {
      console.log("月支日支六合合化失败");
      console.log("日支时支六合合化判断：");

      let tiaojian_1 = false;
      let tiaojian_2 = false;
      let tiaojian_3 = false;

      //条件1
      if (
        nian_zhi.wuxing == ri_zhi.kewo ||
        nian_zhi.wuxing == shi_zhi.kewo ||
        nian_zhi.woke == rizhu.branch.group6E5.name ||
        dizhilist[nian_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.woxing == shi_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.chong == shi_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.hai == ri_zhi.di_zhi ||
        dizhilist[nian_zhi.di_zhi]?.hai == shi_zhi.di_zhi
      ) {
        console.log("年支刑冲克害日时支及合化后五行");
        if (
          yue_zhi.wuxing == nian_zhi.kewo ||
          dizhilist[yue_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
          dizhilist[yue_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
          dizhilist[yue_zhi.di_zhi]?.hai == nian_zhi.di_zhi
        ) {
          console.log("月支刑冲克害年支，反克制成功");
          tiaojian_1 = true;
        } else {
          console.log("月支不刑冲克害年支，反克制失败");
          tiaojian_1 = false;
        }
      } else if (
        yue_zhi.wuxing == ri_zhi.kewo ||
        yue_zhi.wuxing == shi_zhi.kewo ||
        yue_zhi.woke == rizhu.branch.group6E5.name ||
        dizhilist[yue_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
        dizhilist[yue_zhi.di_zhi]?.woxing == shi_zhi.di_zhi ||
        dizhilist[yue_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
        dizhilist[yue_zhi.di_zhi]?.chong == shi_zhi.di_zhi ||
        dizhilist[yue_zhi.di_zhi]?.hai == ri_zhi.di_zhi ||
        dizhilist[yue_zhi.di_zhi]?.hai == shi_zhi.di_zhi
      ) {
        console.log("月支刑冲克害日时支及合化后五行");
        if (
          nian_zhi.wuxing == yue_zhi.kewo ||
          dizhilist[nian_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
          dizhilist[nian_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
          dizhilist[nian_zhi.di_zhi]?.hai == yue_zhi.di_zhi
        ) {
          console.log("年支刑冲克害月支，反克制成功");
          tiaojian_1 = true;
        } else {
          console.log("年支不刑冲克害月支，反克制失败");
          tiaojian_1 = false;
        }
      } else {
        console.log("日时支与月日支无刑冲克害关系");
        tiaojian_1 = true;
      }

      //条件2
      if (yuezhu.branch.e5.name == rizhu.branch.group6E5.name) {
        console.log("月令与日时支合化后五行相同");
        tiaojian_2 = true;
      }

      //条件3
      let countcanggan_1 = 3;
      let countcanggan_2 = 3;
      if (
        rizhu.branch.group6E5.name == nian_gan.wuxing ||
        rizhu.branch.group6E5.name == yue_gan.wuxing ||
        rizhu.branch.group6E5.name == ri_gan.wuxing ||
        rizhu.branch.group6E5.name == shi_gan.wuxing
      ) {
        console.log("合化后五行与天干五行有相同");
        for (var i = 0; i < nian_zhi.canggan.length; i++) {
          if (rizhu.branch.group6E5.name == nian_zhi.score[i][1]) {
            countcanggan_1 = i;
          }
        }
        for (var i = 0; i < yue_zhi.canggan.length; i++) {
          if (rizhu.branch.group6E5.name == yue_zhi.score[i][1]) {
            countcanggan_2 = i;
          }
        }
        if (countcanggan_1 == 3 && countcanggan_2 == 3) {
          console.log("合化后五行与其他地支藏干无相同");
          tiaojian_3 = false;
        } else {
          let cangganmeiyoukezhi = true;
          console.log("合化后五行与其他地支藏干有相同");
          for (var i = 0; i < nian_zhi.canggan.length; i++) {
            if (countcanggan_1 != i) {
              if (
                rizhu.branch.group6E5.counteracting().name ==
                nian_zhi.score[i][1]
              ) {
                console.log("年支藏干的五行有克制合化后的");
                tiaojian_3 = false;
                cangganmeiyoukezhi = false;
                break;
              }
            }
          }
          for (var i = 0; i < yue_zhi.canggan.length; i++) {
            if (countcanggan_2 != i) {
              if (
                rizhu.branch.group6E5.counteracting().name ==
                yue_zhi.score[i][1]
              ) {
                console.log("月支藏干的五行有克制合化后的");
                tiaojian_3 = false;
                cangganmeiyoukezhi = false;
                break;
              }
            }
          }
          if (
            nian_gan.woke == rizhu.branch.group6E5.name ||
            yue_gan.woke == rizhu.branch.group6E5.name ||
            ri_gan.woke == rizhu.branch.group6E5.name ||
            shi_gan.woke == rizhu.branch.group6E5.name
          ) {
            console.log("天干的五行有克制合化后的五行");
            tiaojian_3 = false;
          } else if (cangganmeiyoukezhi == true) {
            console.log("合化后五行与其他地支藏干和天干无克制关系");
            tiaojian_3 = true;
          }
        }
      }
      if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
        console.log("日支时支六合合化成功");

        let rishihe_jieguo = true;

        ri_zhi.wuxing = rizhu.branch.group6E5.name;
        ri_zhi.kewo = wuxinglist[rizhu.branch.group6E5.name]?.counteracting;
        ri_zhi.woke = wuxinglist[rizhu.branch.group6E5.name]?.overcoming;
        ri_zhi.wosheng = wuxinglist[rizhu.branch.group6E5.name]?.generating;
        ri_zhi.shengwo = wuxinglist[rizhu.branch.group6E5.name]?.weakening;
        for (let i = 0; i < ri_zhi.canggan.length; i++) {
          ri_zhi.score[i][1] = rizhu.branch.group6E5.name;
        }
        ri_zhi.hehua = 1;

        shi_zhi.wuxing = rizhu.branch.group6E5.name;
        shi_zhi.kewo = wuxinglist[rizhu.branch.group6E5.name]?.counteracting;
        shi_zhi.woke = wuxinglist[rizhu.branch.group6E5.name]?.overcoming;
        shi_zhi.wosheng = wuxinglist[rizhu.branch.group6E5.name]?.generating;
        shi_zhi.shengwo = wuxinglist[rizhu.branch.group6E5.name]?.weakening;
        for (let i = 0; i < shi_zhi.canggan.length; i++) {
          shi_zhi.score[i][1] = rizhu.branch.group6E5.name;
        }
        shi_zhi.hehua = 1;
      }
    }
    if (nianyuehe == true) {
      console.log("月支日支六合合化失败");
      console.log("年支月支六合合化判断：");

      let tiaojian_1 = false;
      let tiaojian_2 = false;
      let tiaojian_3 = false;

      //条件1
      if (
        ri_zhi.wuxing == yue_zhi.kewo ||
        ri_zhi.wuxing == nian_zhi.kewo ||
        ri_zhi.woke == yuezhu.branch.group6E5.name ||
        dizhilist[ri_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
        dizhilist[ri_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
        dizhilist[ri_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
        dizhilist[ri_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
        dizhilist[ri_zhi.di_zhi]?.hai == yue_zhi.di_zhi ||
        dizhilist[ri_zhi.di_zhi]?.hai == nian_zhi.di_zhi
      ) {
        console.log("日支刑冲克害日时支及合化后五行");
        if (
          shi_zhi.wuxing == ri_zhi.kewo ||
          dizhilist[shi_zhi.di_zhi]?.woxing == ri_zhi.di_zhi ||
          dizhilist[shi_zhi.di_zhi]?.chong == ri_zhi.di_zhi ||
          dizhilist[shi_zhi.di_zhi]?.hai == ri_zhi.di_zhi
        ) {
          console.log("时支刑冲克害日支，反克制成功");
          tiaojian_1 = true;
        } else {
          console.log("时支不刑冲克害日支，反克制失败");
          tiaojian_1 = false;
        }
      } else if (
        shi_zhi.wuxing == nian_zhi.kewo ||
        shi_zhi.wuxing == yue_zhi.kewo ||
        shi_zhi.woke == yuezhu.branch.group6E5.name ||
        dizhilist[shi_zhi.di_zhi]?.woxing == nian_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.woxing == yue_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.chong == nian_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.chong == yue_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.hai == nian_zhi.di_zhi ||
        dizhilist[shi_zhi.di_zhi]?.hai == shi_zhi.di_zhi
      ) {
        console.log("月支刑冲克害日时支及合化后五行");
        if (
          ri_zhi.wuxing == shi_zhi.kewo ||
          dizhilist[ri_zhi.di_zhi]?.woxing == shi_zhi.di_zhi ||
          dizhilist[ri_zhi.di_zhi]?.chong == shi_zhi.di_zhi ||
          dizhilist[ri_zhi.di_zhi]?.hai == shi_zhi.di_zhi
        ) {
          console.log("日支刑冲克害时支，反克制成功");
          tiaojian_1 = true;
        } else {
          console.log("日支不刑冲克害时支，反克制失败");
          tiaojian_1 = false;
        }
      } else {
        console.log("日时支与月日支无刑冲克害关系");
        tiaojian_1 = true;
      }

      //条件2
      if (yuezhu.branch.e5.name == yuezhu.branch.group6E5.name) {
        console.log("月令与日时支合化后五行相同");
        tiaojian_2 = true;
      }

      //条件3
      let countcanggan_1 = 3;
      let countcanggan_2 = 3;
      if (
        yuezhu.branch.group6E5.name == nian_gan.wuxing ||
        yuezhu.branch.group6E5.name == yue_gan.wuxing ||
        yuezhu.branch.group6E5.name == ri_gan.wuxing ||
        yuezhu.branch.group6E5.name == shi_gan.wuxing
      ) {
        console.log("合化后五行与天干五行有相同");
        for (var i = 0; i < ri_zhi.canggan.length; i++) {
          if (yuezhu.branch.group6E5.name == ri_zhi.score[i][1]) {
            countcanggan_1 = i;
          }
        }
        for (var i = 0; i < shi_zhi.canggan.length; i++) {
          if (yuezhu.branch.group6E5.name == shi_zhi.score[i][1]) {
            countcanggan_2 = i;
          }
        }
        if (countcanggan_1 == 3 && countcanggan_2 == 3) {
          console.log("合化后五行与其他地支藏干无相同");
          tiaojian_3 = false;
        } else {
          let cangganmeiyoukezhi = true;
          console.log("合化后五行与其他地支藏干有相同");
          for (var i = 0; i < ri_zhi.canggan.length; i++) {
            if (countcanggan_1 != i) {
              if (
                yuezhu.branch.group6E5.counteracting().name ==
                ri_zhi.score[i][1]
              ) {
                console.log("年支藏干的五行有克制合化后的");
                tiaojian_3 = false;
                cangganmeiyoukezhi = false;
                break;
              }
            }
          }
          for (var i = 0; i < shi_zhi.canggan.length; i++) {
            if (countcanggan_2 != i) {
              if (
                yuezhu.branch.group6E5.counteracting().name ==
                shi_zhi.score[i][1]
              ) {
                console.log("月支藏干的五行有克制合化后的");
                tiaojian_3 = false;
                cangganmeiyoukezhi = false;
                break;
              }
            }
          }
          if (
            nian_gan.woke == yuezhu.branch.group6E5.name ||
            yue_gan.woke == yuezhu.branch.group6E5.name ||
            ri_gan.woke == yuezhu.branch.group6E5.name ||
            shi_gan.woke == yuezhu.branch.group6E5.name
          ) {
            console.log("天干的五行有克制合化后的五行");
            tiaojian_3 = false;
          } else if (cangganmeiyoukezhi == true) {
            console.log("合化后五行与其他地支藏干和天干无克制关系");
            tiaojian_3 = true;
          }
        }
      }

      if (tiaojian_1 == true && tiaojian_2 == true && tiaojian_3 == true) {
        console.log("年支月支六合合化成功");

        let nianyuehe_jieguo = true;

        nian_zhi.wuxing = yuezhu.branch.group6E5.name;
        nian_zhi.kewo = wuxinglist[yuezhu.branch.group6E5.name]?.counteracting;
        nian_zhi.woke = wuxinglist[yuezhu.branch.group6E5.name]?.overcoming;
        nian_zhi.wosheng = wuxinglist[yuezhu.branch.group6E5.name]?.generating;
        nian_zhi.shengwo = wuxinglist[yuezhu.branch.group6E5.name]?.weakening;
        for (let i = 0; i < nian_zhi.canggan.length; i++) {
          nian_zhi.score[i][1] = yuezhu.branch.group6E5.name;
        }
        nian_zhi.hehua = 1;

        yue_zhi.wuxing = yuezhu.branch.group6E5.name;
        yue_zhi.kewo = wuxinglist[yuezhu.branch.group6E5.name]?.counteracting;
        yue_zhi.woke = wuxinglist[yuezhu.branch.group6E5.name]?.overcoming;
        yue_zhi.wosheng = wuxinglist[yuezhu.branch.group6E5.name]?.generating;
        yue_zhi.shengwo = wuxinglist[yuezhu.branch.group6E5.name]?.weakening;
        for (let i = 0; i < yue_zhi.canggan.length; i++) {
          yue_zhi.score[i][1] = yuezhu.branch.group6E5.name;
        }
        yue_zhi.hehua = 1;
      }
    }
    if (nianyuehe_jieguo == true || rishihe_jieguo == true) {
      return 1;
    }
  }
}
//计算五行的分数
function e5scoresum() {
  wuxing_score[nian_gan.wuxing].score += nian_gan.score;
  wuxing_score[yue_gan.wuxing].score += yue_gan.score;
  wuxing_score[ri_gan.wuxing].score += ri_gan.score;
  wuxing_score[shi_gan.wuxing].score += shi_gan.score;
  for (var i = 0; i < nian_zhi.canggan.length; i++) {
    wuxing_score[nian_zhi.score[i][1]].score += nian_zhi.score[i][0];
  }
  for (var i = 0; i < yue_zhi.canggan.length; i++) {
    wuxing_score[yue_zhi.score[i][1]].score += yue_zhi.score[i][0];
  }
  for (var i = 0; i < ri_zhi.canggan.length; i++) {
    wuxing_score[ri_zhi.score[i][1]].score += ri_zhi.score[i][0];
  }
  for (var i = 0; i < shi_zhi.canggan.length; i++) {
    wuxing_score[shi_zhi.score[i][1]].score += shi_zhi.score[i][0];
  }
  console.log(wuxing_score);
}

function geju1() {
  let tongdang_score = 0; //同党分数
  let yidang_score = 0; //异党分数
  let shenqiangshenruo = -1; //标记身强身弱的程度
  let geju2 = -1;
  let zaqi = -1; //杂气格信息由1 和2组成，1是没有，2是有
  let qianzai = -1; //潜在格信息由1和4组成，1是有，4是没有
  //潜在和杂气携带在geju这个里面的方式就是：geju*zaqi*qianzai，在还原的时候判断是否在10-19之间，如果大于19且小于等于38则除以2并得到杂气格，大于38且小于等于76则除以4得到潜在格，大于76且小于等于152则除以8并得到潜在杂气格
  /*
  geju这个变量为标记是什么格局
  格局为：
  化木格：1
  化火格：2
  化土格：3
  化金格：4
  化水格：5

  专旺格：6

  从财格：7
  从杀格：8
  从儿格：9

  建禄格：10
  羊刃格：11
  正印格：12
  偏印格：13
  食神格：14
  伤官格：15
  正财格：16
  偏财格：17
  正官格：18
  七杀格：19

  */
  //因为日干的属性在合化时会改变所以这里不管合没合化都可以用这个来计算同党分数
  tongdang_score =
    wuxing_score[ri_gan.wuxing].score + wuxing_score[ri_gan.shengwo].score;
  console.log("同党为：" + ri_gan.wuxing + ri_gan.shengwo);
  console.log("同党分数为：" + tongdang_score);
  yidang_score = 610 - tongdang_score;
  console.log("异党为：" + ri_gan.wosheng + ri_gan.woke + ri_gan.kewo);
  console.log("异党分数为：" + yidang_score);
  if (tongdang_score <= 80) {
    console.log("极弱");
    shenqiangshenruo = 0;
  } else if (tongdang_score > 80 && tongdang_score <= 180) {
    console.log("身弱");
    shenqiangshenruo = 1;
  } else if (tongdang_score > 180 && tongdang_score <= 305) {
    console.log("偏弱");
    shenqiangshenruo = 2;
  } else if (tongdang_score > 305 && tongdang_score <= 440) {
    console.log("偏强");
    shenqiangshenruo = 3;
  } else if (tongdang_score > 440 && tongdang_score <= 570) {
    console.log("身强");
    shenqiangshenruo = 4;
  } else if (tongdang_score > 570) {
    console.log("极强");
    shenqiangshenruo = 5;
  }
  if (ri_gan.hehua == 0) {
    console.log("日干未合化");

    //专旺格判断
    if (tongdang_score > 570 && wuxing_score[ri_gan.wuxing].score > 488) {
      console.log("格局为：专旺格");
      geju2 = 6;
      xi = ri_gan.wuxing + ri_gan.shengwo;
      ji = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
      console.log("喜:", xi, "忌:", ji);
      return geju2;
    }

    //从强格判断
    if (
      tongdang_score > 40 &&
      tongdang_score < 80 &&
      wuxing_score[yuezhu.branch.hiddenStems[0].e5.name].score > 488
    ) {
      if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.woke) {
        console.log("格局为：从财格");
        xi = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
        ji = ri_gan.wuxing + ri_gan.shengwo;

        geju2 = 7;
        return geju2;
      } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.kewo) {
        console.log("格局为：从杀格");
        xi = ri_gan.woke + ri_gan.kewo;
        ji = ri_gan.wuxing + ri_gan.wosheng + ri_gan.shengwo;
        geju2 = 8;
        return geju2;
      } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.wosheng) {
        console.log("格局为：从儿格");
        xi = ri_gan.wosheng + ri_gan.woke;
        ji = ri_gan.wuxing + ri_gan.shengwo + ri_gan.kewo;
        geju2 = 9;
        return geju2;
      }
      console.log("喜:", xi, "忌:", ji);
    }

    //杂气格

    if (
      yue_zhi.dizhi == "辰" ||
      yue_zhi.dizhi == "戌" ||
      yue_zhi.dizhi == "丑" ||
      yue_zhi.dizhi == "未"
    ) {
      console.log("杂气");
      zaqi = 2;
    } else {
      console.log("无杂气");
      zaqi = 1;
    }
    //潜在
    if (
      nianzhu.stem.e5.name != yuezhu.branch.hiddenStems[0].e5.name &&
      yuezhu.stem.e5.name != yuezhu.branch.hiddenStems[0].e5.name &&
      rizhu.stem.e5.name != yuezhu.branch.hiddenStems[0].e5.name &&
      shizhu.stem.e5.name != yuezhu.branch.hiddenStems[0].e5.name
    ) {
      console.log("潜在");
      qianzai = 1;
    } else {
      console.log("无潜在");
      qianzai = 4;
    }
    //十神正格判断
    if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.wuxing) {
      if (
        dizhilist[yuezhu.branch.name].canggan[yuezhu.branch.hiddenStems[0].name]
          .yinyang == tianganlist[ri_gan.tian_gan].yinyang
      ) {
        geju2 = 10;
        console.log("格局为：建禄格");
      } else {
        geju2 = 11;
        console.log("格局为：羊刃格");
      }
    } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.shengwo) {
      if (
        dizhilist[yuezhu.branch.name].canggan[yuezhu.branch.hiddenStems[0].name]
          .yinyang == tianganlist[ri_gan.tian_gan].yinyang
      ) {
        geju2 = 13;
        console.log("格局为：偏印格");
      } else {
        geju2 = 12;
        console.log("格局为：正印格");
      }
    } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.wosheng) {
      if (
        dizhilist[yuezhu.branch.name].canggan[yuezhu.branch.hiddenStems[0].name]
          .yinyang == tianganlist[ri_gan.tian_gan].yinyang
      ) {
        geju2 = 14;
        console.log("格局为：食神格");
      } else {
        geju2 = 15;
        console.log("格局为：伤官格");
      }
    } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.woke) {
      if (
        dizhilist[yuezhu.branch.name].canggan[yuezhu.branch.hiddenStems[0].name]
          .yinyang == tianganlist[ri_gan.tian_gan].yinyang
      ) {
        geju2 = 17;
        console.log("格局为：偏财格");
      } else {
        geju2 = 16;
        console.log("格局为：正财格");
      }
    } else if (yuezhu.branch.hiddenStems[0].e5.name == ri_gan.kewo) {
      if (
        dizhilist[yuezhu.branch.name].canggan[yuezhu.branch.hiddenStems[0].name]
          .yinyang == tianganlist[ri_gan.tian_gan].yinyang
      ) {
        geju2 = 19;
        console.log("格局为：七杀格");
      } else {
        geju2 = 18;
        console.log("格局为：正官格");
      }
    }

    if (tongdang_score <= 305) {
      xi = ri_gan.wuxing + ri_gan.shengwo;
      ji = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
    } else {
      xi = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
      ji = ri_gan.wuxing + ri_gan.shengwo;
    }
    console.log("喜:", xi, "忌:", ji);
    return geju2 * qianzai * zaqi;
  } else {
    console.log("日干合化");
    console.log("格局为：化" + ri_gan.wuxing + "格");
    if (tongdang_score <= 305) {
      xi = ri_gan.wuxing + ri_gan.shengwo;
      ji = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
    } else {
      xi = ri_gan.wosheng + ri_gan.woke + ri_gan.kewo;
      ji = ri_gan.wuxing + ri_gan.shengwo;
    }
    console.log("喜:", xi, "忌:", ji);
    switch (ri_gan.wuxing) {
      case "木":
        geju2 = 1;
        break;
      case "火":
        geju2 = 2;
        break;
      case "土":
        geju2 = 3;
        break;
      case "金":
        geju2 = 4;
        break;
      case "水":
        geju2 = 5;
        break;
      default:
        break;
    }
    return geju2;
  }
}
/* function chushi_geju(yue_zhi,ri_gan){
  if(yue_zhi.score[0][1]==ri_gan.wuxing.name){
    console.log("初始格局为：");
  }
} */

function main() {
  rl.question("请输入形如2022/07/18 14:40的时间", (dateTimeStr) => {
    try {
      rl.question("请输入性别（男/女）", (gender) => {
        try {
          jisuan(dateTimeStr, gender);
        } catch (err) {
          console.log("输入时间或性别格式错误");
        }
        return rl.close();
      });
    } catch (err) {
      console.log("输入时间格式错误");
      return rl.close();
    }
  });
}

// 执行主程序
main();
