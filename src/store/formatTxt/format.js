let placeHolder = '#';
let params = {};

String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}


/**
 * 如果占位符后不是两位小数，则取下一个占位符的下标
 * @param arr
 * @param str
 */
let getIndexHolder = (arr, str) => {
  let firstIndex = arr.indexOf(str);
  if(firstIndex===-1) return firstIndex;
  let tempArr = arr.filter((item,index) => index>firstIndex&&index<=firstIndex+2);
  tempArr = tempArr.filter(item=>!isNaN(item));
  if(tempArr.length<2) {
    let tArr = [];
    Object.assign(tArr,arr);
    tArr[firstIndex] = "&";
    return getIndexHolder(tArr, str);
  } else {
    return firstIndex;
  }
};

let replaceArr = (tmpArr, valArr, line) => {
  let key = tmpArr.filter((item, index) => index <= 2).join('');
  let arr1 = [];
  let arr2 = [];
  // 获取#00占位符后,第二个占位符前的内容
  arr1 = tmpArr.filter((item, index) => index>2);// def#02gh
  arr2 = arr1.filter((item,index) => {
    if(getIndexHolder(arr1, placeHolder)===-1) return true;
    return index < getIndexHolder(arr1, placeHolder)// def
  });
  let endIndex = valArr.join('').indexOf(arr2.join(''));// 第一个占位符在内容中的截止下标

  // 组成第一个占位符对应关系
  let firstVal;
  if(endIndex===0) {
    firstVal = valArr.join('');
  } else {
    firstVal = valArr.filter((item, index) => index < endIndex).join('');
  }
  params[key] = firstVal;
  // 如果没有占位符了，结束方法
  if(getIndexHolder(arr1, placeHolder)===-1) return;
  // 生成第二个占位符对应关系
  tmpArr = arr1.filter((item, index) => index >= getIndexHolder(arr1, placeHolder));
  valArr = valArr.filter((item, index) => index >= (endIndex+arr2.length));
  // 递归调用，继续生成下一个占位符内容
  replaceArr(tmpArr, valArr, line);
};

/**
 * 生成占位符与实际值对应关系
 * @param {源模板} reTemp
 * @param {内容} value
 * @param {行号} line
 */
let replaceStr = (reTemp, value, line) => {
  let tmpArr = reTemp.split('');
  let valArr = value.split('');
  let first = getIndexHolder(tmpArr, placeHolder);// 第一个#位置
  tmpArr = tmpArr.filter((item, index) => index>=first);
  valArr = valArr.filter((item, index) => index>=first);
  // 模板#开头，对应内容，获取对应关系
  replaceArr(tmpArr, valArr, line);
  console.log(params);
};

// replaceStr(", #02 = #{#03,jdbcType=DECIMAL}", ", SLAB_HEAD_WIDTH = #{slabHeadWidth,jdbcType=DECIMAL}", 1);

export let formatText = (content, beforeTmp, afterTmp) => {
  let msgArr = content.split("\n");
  let beforeArr = beforeTmp.split("\n");
  let beforeLen = beforeArr.length;// 每beforeLen次做一次替换
  let afterArr = afterTmp.split("\n");

  let resultStr = "";
  for(let i=0; i<msgArr.length; i++) {
    // 生成占位符，内容对应关系
    replaceStr(beforeArr[i%beforeLen], msgArr[i], i);
    if(((i+1)%beforeLen===0&&i>0)||beforeLen===1) {// 源模板多行或者一行
      // 替换模板
      afterArr.forEach(item=>{
        let result = item;
        for(let key in params) {
          result = result.replaceAll(key, params[key]);
        }
        resultStr += result+"\r\n";
      });
      params = {};
    }
  }
  return resultStr;
};
