

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../../utils/constants";
// const InputPodcast = () => {
//   const [frontImage, setFrontImage] = useState(null);
//   const [audioFile, setAudioFile] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const [inputs, setInputs] = useState({
//     title: "",
//     description: "",//all inityials are null
//     category: "",
//   });

//   const audioInputRef = useRef(null);

//   const handleChangeImage = (e) => {
//     const file = e.target.files[0];
//     setFrontImage(file);
//   };
//    const handleAudioFile = (e) => {
//     const file = e.target.files[0];
//     setAudioFile(file);
//   };

//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDropImage = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     const file = e.dataTransfer.files[0];
//     setFrontImage(file);
//   };

 

//   const onChangeInputs = (e) => {
//     const { name, value } = e.target;
//     setInputs((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmitPodcast = async (e) => {
//     e.preventDefault();

//     if (!inputs.title || !inputs.description || !inputs.category || !frontImage || !audioFile) {
//       toast.error("Please fill all fields and upload files");
//       return;
//     }

//     const data = new FormData();
//     data.append("title", inputs.title);
//     data.append("description", inputs.description);
//     data.append("category", inputs.category);
//     data.append("frontImage", frontImage);
//     data.append("audioFile", audioFile);

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/podcast/add-podcast`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );

//       if (res.status === 201) {
//         toast.success(res.data.message || "Podcast added successfully");
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message); // Show backend validation errors
//       } else {
//         toast.error("Something went wrong. Please try again.");
//       }
//     } finally {
//       setInputs({
//         title: "",
//         description: "",
//         category: "",
//       });
//       setFrontImage(null);
//       setAudioFile(null);
//       document.getElementById("audioFile").value = "";
//       document.getElementById("frontImage").value = "";
//     }
//   };

//   return (
//     <div className="my-4 px-4 lg:px-12">
//       <h1 className="text-2xl font-semibold mb-4">Create Your Podcast</h1>

//       <form
//         onSubmit={handleSubmitPodcast}
//         className="mt-5 flex flex-col lg:flex-row items-center justify-between gap-6"
//       >
//         <div className="w-full lg:w-2/6 flex items-center justify-center">
//           <div
//             className={`size-[20vh] lg:size-[60vh] rounded-xl flex items-center justify-center border-2 border-dashed transition-all duration-300 ${
//               dragging
//                 ? "bg-blue-100 border-blue-400 scale-105 shadow-md"
//                 : "hover:bg-zinc-50 hover:shadow"
//             }`}
//             onDragEnter={handleDragEnter}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDropImage}
//             onDragOver={handleDragOver}
//           >
//             <input
//               type="file"
//               accept=".jpg,.jpeg,.png,.webp"
//               id="frontImage"
//               name="frontImage"
//               className="hidden"
//               onChange={handleChangeImage}
//             />
//             {frontImage ? (
//               <img
//                 src={URL.createObjectURL(frontImage)}
//                 alt="thumbnail"
//                 className="h-full w-full object-cover rounded-xl"
//               />
//             ) : (
//               <label
//                 htmlFor="frontImage"
//                 className="text-xl text-gray-600 w-full h-full flex items-center justify-center hover:cursor-pointer transition-all duration-300 hover:bg-zinc-100 rounded-xl px-4 text-center"
//               >
//                 Drag and Drop Thumbnail or Click to Upload
//               </label>
//             )}
//           </div>
//         </div>

//         <div className="w-full lg:w-4/6">
//           <div className="flex flex-col mb-4">
//             <label htmlFor="title" className="font-medium text-gray-700">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               placeholder="Title for your podcast"
//               className="mt-2 px-4 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
//               value={inputs.title}
//               onChange={onChangeInputs}
//             />
//           </div>

//           <div className="flex flex-col mb-4">
//             <label htmlFor="description" className="font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               placeholder="Description of your podcast"
//               className="mt-2 px-4 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
//               rows={4}
//               value={inputs.description}
//               onChange={onChangeInputs}
//             />
//           </div>

//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex flex-col w-full lg:w-2/6">
//               <label htmlFor="audioFile" className="font-medium text-gray-700">
//                 Select Audio
//               </label>
//               <input
//                 type="file"
//                 accept=".mp3,.wav,.m4a,.ogg,.aac"
//                 id="audioFile"
//                 ref={audioInputRef}
//                 className="mt-2 cursor-pointer transition-all duration-200 file:rounded-md file:border-none file:bg-zinc-800 file:text-white file:px-4 file:py-2 file:cursor-pointer hover:file:bg-zinc-700"
//                 onChange={handleAudioFile}
//               />
//             </div>

//             <div className="flex flex-col w-full lg:w-4/6">
//               <label htmlFor="category" className="font-medium text-gray-700">
//                 Select Category
//               </label>
//               <select
//                 name="category"
//                 id="category"
//                 className="mt-2 border border-zinc-300 rounded-md outline-none px-4 py-2 shadow-sm focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
//                 value={inputs.category}
//                 onChange={onChangeInputs}
//               >
//                 <option value="">Select Category</option>
//                 <option value="Comedy">Comedy</option>
//                 <option value="Education">Education</option>
//                 <option value="Business">Business</option>
//                 <option value="Government">Government</option>
//                 <option value="Hobbies">Hobbies</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-8">
//             <button
//               type="submit"
//               className="bg-zinc-800 w-full text-white rounded-md px-8 py-3 font-semibold hover:bg-zinc-900 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
//             >
//               Create Podcast
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default InputPodcast;

import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../utils/constants";

const InputPodcast = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  });

  const audioInputRef = useRef(null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFrontImage(file);
  };

  const handleAudioFile = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setFrontImage(file);
  };

  const onChangeInputs = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPodcast = async (e) => {
    e.preventDefault();

    if (!inputs.title || !inputs.description || !inputs.category || !frontImage || !audioFile) {
      toast.error("Please fill all fields and upload files");
      return;
    }

    setLoading(true); // Start loader

    const data = new FormData();
    data.append("title", inputs.title);
    data.append("description", inputs.description);
    data.append("category", inputs.category);
    data.append("frontImage", frontImage);
    data.append("audioFile", audioFile);

    try {
      const res = await axios.post(
        `${BASE_URL}/podcast/add-podcast`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success(res.data.message || "Podcast added successfully");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // End loader
      setInputs({ title: "", description: "", category: "" });
      setFrontImage(null);
      setAudioFile(null);
      document.getElementById("audioFile").value = "";
      document.getElementById("frontImage").value = "";
    }
  };

  return (
    <div className="my-4 px-4 lg:px-12">
      <h1 className="text-2xl font-semibold mb-4">Create Your Podcast</h1>

      <form
        onSubmit={handleSubmitPodcast}
        className="mt-5 flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="w-full lg:w-2/6 flex items-center justify-center">
          <div
            className={`size-[20vh] lg:size-[60vh] rounded-xl flex items-center justify-center border-2 border-dashed transition-all duration-300 ${
              dragging
                ? "bg-blue-100 border-blue-400 scale-105 shadow-md"
                : "hover:bg-zinc-50 hover:shadow"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDropImage}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              id="frontImage"
              name="frontImage"
              className="hidden"
              onChange={handleChangeImage}
            />
            {frontImage ? (
              <img
                src={URL.createObjectURL(frontImage)}
                alt="thumbnail"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <label
                htmlFor="frontImage"
                className="text-xl text-gray-600 w-full h-full flex items-center justify-center hover:cursor-pointer transition-all duration-300 hover:bg-zinc-100 rounded-xl px-4 text-center"
              >
                Drag and Drop Thumbnail or Click to Upload
              </label>
            )}
          </div>
        </div>

        <div className="w-full lg:w-4/6">
          <div className="flex flex-col mb-4">
            <label htmlFor="title" className="font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title for your podcast"
              className="mt-2 px-4 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
              value={inputs.title}
              onChange={onChangeInputs}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="description" className="font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description of your podcast"
              className="mt-2 px-4 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
              rows={4}
              value={inputs.description}
              onChange={onChangeInputs}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col w-full lg:w-2/6">
              <label htmlFor="audioFile" className="font-medium text-gray-700">
                Select Audio
              </label>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.ogg,.aac"
                id="audioFile"
                ref={audioInputRef}
                className="mt-2 cursor-pointer transition-all duration-200 file:rounded-md file:border-none file:bg-zinc-800 file:text-white file:px-4 file:py-2 file:cursor-pointer hover:file:bg-zinc-700"
                onChange={handleAudioFile}
              />
            </div>

            <div className="flex flex-col w-full lg:w-4/6">
              <label htmlFor="category" className="font-medium text-gray-700">
                Select Category
              </label>
              <select
                name="category"
                id="category"
                className="mt-2 border border-zinc-300 rounded-md outline-none px-4 py-2 shadow-sm focus:ring-2 focus:ring-zinc-600 transition-all duration-300"
                value={inputs.category}
                onChange={onChangeInputs}
              >
                <option value="">Select Category</option>
                <option value="Comedy">Comedy</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Government">Government</option>
                <option value="Hobbies">Hobbies</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className={`bg-zinc-800 w-full text-white rounded-md px-8 py-3 font-semibold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-zinc-900"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Cooking up your podcast 🎧🔥</span>
                </>
              ) : (
                "Create Podcast"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputPodcast;


