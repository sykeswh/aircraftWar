$(function(){
  var stage = document.getElementById('stage')
  var bg1 = document.getElementsByClassName('bg1')[0]
  var bg2 = document.getElementsByClassName('bg2')[0]
  var plan = document.getElementsByClassName('plan')[0]
  var func = document.getElementsByClassName('func')
  var enemys = document.getElementsByClassName('enemy')
  var bgmp3 = document.getElementById('bgmp3')
  var demp3 = document.getElementById('demp3')
  var shmp3 = document.getElementById('shmp3')
  var btn = document.getElementById('btn')
  var btn3 = document.getElementById('btn3')
  var desc = document.getElementsByClassName('desc')[0]
  var input = document.getElementById('input')
  var gamesort = document.getElementsByClassName('gamesort')[0]
  var gameTbody = document.getElementById('gameTbody')
  var pattern = 1
  var img = 1
  var topval1 = -200
  var topval2 = -968
  //定义方向的变量数组 依次为上右下左,空格 用1表示按下，0表示未按下
  var pdirection = [0,0,0,0,0]
  //背景图的轮播
  setInterval(() => {
    topval1 +=2
    topval2 +=2
    bg1.style.top = topval1 + 'px'
    bg2.style.top = topval2 + 'px'
    if (topval1 == 568) {
      topval1 = -968
    }else if (topval2 == 568) {
      topval2 = -968
    }
  }, 20);
  //手动操作飞机的上下左右
  document.onkeydown = function(event){
    event = event || window.event;
    //下 40  上  38  左  37  右 39
    if (event.key === "ArrowUp") {
      pdirection[0] = 1
    }else if(event.key === "ArrowDown"){
      pdirection[2] = 1
    }else if(event.key === "ArrowLeft"){
      pdirection[3] = 1
    }else if(event.key === "ArrowRight"){
      pdirection[1] = 1
    }
  }
  document.onkeyup = function(event){
    event = event || window.event;
    //下 40  上  38  左  37  右 39
    if (event.key === "ArrowUp") {
      pdirection[0] = 0
    }else if(event.key === "ArrowDown"){
      pdirection[2] = 0
    }else if(event.key === "ArrowLeft"){
      pdirection[3] = 0
    }else if(event.key === "ArrowRight"){
      pdirection[1] = 0
    }else if (event.key === " ") {
      pdirection[4] = 0
    }
  }
  //生产子弹的工厂
  function productionBullets(event){
    event = event || window.event;
    if (event.key === " ") {
      pdirection[4] = 1
    }
    if (pdirection[4] === 1) {
      shmp3.currentTime = 0
      shmp3.play()
      var bullet = document.createElement("div")
      bullet.setAttribute("class","bullet")
      stage.appendChild(bullet)
      bullet.style.top = plan.offsetTop + 'px'
      bullet.style.left = plan.offsetLeft + plan.offsetWidth/2 - bullet.offsetWidth/2 + 'px'
    }
  }
  //自动发射子弹
  function analogKey(){
    var e = jQuery.Event("keypress")
    e.key = " "
    $(document).trigger(e)
  }
  //监控数组pdirection为键盘的按下情况
  var timer
  function boardTimer(){
    if (pdirection[0] === 1) {
      if (plan.offsetTop>=5) {
        plan.style.top = plan.offsetTop - 5 + 'px'
      }else{
        plan.style.top = 0 + 'px'
      }
    }else if(pdirection[2] === 1){
      if (plan.offsetTop<=509) {
        plan.style.top = plan.offsetTop + 5 + 'px'
      }else{
        plan.style.top = 514 + 'px'
      }
    }else if(pdirection[3] === 1){
      if (plan.offsetLeft>=5) {
        plan.style.left = plan.offsetLeft - 5 + 'px'
      }else{
        plan.style.left = 0 + 'px'
      }
    }else if(pdirection[1] === 1){
      if (plan.offsetLeft<=251) {
        plan.style.left = plan.offsetLeft + 5 + 'px'
      }else{
        plan.style.left = 256 + 'px'
      }
    }
  }
  //生成一个随机数
  function GetRandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
  }
  var num = 0
  var arr = []
  //每秒随机生成一架敌机
  var timer4
  function airplane(){
    var enemy = document.createElement("div")
    enemy.setAttribute("class","enemy enemy"+GetRandomNum(1,4))
    enemy.style.left = GetRandomNum(0,256) + 'px'
    stage.appendChild(enemy)
    arr[num] = GetRandomNum(2,6)
    num++
  }
  //设置每台敌机的速度
  var timer5
  function planeSpeed(){
    for (let i = 0; i < enemys.length; i++) {
      enemys[i].style.top = enemys[i].offsetTop + arr[i] +'px'
      if (enemys[i].offsetTop >=568) {
        enemys[i].parentNode.removeChild(enemys[i])
        arr = arr.filter((item,index)=>{
          return index==i ? false : true
        })
      }
    }
  }
  //给子弹速度
  var bullets = document.getElementsByClassName('bullet')
  setInterval(() => {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].style.top = bullets[i].offsetTop - 5 +'px'
      if (bullets[i].offsetTop <=-35) {
        bullets[i].parentNode.removeChild(bullets[i])
      }
    }
  }, 10);
  //控制操纵模式及子弹自动发射
  var timer2
  func[0].onclick = function(){
    if (pattern == 1) {
      pattern = 2
      clearInterval(timer)
      timer2 = setInterval(analogKey, 500);
    }else{
      pattern = 1
      clearInterval(timer)
      clearInterval(timer2)
      timer = setInterval(boardTimer, 10);
      console.log('1');
    }
  }
  //背景切换
  func[1].onclick = function(){
    if (img == 1) {
      img = 2
      bg1.style.backgroundImage = "url(./img/bg_02.png)"
      bg2.style.backgroundImage = "url(./img/bg_02.png)"
    }else{
      img = 1
      bg1.style.backgroundImage = "url(./img/bg_01.png)"
      bg2.style.backgroundImage = "url(./img/bg_01.png)"
    }
  }
  //鼠标操作飞机
  plan.onmousedown = function(event) {
    if(pattern == 1) return
    //设置obj捕获所有鼠标按下的事件
    plan.setCapture && plan.setCapture();
    event = event || window.event
    //鼠标到obj边框的距离
    var bl = event.clientX - plan.offsetLeft
    var bt = event.clientY - plan.offsetTop
    //拖动鼠标的事件
    document.onmousemove = function(event){
      event = event || window.event;
      if (event.clientX>=bl && event.clientX<=256+bl && event.clientY>=bt && event.clientY<=514+bt) {
        plan.style.left = event.clientX - bl + "px"
        plan.style.top = event.clientY - bt + "px"
      }
    }
    //松开鼠标的事件
    document.onmouseup = function(){
      //取消document的onmousenove事件
      document.onmousemove = null
      //取消document的onmouseup事件
      document.onmouseup = null
      //当鼠标松开时，取消对事件的捕获
      plan.releaseCapture && plan.releaseCapture()
    }
    return false
  }
  //碰撞模型
  var timer3
  var integral = 0
  function collision(obj){
    for (let j = 0; j < enemys.length; j++) {
      var a = obj.offsetHeight/2 + obj.offsetTop - enemys[j].offsetHeight/2-enemys[j].offsetTop
      var b = obj.offsetWidth/2 + obj.offsetLeft - enemys[j].offsetWidth/2-enemys[j].offsetLeft
      var c = obj.offsetHeight/2 + enemys[j].offsetHeight/2 - 3
      if (a*a+b*b<=c*c) {
        demp3.currentTime = 0
        demp3.play()
        enemys[j].parentNode.removeChild(enemys[j])
        arr = arr.filter((item,index)=>{
          return index==j ? false : true
        })
        if (obj == plan) {
          //隐藏战机
          obj.style.top = stage.offsetHeight + 'px'
          obj.style.left = stage.offsetWidth/2 - obj.offsetWidth/2 + 'px'
          alert('游戏结束！')
          //关闭碰撞检测
          clearInterval(timer3)
          //关闭敌机生成
          clearInterval(timer4)
          //关闭设置敌机速度
          clearInterval(timer5)
          //关闭监控键盘操作
          clearInterval(timer)
          //关闭子弹自动发射
          clearInterval(timer2)
          //清除pdirection
          pdirection = [0,0,0,0,0]
          //清除鼠标事件
          document.onmousemove = null
          //取消document的onmouseup事件
          document.onmouseup = null
          //关闭发射子弹
          document.onkeypress = null
          //清屏
          for (let i = 0; i < enemys.length; i++) {
            enemys[i].parentNode.removeChild(enemys[i])
          }
          gameOver()
        }else{
          integral++
          obj.parentNode.removeChild(obj)
        }
        break
      }
    }
  }
  //碰撞检测
  function collisionTest(){
    //子弹是否与敌机碰撞
    for (let i = 0; i < bullets.length; i++) {
      collision(bullets[i])
    }
    //战机是否与敌机碰撞
    collision(plan)
  }
  //开始游戏
  btn.onclick = function(){
    bgmp3.play()
    var gamedesc = setInterval(() => {
      if (desc.offsetTop <= -desc.offsetHeight) {
        clearInterval(gamedesc)
        desc.style.display = 'none'
      }
      desc.style.top = desc.offsetTop - 3 + 'px'
    }, 10);
    for (let i = 0; i < func.length; i++) {
      func[i].style.display = 'block'
    }
    localStorage.setItem('player'+(localStorage.length+1),input.value+',0')
    startGame()
  }
  //开启游戏
  function startGame(){
    //创建战机
    var timer6 = setInterval(() => {
      if (plan.offsetTop < stage.offsetHeight - plan.offsetHeight*2 ) {
        clearInterval(timer6)
      }
      plan.style.top = plan.offsetTop - 1 + 'px'
    }, 1);
    //开启碰撞检测
    timer3 = setInterval(collisionTest, 1)
    //开启敌机生成
    timer4 = setInterval(airplane, 900);
    //开启设置敌机速度
    timer5 = setInterval(planeSpeed, 10)
    //监控操作情况
    timer =  setInterval(boardTimer, 10)
    //开启空格发射子弹
    document.onkeypress = productionBullets
    //重置pdirection
    pdirection = [0,0,0,0,0]
  }
  //关闭游戏
  function gameOver(){
    if (confirm("再玩一次吗？")) {
      integral = 0
      startGame()
    }else{
      //上传玩家与积分
      var curplayer = localStorage.getItem('player'+localStorage.length)
      var index = curplayer.indexOf(",")
      curplayer = curplayer.substring(0,index)
      localStorage.setItem('player'+localStorage.length,curplayer+','+integral)
      //显示所有玩家信息
      var players = []
      for (let i = 1; i <= localStorage.length; i++) {
        var strinfo = localStorage.getItem('player'+i)
        players.push(strinfo.split(','))
      }
      //排序
      players = players.sort((a,b)=>{
        return b[1]-a[1]
      })
      for (let i = 0; i < 8; i++) {
        if (i<players.length) {
          gameTbody.innerHTML +="<tr>"+
                                "<td>"+(i+1)+"</td>"+
                                "<td>"+players[i][0]+"</td>"+
                                "<td>"+players[i][1]+"</td>"+   
                              "</tr>"
        }
      }
      bgmp3.pause()
      gamesort.style.display = 'block'
      gamesort.style.top = '40px'
      for (let i = 0; i < func.length; i++) {
        func[i].style.display = 'none'
      }
    }
  }
  //返回主界面
  btn3.onclick = function(){
    desc.style.display = 'block'
    var gamedesc = setInterval(() => {
      if (desc.offsetTop >= 70) {
        clearInterval(gamedesc)
      }
      desc.style.top = desc.offsetTop + 3 + 'px'
    }, 10);
    var gamesorts = setInterval(() => {
      if (gamesort.offsetTop >= stage.offsetHeight) {
        clearInterval(gamesorts)
        gamesort.style.display = 'none'
      }
      gamesort.style.top = gamesort.offsetTop + 10 + 'px'
    }, 10);
    //清空积分面板
    for (let i = 0; i < 8; i++) {
      if (i < gameTbody.childNodes.length) {
        gameTbody.removeChild(gameTbody.childNodes[1])
      }
    }
  }
})