App({
  onLaunch: function () {
    this._login();
  },
  globalData: {
    userInfo: null,
    loginSessionKey: null,
    domain: 'http://localhost:8443',
    idioms_img_domin: 'http://localhost:8080/idioms/',
    grade_names: ['学童', '童生', '秀才', '举人',
      '贡士', '进士', '翰林', '侍郎', '尚书',
      '大学士', '御史', '丞相', '太子少师', '太子太师',
      '太师', '太子', '皇帝'],
    grade:null,
    sort:null,
    credit:null
  },
  onShow:function(){
    this.checkLogin();
  },
  onHide: function () {
    //修改用户的记录信息操作
    this.insertOrUpdateUserIdiom();
    this.checkLogin();
  },
  _login : function () {
    var that = this;
    that.checkLogin()
    var loginSessionKey = wx.getStorageSync('loginSessionKey');
    if (!loginSessionKey) {
      //登录
      wx.login({
        success: res => {
          wx.request({
            url: this.globalData.domain + '/users/'+res.code+'/login',
            method : 'POST',
            header: {
              'content-type': 'application/json'
            },
            dataType:'json',
            success : function (res) {
              if (res.statusCode == 200) {
                console.log(res);
                wx.setStorageSync('loginSessionKey', res.data.content.third_session);
                wx.setStorageSync('loginSessionTime', Date.parse(new Date())+ 86400000);
                that.globalData.loginSessionKey = res.data.content.third_session;
              } else {
                console.log(res.data)
              }
            },
            fail : function (e) {
              console.log(e);
            }
          })
        }
      })
    } else {
      this.globalData.loginSessionKey = loginSessionKey;
    }
  },

  /** 修改用户等级和答题的记录 */
  insertOrUpdateUserIdiom: function () {
    var that = this;
    wx.request({
      url: that.globalData.domain + '/idioms/user?third_session=' + that.globalData.loginSessionKey,
      data: {
        idiomGrade: that.globalData.grade,
        idiomSort: that.globalData.sort
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  checkLogin:function(){
    console.log("start check login")
    var timestamp = Date.parse(new Date());
    var loginSessionTime = wx.getStorageSync('loginSessionTime');
    if (!loginSessionTime || timestamp + 1000 > loginSessionTime) {
      wx.removeStorageSync("loginSessionKey");
    }
    console.log("end check login")
  }
})