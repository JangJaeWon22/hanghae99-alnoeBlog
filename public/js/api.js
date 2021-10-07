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
      commentMain:$("#comment").val(),
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
      let commentList = response["commentList"];
      for(let i = 0 ; i < commentList.length;  i ++){
        let commentDate = commentList[i]["commentDate"];
        let date = moment(commentDate).format(
            "YYYY-MM-DD HH:mm"
          );
        make_commentlist(commentList[i], date);
      }
    },
  });
}
//댓글 찍어내기
function make_commentlist(comments, date) {
    let htmlTemp = `<div class="main-box">
                      <div class="box-top">
                        <div class="top-box1">
                          <strong>${comments["commentUserNick"]}</strong>
                          <small>${date}</small>
                        </div>
                        <div class="top-box2">
                          <a href="#"><i id="edit-icon" class="far fa-edit"></i></a>
                          <a><i id="delete-icon" class="fas fa-trash-alt"></i></a>
                        </div>
                      </div>
                      <div class= box-center>
                        <input id= "mainComment-${comments.commentId}" class="comment-input" value="${comments["commentMain"]}">
                        <div class="btn-grob">
                          <button id= "comment-save" type="button" class="btn btn-primary" onClick="correctComment( ${comments["commentId"]}, ${comments["commentMain"]} )">저장하기</button>
                          <button id= "comment-remove" type="button" class="btn btn-primary" onClick="removeComment(${comments["commentId"]})">삭제하기</button>
                          <button id= "comment-cancle" type="button" class="btn btn-primary">취소하기</button>
                        </div>
                      </div>
                    </div>`
    $("#comment-box").append(htmlTemp);
  }

//댓글 수정
function correctComment(commentId, comment) {
  let date = new Date();
  let commentCorrectDate = date.getDate();
  let mainComment = "#mainComment-" + commentId
  // console.log( $("#mainComment-1").val() )
  // console.log( $("#mainComment-" + commentId).val() )

  $.ajax({
    type:"PATCH",
    url:`/api/borderList/${borderDate}/comment/${commentId}`,
    data: {
      //바뀐 데이터
      commentMain: $("#mainComment-" + commentId).val(),
      commentCorrectDate,
    },
    success: function (response) {
      if (response["result"] == "success") {
        alert("글을 수정했습니다.");
        window.location.href = `/borderDetail?borderDate=${borderDate}`
      }
    }
  });
}

//댓글 삭제하기
function removeComment(commentId) {
  $.ajax({
    type: "DELETE",
    url: `/api/borderList/${borderDate}/comment/${commentId}`,
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
        alert("글을 삭제했습니다.")
        location.href = `/borderDetail?borderDate=${borderDate}`
      }
    },
  });
}