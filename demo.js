let MeituanPub = require("./index.js");
let mtPub = new MeituanPub("你的appKey", "你的utmSource");

async function getList() {
  //通用接口
  //第一个参数是接口地址，第二个参数是除公共参数以外的其他参数
  let data = await mtPub.request("data/promote/verify/item", {
    startAddDate: "2021-04-01",
    endAddDate: "2021-04-30",
    page: 1,
    size: 100
  })
  console.log(data);
}

//生成推广链接
async function generateLink() {
  let data = await mtPub.generateLink({
    utmMedium: "xiaojigugu",
    activity: "OwMkGzn6oK",
    promotionId: "推广位ID",
    pageLevel: 2,
  })
  console.log(data)
}

//aes解密
async function aesDecode() {
  let data = mtPub.aesDecode("需要解密的数据")
  console.log(data)
}

getList();
generateLink();
aesDecode();