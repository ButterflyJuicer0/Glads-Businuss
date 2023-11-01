import "../CSS/LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { Button, Modal, Spinner } from "react-bootstrap";
import { useEffectOnce } from "react-use";

function LoginPage() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    type: -1,
  });
  const [modalState, setModalState] = useState(false);
  const [loginResultModal, setLoginResultModal] = useState(false);
  const [message, setMessage] = useState("");
  const loginType = ["userLogin", "adminLogin", "chefLogin"];
  const navigate = useNavigate();
  // @ts-ignore
  const handleFromChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setLoginResultModal(false);
  };
  useEffectOnce(() => {
    if (
      localStorage.getItem("token") != null &&
      loginType[loginForm.type] == "0"
    ) {
      navigate("/ChefSelectPage");
    } else if (
      localStorage.getItem("token") != null &&
      loginType[loginForm.type] == "1"
    ) {
      navigate("/ChefSelectPage");
    } else if (
      localStorage.getItem("token") != null &&
      loginType[loginForm.type] == "2"
    ) {
      navigate("/ChefSelectPage");
    }
  });
  function handleSubmit() {
    if (loginForm.type == 1) {
      window.location.href = "http://34.124.175.21:80/admin";
    } else if (loginForm.type == 2) {
      window.location.href = "http://34.124.175.21:80/chef";
    }

    setModalState(true);
    axios
      .post("http://34.124.216.17:8080/common/login", {
        type: loginType[loginForm.type],
        password: loginForm.password,
        username: loginForm.username,
      })
      .then((res) => {
        setModalState(false);
        if (res.status == 200) {
          if (res.data.code == 1) {
            localStorage.setItem("type", loginType[loginForm.type]);
            localStorage.setItem("userName", res.data.data.username);
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("token", res.data.data.token);
            navigate("/Home");
          } else if (res.data.code == 0) {
            setMessage(res.data["msg"]);
            setLoginResultModal(true);
          }
        } else {
          setMessage("Network error");
          setLoginResultModal(true);
        }
      })
      .then()
      .catch(() => {
        setModalState(false);
        setMessage("Input Error");
        setLoginResultModal(true);
      });
  }

  return (
    <>
      <Modal show={loginResultModal}>
        <Modal.Header>Login message</Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant={"secondary"} onClick={handleClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalState} className="text-center">
        <Modal.Body>
          <Spinner></Spinner>
        </Modal.Body>
      </Modal>

      <div className="container-fluid col-9 rounded loginPage border-danger d-flex align-items-center justify-content-center aligncenter">
        <span className=" loginContainer bg-light bg-opacity-50 rounded p-5  shadow-lg col-3 container-sm justify-content-center border d-flex">
          <form>
            <div className="mb-3 container-fluid">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                className="form-control"
                name="username"
                onChange={handleFromChange}
              />
            </div>
            <div className="mb-4 container-fluid ">
              <label htmlFor="inputPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleFromChange}
              />
            </div>
            Select login type
            <select
              className="form-select form-select-sm mb-4 container-fluid"
              aria-label="Default select"
              name="type"
              onChange={handleFromChange}
            >
              <option value="-1">Open this select menu</option>
              <option value="0">UserLogin</option>
              <option value="1">AdminLogin</option>
              <option value="2">ChefLogin</option>
            </select>
            <div className="container-fluid d-inline-flex">
              <div onClick={handleSubmit} className="btn m-2 btn-success">
                Log in
              </div>

              <Link to="/RegisterPage" className="btn m-2 btn-secondary">
                Register
              </Link>
            </div>
          </form>
        </span>
      </div>
    </>
  );
}
export default LoginPage;
