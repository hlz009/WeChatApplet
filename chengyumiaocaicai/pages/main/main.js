const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      grade:null,
      sort:null,
      credit:null,
      idiom_img_url:null,
      error_hidden:true,
      success_hidden:true,
      record_sort_text:[-1,-1,-1,-1],//记录选中的下标
      record_text_index:0,//记录是第几次选
      record_option_text:['','','','']//记录选中的文本
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.insertOrUpdateUserIdiom();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
 
  },

  _init:function() {
    var that = this;
    if (!that.data.grade || !that.data.sort) {
      if (!app.globalData.grade || !app.globalData.sort) {
        that.getUserIdiom();
      } else {
        that._init_grade_sort();
        that.getIdiomAnswerOption(app.globalData.grade, app.globalData.sort);
      }
    } else {
      that._init_grade_sort();
      that.getIdiomAnswerOption(app.globalData.grade, app.globalData.sort);
    }

    if (!app.globalData.credit) {
      that.getUserCredit();
    } else {
      var credit = app.globalData.credit;
      that.setData({
        credit: credit
      })
    }
  },
  _init_grade_sort:function(){
    var grade = app.globalData.grade;
    var sort = app.globalData.sort;
    this.setData({
      grade: grade,
      sort: sort,
      idiom_img_url: app.globalData.idioms_img_domin + grade + "-" + sort + ".jpg"
    });
    wx.setNavigationBarTitle({// 修改文本标题
      title: app.globalData.grade_names[grade]
    })
  },
  /**
    * 得到用户猜词记录及等级
    */
  getUserIdiom: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/idioms',
      data: {
        third_session: app.globalData.loginSessionKey
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        var grade = result.content.idiomGrade;
        var sort = result.content.idiomSort;
        if (result.status = 200) {
          that.setData({
            grade :grade,
            sort : sort,
            idiom_img_url : app.globalData.idioms_img_domin + grade + "-" + sort + ".jpg"   
          }) 
          app.globalData.grade = grade;
          app.globalData.sort = sort;
          wx.setNavigationBarTitle({// 修改文本标题
            title: app.globalData.grade_names[grade]
          })
          that.getIdiomAnswerOption(grade, sort);
        }
      }
    })
  },
  /**
    * 得到用户积分数据
    */
  getUserCredit: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/credits',
      data: {
        third_session: app.globalData.loginSessionKey
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result.status = 200) {
          app.globalData.credit = result.content.credit;
          that.setData({
            credit: result.content.credit
          }) 
        }
      }
    })
  },
  getIdiomAnswerOption:function(grade, sort){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/idioms/'+sort,
      data: {
        third_session: app.globalData.loginSessionKey,
        grade:grade
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data;
        if (result.status = 200) {
          console.log(result);
          var option_length = result.content.option.length;
          var selectIdiom = [];
          for (let i = 0; i<length; i++) {
            selectIdiom[i]=-1;//初始化记录选中变化的下标
          }
          that.setData({
            answer:result.content.answer,
            option: result.content.option,
            selectIdiom: selectIdiom
          })
        }
      }
    })    
  },
  addText:function(e){
    var record_text_index = this.data.record_text_index;
    if (record_text_index >= 4) {
      return;
    }
    var selected_index = e.currentTarget.id;
    var selectIdiom = this.data.selectIdiom;
    selectIdiom[selected_index] = selected_index;
    var record_sort_text = this.data.record_sort_text;
    var record_option_text = this.data.record_option_text;
    var option = this.data.option;
    record_sort_text[record_text_index] = selected_index;
    record_option_text[record_text_index] = option[selected_index]
    record_text_index++;
    this.setData({
      selectIdiom: selectIdiom,
      record_sort_text: record_sort_text,
      record_text_index: record_text_index,
      record_option_text: record_option_text
    })
    if (record_text_index == 4) {
        //judge anwser
      var check = this.checkAnswer(record_option_text,
        this.data.answer);
      console.log(check)
      var success_text = this.data.answer.split(',').join('')
       this.setData({
         error_hidden: check,
         success_hidden :!check,
         success_text: success_text
       })
    }
  },
  cancelText:function(e){
    var record_text_index = this.data.record_text_index;
    if (record_text_index <= 0) {
      return;
    }
    var selected_index = e.currentTarget.id;
    var selectIdiom = this.data.selectIdiom;
    var record_sort_text = this.data.record_sort_text;
    var recover_option_index = record_sort_text[selected_index]//得到恢复的下标
    var record_option_text = this.data.record_option_text;
    selectIdiom[recover_option_index] = -1;//恢复-1
    record_sort_text[selected_index] = -1;//恢复-1
    record_option_text[selected_index] = '';//屏蔽文本
    record_text_index--;
    this.setData({
      selectIdiom: selectIdiom,
      record_sort_text: record_sort_text,
      record_text_index: record_text_index,
      record_option_text: record_option_text
    })
  },
  checkAnswer: function (record_option_text, answer) {
    var answerArray = answer.split(',')
    if (record_option_text[0] == answerArray[0] &&
      record_option_text[1] == answerArray[1] &&
      record_option_text[2] == answerArray[2] &&
      record_option_text[3] == answerArray[3]) {
        return true;
    }
    return false;
  },
  confirm:function(){
    console.log("进入下一个")
   // that.data.grade = that.data.grade
    app.globalData.sort = this.data.sort + 1;
    app.globalData.credit = app.globalData.credit + 5;
    //清除上一页面的显示
    this.setData({
      error_hidden: true,
      success_hidden: true,
      record_sort_text: [-1, -1, -1, -1],//记录选中的下标
      record_text_index: 0,//记录是第几次选
      record_option_text: ['', '', '', ''],//记录选中的文本
      success_hidden: true
    });
    this._init();
  },
  error_open: function () {
    this.error_close()
  },
  error_close: function () {
    this.setData({
      error_hidden: true
    });
  }
})