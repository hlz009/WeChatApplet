const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    if (null == e.detail.userInfo) {
      return;
    }
    var userId = app.globalData.userId;    
    if (null == userId || 0 == userId) {
      var that = this;
      wx.login({
        success: res => {
          //返回openid,并存入openid
          wx.request({
            url: app.globalData.domain + '/users/userAndOpenid/' + res.code,
            method:'get',
            dataType:'json',
            success:function(res){
              console.log(res);
              userId = res.data.userId;
              var user = e.detail.userInfo;
              wx.setStorageSync('user', user);
              if (userId == null || 0 == userId) {
                //不存在用户
                that.x_setAndgetUser(user, res.data.wxopenid);
              } else {
                app.globalData.userId = userId;
                wx.setStorageSync('userId', userId);
                app.globalData.userInfo = user
                that.setData({
                  userInfo: user,
                  hasUserInfo: true
                }) 
              }
            },
            fail:function(e){
              console.log("获取用户openid失败");
            }
          })
        }
      })
    } else {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: user,
        hasUserInfo: true
      })
    }
  },
  onShareAppMessage: function () {

  },
  x_setAndgetUser:function(user, openid){
    wx.request({
      url: app.globalData.domain + '/users',
      method:'post',
      data:{
        'wxopenid':openid,
        'nickname':user.nickName,
        'avatarUrl': user.avatarUrl
      },
      success:function(e){
        //存入userId
        var userId = e.data.userId;
        app.globalData.userId = userId;
        wx.setStorageSync('userId', userId);        
        console.log("登录成功");
      },
      fail:function(e){
        console.log("登录失败" + e);
      }
    })
    app.globalData.userInfo = user
    this.setData({
      userInfo: user,
      hasUserInfo: true
    })
  },
  nameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  titleInput:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  contenInput:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  anonymous:function(e){
    var _this_value = e.detail.value
    if (null == _this_value || _this_value.length == 0) {
      _this_value[0] = 0;
    }
    this.setData({
      anonymous: parseInt(_this_value[0])
    })
  },
  submit:function(){
    var name = this.data.name;
    var content = this.data.content;
    // wx.navigateTo({
    //   url: '../my/my'
    // })
    if (name == null || "" == name) {
      wx.showModal({
        title: '错误提示',
        content: '作品名不能为空哦',
        showCancel: false,        
        success: function (res) {
        }
      })
        return;
    }
    if (content == null || "" == content) {
      wx.showModal({
        title: '错误提示',
        content: '剧透内容不能为空哦',
        showCancel:false,
        success: function (res) {
        }
      })      
      return;
    }    
    wx.request({
      url: app.globalData.domain + '/works/' + app.globalData.userId,
      method:'post',
      data:{
        name: name,
        subTitile: this.data.title,
        content: content,
        isAnonymous: this.data.anonymous
      },
      success:function(e){
        wx.showToast({
          title: '写入成功',
          icon: 'success_no_circle',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../my/my'
          })
        }, 1500)
      },
      fail:function(e){
        wx.showModal({
          title: '错误提示',
          content: '写入失败，请稍后再试',
          showCancel: false,
          success: function (res) {
          }
        })  
        console.log("写入作品失败" + e);
      }
    })
  } 
})
