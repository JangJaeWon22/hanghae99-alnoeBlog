function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api/users/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else {
        localStorage.clear();
        alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
      }
      window.location.href = "/login";
    },
  });
}


//////////////////////////////////////////////////////////////////
///     로그인 회원 가입api                                    ///
//////////////////////////////////////////////////////////////////

function signOut() {
  localStorage.clear();
  window.location.href = "/login";
}

function register() {
  const id = $("#id").val();
  const password1 = $("#psword").val();
  const password2 = $("#confirmPsword").val();
  $.ajax({
    type: "POST",
    url: "/api/users",
    data: {
      id: id,
      password: password1,
      confirmPassword: password2,
    },
    success: function (response) {
      alert("회원가입을 축하드립니다.");
      window.location.href = "/login";
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}

function sign_in() {
  const id = $("#id").val();
  const password = $("#psword").val();
  $.ajax({
    type: "POST",
    url: "/api/auth",
    data: {
      id: id,
      password: password,
    },
    success: function (response) {
      localStorage.setItem("token", response.token);
      window.location.href = "/";
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}

//////////////////////////////////////////////////////////////////
///    게시글 관련 api                                         ///
//////////////////////////////////////////////////////////////////

//취소 버튼 시 뒤로가기 기능
function back() {
  location.href = "javascript:history.back();";
}

//수정페이지
function correctPage() {
  location.href = "/borderCorrect?borderDate=" + borderDate;
}


//////////////////////////////////////////////////////////////////
///    댓글 api                                                ///
//////////////////////////////////////////////////////////////////

//댓글 등록
function post_comment() {
  let date = new Date();
  let commentDate = date.getTime();
  $.ajax({
    type: "POST",
    url: `api/borderList/${borderDate}/comment`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      commentMain:$("#comment-area").val(),
      commentDate,
    },
    success: function (response){
      alert("댓글이 등록 되었습니다.");
      window.location.reload();
    },    
    error: function (error) {
    alert(error.responseJSON.errorMessage);
    window.location.href = "/login";
  },
  });
}

// 댓글 가져오기
function get_comment() {
  $("#comment-box").empty();
  $.ajax({
    type:"GET",
    url:`api/borderList/${borderDate}/comment`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function(response) {
      const tokenUserId = response['userId']
      let commentList = response["commentList"];
      for(let i = 0 ; i < commentList.length;  i ++){
        let commentDate = commentList[i]["commentDate"];
        let date = moment(commentDate).format(
            "YYYY-MM-DD HH:mm"
          );
        make_commentlist(commentList[i], date, tokenUserId);
      }
    },
  });
}
//댓글 찍어내기
function make_commentlist(comments, date, tokenUserId) {
  const { commentId,commentMain,commentUserNick } = comments;
  if(commentUserNick == tokenUserId){
      let htmlTemp = `<div class="main-box">
                        <div class="box-top">
                          <div class="top-box1">
                            <strong>${commentUserNick}</strong>
                            <small>${date}</small>
                          </div>
                          <div class="top-box2" id="icons-${commentId}">
                            <i id="edit-icon" onclick="onCorrectBtn(${commentId})" class="far fa-edit"></i>
                            <i id="delete-icon" onclick="onRemoveBtn(${commentId})" class="fas fa-trash-alt"></i>
                          </div>
                        </div>
                        <div class= box-center>
                          <input id= "mainComment-${commentId}" class="comment-input" value="${commentMain}" disabled>
                          <input id= "afterComment-${commentId}" type="text" style="display: none;" class="correct-input" value="${commentMain}">
                          <div class="btn-grob">
                            <button id= "commentSave-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="correctComment( ${comments["commentId"]})">저장하기</button>
                            <button id= "commentRemove-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="removeComment(${comments["commentId"]})">삭제하기</button>
                            <button id= "commentCancle-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="offBtn(${commentId})"}>취소하기</button>
                          </div>
                        </div>
                      </div>`
      $("#comment-box").append(htmlTemp);
  }else {
          let htmlTemp = `<div class="main-box">
                              <div class="box-top">
                                <div class="top-box1">
                                  <strong>${commentUserNick}</strong>
                                  <small>${date}</small>
                                </div>
                              </div>
                              <div class= box-center>
                                <input id= "mainComment-${commentId}" class="comment-input" value="${commentMain}" disabled>
                                <input id= "afterComment-${commentId}" type="text" style="display: none;" class="correct-input" value="${commentMain}">
                                <div class="btn-grob">
                                  <button id= "commentSave-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="correctComment( ${comments["commentId"]})">저장하기</button>
                                  <button id= "commentRemove-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="removeComment(${comments["commentId"]})">삭제하기</button>
                                  <button id= "commentCancle-${commentId}" type="button" style="display: none;" class="btn btn-primary" onClick="offBtn(${commentId})"}>취소하기</button>
                                </div>
                              </div>
                            </div>`
      $("#comment-box").append(htmlTemp);
  }
  }




function onCorrectBtn(commentId){
  $("#commentSave-" + commentId).show();
  $("#commentCancle-" + commentId).show();
  $("#mainComment-" + commentId).hide()
  $("#afterComment-" + commentId).show();
}

function onRemoveBtn(commentId){
  $("#commentRemove-" + commentId).show();
  $("#commentCancle-" + commentId).show();
}

function offBtn(commentId){
  $("#commentSave-" + commentId).hide();
  $("#commentRemove-" + commentId).hide();
  $("#commentCancle-" + commentId).hide();
  $("#mainComment-" + commentId).show()
  $("#afterComment-" + commentId).hide();
}

//댓글 수정
function correctComment(commentId) {
  let date = new Date();
  let commentCorrectDate = date.getDate();
  // let mainComment = "#mainComment-" + commentId
  // console.log( $("#mainComment-1").val() )
  // console.log( $("#mainComment-" + commentId).val() )

  $.ajax({
    type:"PATCH",
    url:`/api/borderList/${borderDate}/comment/${commentId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      //바뀐 데이터
      commentMain: $("#afterComment-" + commentId).val(),
      commentCorrectDate,
    },
    success: function (response) {
      if (response["result"] == "success") {
          alert("글을 수정했습니다.");
        window.location.href = `/borderDetail?borderDate=${borderDate}`
      }
    },
    error: function (error) {
      alert(error.responseJSON.errorMessage);
    },
  });
}

//댓글 삭제하기
function removeComment(commentId) {
  $.ajax({
    type: "DELETE",
    url: `/api/borderList/${borderDate}/comment/${commentId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
        alert("글을 삭제했습니다.")
        location.href = `/borderDetail?borderDate=${borderDate}`
      }
    },
  });
}


function login_logout(){
  if(localStorage.getItem("token")){
      $("#logIn-btn").hide()
      $("#logOut-btn").show()
  }
}