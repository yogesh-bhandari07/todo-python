import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AuthUser from "../../Services/AuthUser";
import axios from "axios";
import Notification, {
  successNotify,
  errorNotify,
} from "../../Services/Notification.js";
function Home() {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [createTask, setCreateTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState("");
  const [oneTask, setOneTask] = useState({
    task: "",
    user_id: "",
    id: "",
    is_completed: false,
  });

  const [deleteID,setDeleteID]=useState('')



  const { user } = AuthUser();

  const handleAddModal = () => {
    setIsOpenAdd(!isOpenAdd);
  };

  const handleEditModal = () => {
    setIsOpenEdit(!isOpenEdit);
  };


  const handleDeleteModal = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  const handleCreateTaskInput = (e) => {
    setCreateTask(e.target.value);
  };
  const handleEditTaskInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setOneTask({ ...oneTask, [name]: value });
  };

  const getMyTasks = async (url) => {
    axios({
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + url + "/" + user.id,
    }).then(function (response) {
      if (response.data.code == 200) {
        setTasks(response.data.result.tasks);
      } else {
        errorNotify(response.data.message);
      }
    });
  };

  const getOneTask = async (url, id) => {
    axios({
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + url + "/" + id,
    }).then(function (response) {
      if (response.data.code == 200) {
        response.data.result.task.is_completed == "False"
          ? (response.data.result.task["is_completed"] = false)
          : (response.data.result.task["is_completed"] = true);
        setOneTask(response.data.result.task);
        handleEditModal();
      } else {
        errorNotify(response.data.message);
      }
    });
  };

  const createTaskApi = async (url) => {
    await axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + url,
      data: {
        parameter: {
          data: {
            user_id: user.id,
            task: createTask,
          },
        },
      },
    })
      .then(async (response) => {
        if (response.data.code == 200) {
          setCreateTask("");
          handleAddModal();
          getMyTasks("tasks");
          successNotify("Task Created Successfully");
        } else {
          errorNotify(response.data.message);
        }
      })
      .catch((error) => {
        errorNotify(error);
      });
  };

  const editTaskApi = async (url) => {
    await axios({
      method: "put",
      url: process.env.REACT_APP_API_BASE_URL + url,
      data: {
        parameter: {
          data: {
            id: oneTask.id,
            is_completed: oneTask.is_completed,
            task: oneTask.task,
          },
        },
      },
    })
      .then(async (response) => {
        if (response.data.code == 200) {
          setOneTask({
            task: "",
            user_id: "",
            id: "",
            is_completed: "",
          });
          handleEditModal();
          getMyTasks("tasks");
          successNotify("Task Updated Successfully");
        } else {
          errorNotify(response.data.message);
        }
      })
      .catch((error) => {
        errorNotify(error);
      });
  };

  const deleteTaskApi=async(url,id)=>{
    axios.delete(process.env.REACT_APP_API_BASE_URL + url+'/'+id)
    .then(response =>{
      if (response.data.code == 200) {
        handleDeleteModal()
        getMyTasks("tasks");
        successNotify("Task deleted ");

      }

    }).catch((error) => {
      errorNotify(error);
    });
 
  }

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if(createTask!=''){
      createTaskApi("task");
    }else{
      errorNotify('Please Fill ALl fileds')
    }

  };
  const handleEditTaskSubmit = (e) => {
    e.preventDefault();
    

    if(oneTask.task!=''){
      editTaskApi("task");
    }else{
      errorNotify('Please Fill ALl fileds')
    }

  };

  const handleGetOneTask = (id) => {
    setEditTaskId(id);
    getOneTask("task", id);
  };



  const handleDeleteTask=(id)=>{
    setDeleteID(id)
    handleDeleteModal()
    
  }



  useEffect(() => {
    getMyTasks("tasks");
  }, []);

  return (
    <div className="lg:px-24 lg:py-8 md:px-12 md:py-4 sm:px-6 sm:py-3 py-2 px-4">
      <div className="overflow-x-auto relative">
        <div className="w-full flex  justify-end">
          <button
            type="button"
            onClick={handleAddModal}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ml-auto"
          >
            Add
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-50 uppercase bg-[#497174] rounded ">
            <tr>
              <th scope="col" className="py-3 px-6">
                Task
              </th>
              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr className="bg-white border-b " key={task.id}>
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap "
                >
                  {task.task}
                </th>
                <td className="py-4 px-6 flex justify-center ">
            

                  <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none  focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
                    onClick={() => {
                      handleGetOneTask(task.id);
                    }}
                  >
                    Edit
                  </button>




                  <button
                    onClick={() => {
                      handleDeleteTask(task.id);
                    }}
                    type="button"
                    className="text-gray-100 bg-[#EB6440] border border-gray-300 focus:outline-none  focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
                  >
                    Delete
                  </button>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add modal */}
      <Transition appear show={isOpenAdd} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleAddTaskSubmit}>
                    <div className="mt-2">
                      <textarea
                        name=""
                        onChange={handleCreateTaskInput}
                        value={createTask}
                        placeholder="Type your task here"
                        className="rounded w-full bg-white  border-solid border-2 border-sky-500 p-1 "
                        cols="3"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 m-1"
                        onClick={handleAddModal}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* edit Modal */}

      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleEditTaskSubmit}>
                    <div className="mt-2">
                      <textarea
                        name="task"
                        onChange={handleEditTaskInput}
                        value={oneTask.task}
                        placeholder="Type your task here"
                        className="rounded w-full bg-white  border-solid border-2 border-sky-500 p-1 "
                        cols="3"
                        rows="3"
                      ></textarea>
                      <label className="inline-flex relative items-center cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={oneTask.is_completed}
                          className="sr-only peer"
                          onChange={(e) =>
                            setOneTask({
                              ...oneTask,
                              is_completed: !oneTask.is_completed,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          is completed?
                        </span>
                      </label>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 m-1"
                        onClick={handleEditModal}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* delete Modal */}

      <Transition appear show={isOpenDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <ddiv className="m-2">
                    <p className="text-sm text-gray-400">
                      Are you sure to delete this task?
                    </p>
                  </ddiv>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 m-1"
                      onClick={handleDeleteModal}
                    >
                      Close
                    </button>
                    <button
                    onClick={()=>{deleteTaskApi('task',deleteID)}}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Sure
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


        <Notification></Notification>
    </div>
  );
}

export default Home;
