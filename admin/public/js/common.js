Number.prototype.toFormat = function (format) {
    let str = this.toString();
    if (format) {
        let len = format.length;
        let zeros = len - str.length;
        if (zeros > 0) {
            let zeroString = Array(zeros + 1).join("0");
            str = zeroString + str;
        }
    }
    return str;
}
Array.prototype.randomize=function(num){
    let arr=[];
    const thisArray=this;
    for (let index = 0; arr.length < num; index++) {
        let elm=Math.floor(Math.random()* thisArray.length);
        if(arr.indexOf(elm)==-1)arr.push(elm);
    }
    return arr.map(e=>thisArray[e]);
};
