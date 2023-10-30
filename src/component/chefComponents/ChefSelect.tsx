import { useState } from "react";
import "../../CSS/ChefSelect.css";
import { useEffectOnce } from "react-use";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

function ChefSelect() {
  const [chefs, setChefs] = useState([]);
  const [modalState, setModalState] = useState(false);
  const navigate = useNavigate();

  function handleModalClose() {
    setModalState(false);
  }
  useEffectOnce(() => {
    axios({
      method: "get",
      url: "http://localhost:8082/user/chef",
      headers: {
        token: localStorage.getItem("token"),
      },
    }).then((res) => {
      setChefs(res.data.data);
    });
  });

  useEffectOnce(() => {
    axios
      .get("http://localhost:8082/user/category/show", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCategoryList(res.data.data);
      });
  });

  const [categoryList, setCategoryList] = useState([]);
  return (
    <>
      <Modal
        show={modalState}
        onHide={() => {
          setModalState(false);
        }}
      >
        <Modal.Header>Warning</Modal.Header>
        <Modal.Body>Please log in first</Modal.Body>
        <Modal.Footer>
          <Button variant={"secondary"} onClick={handleModalClose}>
            Confirm
          </Button>
          <Button
            variant={"success"}
            onClick={() => {
              navigate("/loginPage");
            }}
          >
            Log in
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container pt-3  justify-content-md-center rounded-2">
        <div className="container-fluid col-10">
          <div className="d-inline-flex p-1">
            <button
              className="btn btn-warning"
              onClick={() => {
                axios({
                  url: "http://localhost:8082/user/chef/",
                  method: "get",
                  headers: {
                    token: localStorage.getItem("token"),
                  },
                }).then((res) => {
                  setChefs(res.data.data);
                });
              }}
            >
              All
            </button>
          </div>

          {categoryList.map((category, index) => {
            return (
              <div className="d-inline-flex p-1" key={index}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    axios({
                      url: "http://localhost:8082/user/chef/" + category["id"],
                      method: "get",
                      headers: {
                        token: localStorage.getItem("token"),
                      },
                    }).then((res) => {
                      setChefs(res.data.data);
                    });
                  }}
                >
                  {category["name"]}
                </button>
              </div>
            );
          })}
        </div>
        <div className="container-fluid pt-3 justify-content-center row   ">
          {chefs.map((chef) => {
            return (
              <div
                key={chef["id"]}
                className="text-center col-3 m-2 pb-3 rounded shadow-lg grow  "
                onClick={() => {
                  if (localStorage.getItem("token") == null)
                    setModalState(true);
                  else {
                    navigate("/DishDisplayPage", {
                      state: { chef: chef },
                    });
                  }
                }}
              >
                <img
                  className="img-thumbnail "
                  src={chef["image"]}
                  alt={"No image"}
                />
                <p>{chef["name"]}</p>
                {chef["description"]}
              </div>
            );
          })}
        </div>
        <div className="row"></div>
      </div>
    </>
  );
}
export default ChefSelect;
