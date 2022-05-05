const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config')
// 阿里短信服务插件
const Dysmsapi20170525 = require('@alicloud/dysmsapi20170525')
const { SendSmsRequest } = require('@alicloud/dysmsapi20170525');
const { Config } = require('@alicloud/openapi-client');
const errorType = require('../constants/error-types');

// ali的accessKey
const accessKeyId = 'LTAI5tAhPNmJhACvTuPDnyXC'
const secretAccessKey = 'f7Vbh18l9UOldJkjCDeRd81oMrqowu'
// 此次登录的短信验证码
let currentPhone = ''
let verifyCode = ''

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user;
    const token = jwt.sign({ id, name}, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256"
    });

    const nowTime = new Date().getTime();
    const overTime = nowTime + 60 * 60 * 24 * 1000

    ctx.body = {
      code: 200,
      data: { id, name, token, overTime }
    }
  }

  async phoneLogin(ctx, next) {
    const { number, code } = ctx.request.body;
    if(number === currentPhone && code === verifyCode) {
      const { id, name } = ctx.user;
      const token = jwt.sign({ id, name}, PRIVATE_KEY, {
        expiresIn: 60 * 60 * 24,
        algorithm: "RS256"
      });

      const nowTime = new Date().getTime();
      const overTime = nowTime + 60 * 60 * 24 * 1000

      ctx.body = {
        code: 200,
        data: { id, name, token, overTime }
      }
    } else {
      const error = new Error(errorType.PHONE_DOES_NOT_EXISTS);
      return ctx.app.emit('error', error, ctx);
    }
  }
  
  static createClient(accessKeyId, accessKeySecret) {
    let config = new Config({
      // 您的AccessKey ID
      accessKeyId: accessKeyId,
      // 您的AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // 访问的域名
    config.endpoint = `dysmsapi.aliyuncs.com`;
    return new Dysmsapi20170525.default(config);
  }

  async sendmsg(ctx, next) {
    try {
      // console.log("开始发送短信")
      const { phoneNumber } = ctx.request.body;
      currentPhone = phoneNumber
      verifyCode = ''
      for(let i = 0; i < 6; i++) {
        verifyCode += Math.floor(Math.random() * 10)
      }
      // 初始化 smsclient
      const client = AuthController.createClient(accessKeyId, secretAccessKey);
      let sendSmsRequest = new SendSmsRequest({
        signName: "阿里云短信测试",
        templateCode: "SMS_154950909",
        phoneNumbers: phoneNumber,
        templateParam: `{\"code\":\"${verifyCode}\"}`,
      });
      //发送短信
      const result = await client.sendSms(sendSmsRequest);
      // const result = {Code: "OK"}
      if(result.Code = "OK") {
        ctx.body = {
          code: 200,
          data: {
            verifyCode: verifyCode,
            message: '短信发送成功~'
          }
        }
      } else {
        ctx.body = {
          code: 0,
          data: {
            message: '短信发送失败~'
          }
        }
      }
    } catch (error) {
      ctx.body = {
        code: 0,
        data: {
          message: '短信发送失败~'
        }
      }
    }

  }

  async success(ctx, next) {
    ctx.body = "授权成功";
  }
}

module.exports = new AuthController();