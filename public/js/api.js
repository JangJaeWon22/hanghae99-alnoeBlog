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