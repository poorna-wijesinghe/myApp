import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/headerTwo";
import { useEffect } from "react";
import axios from "axios";


export default function EditProfile() {
  const [activeTab, setActiveTab] = useState("Basic Details");
  const tabs = ["Basic Details", "Additional Details", "Spouse Details", "Personal Preferences"];
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    postalCode: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    spouseSalutation: "",
    spouseFirstName: "",
    spouseLastName: "",
    hobbies: "",
    sports: "",
    music: "",
    movies: "",
  });
  const [originalData, setOriginalData] = useState(null);

// Calculate max DOB (17 years ago from today)
  const get17YearsAgo = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 17);
    return today.toISOString().split("T")[0]; // format: YYYY-MM-DD
  };
  const maxDOB = get17YearsAgo();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios.get("http://localhost:5000/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    setFormData(res.data);
    setOriginalData(res.data);
  })
  .catch((error) => {
    console.error("Failed to load user data", error);
  });
}, []);


// Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //  Age validation logic
  const isValidAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 17 || (age === 17 && m >= 0);
  };

  //  Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValidAge(formData.dob)) {
      alert("You must be at least 17 years old.");
      return;
    }

  const token = localStorage.getItem("token");

  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => form.append(key, value));
  if (profileImageFile) {
    form.append("profileImage", profileImageFile);
  }

  try {
   await axios.put("http://localhost:5000/api/users/profile", form, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Something went wrong while updating the profile.");
  }
};


  const handleCancel = () => {
    setFormData(originalData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Details":
        return (
          <div className="flex flex-wrap">
            <div className="flex w-full md:w-1/4 flex-col gap-4 items-center mb-4">
              {profileImageFile ? (
                <img
                    src={URL.createObjectURL(profileImageFile)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                ) : formData.profileImage ? (
                <img
                    src={`http://localhost:5000${formData.profileImage}`}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300" />
                )}
              <label htmlFor="upload" className="underline cursor-pointer text-sm">
                Upload image
                <input
                type="file"
                id="upload"
                onChange={(e) => setProfileImageFile(e.target.files[0])}
                className="hidden"
                />

              </label>
            </div>
            <div className="w-full md:w-3/4 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="salutation">Salutation*</label>
                <select id="salutation" name="salutation" value={formData.salutation} onChange={handleChange} className="w-full border p-2" required>
                  <option value="">Select salutation</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="firstName">First Name*</label>
                <input id="firstName" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="w-full border p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="lastName">Last Name*</label>
                <input id="lastName" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="w-full border p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address*</label>
                <input id="email" name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} className="w-full border p-2" required />
              </div>
            </div>
          </div>
        );

      case "Additional Details":
        return (
          <div className="w-full md:w-4/5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="address">Home Address*</label>
              <input id="address" name="address" placeholder="Home Address" value={formData.address} onChange={handleChange} className="w-full border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="country">Country*</label>
              <input id="country" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="postalCode">Postal Code*</label>
              <input id="postalCode" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="w-full border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                max={maxDOB} // ✅ restrict DOB to 17+ only
                className="w-full border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="maritalStatus">Marital Status</label>
              <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full border p-2">
                <option value="">Select marital status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>
        );

      case "Spouse Details":
        return (
          <div className="w-full md:w-4/5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="spouseSalutation">Salutation</label>
              <select id="spouseSalutation" name="spouseSalutation" value={formData.spouseSalutation} onChange={handleChange} className="w-full border p-2">
                <option value="">Select salutation</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="spouseFirstName">First Name</label>
              <input id="spouseFirstName" name="spouseFirstName" placeholder="Spouse First Name" value={formData.spouseFirstName} onChange={handleChange} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="spouseLastName">Last Name</label>
              <input id="spouseLastName" name="spouseLastName" placeholder="Spouse Last Name" value={formData.spouseLastName} onChange={handleChange} className="w-full border p-2" />
            </div>
          </div>
        );

      case "Personal Preferences":
        return (
          <div className="w-full md:w-4/5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hobbies">Hobbies and Interests</label>
              <input id="hobbies" name="hobbies" placeholder="Hobbies and interests" value={formData.hobbies} onChange={handleChange} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="sports">Favorite Sport(s)</label>
              <input id="sports" name="sports" placeholder="Favorite sport(s)" value={formData.sports} onChange={handleChange} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="music">Preferred Music Genre(s)</label>
              <input id="music" name="music" placeholder="Preferred music genre(s)" value={formData.music} onChange={handleChange} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="movies">Preferred Movie/TV Show(s)</label>
              <input id="movies" name="movies" placeholder="Preferred movie/TV show(s)" value={formData.movies} onChange={handleChange} className="w-full border p-2" />
            </div>
          </div>
        );

      default:
        return <p className="italic">No content available for this section yet.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-300 p-4 relative">
      <Header />
      <div className="flex flex-wrap gap-6 mt-4 p-4">
        {/* Side Tabs */}
        <div className="w-52 space-y-2 border-r pr-4">
         {tabs.map((tab) => {
            const isDisabled = tab === "Spouse Details" && formData.maritalStatus === "Single";
            return (
                <div
                key={tab}
                onClick={() => !isDisabled && setActiveTab(tab)}
                className={`cursor-pointer border-b-2 px-2 py-1 transition ${
                    activeTab === tab ? "border-black font-semibold" : "border-gray-300"
                } ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""}`}
                >
                {tab}
                </div>
            );
            })}

        </div>

        <div className="w-auto flex-1">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold whitespace-nowrap">Edit <span className="font-black">Profile</span></h1>
                <div className="flex-1 h-px bg-black opacity-60 mt-3 mr-5" />
              </div>
            </div>
            <Link to="/my-profile" className="text-sm underline whitespace-nowrap">&lt; Go back to My Profile</Link>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 bg-transparent w-full md:w-4/5">
            {renderTabContent()}
            <div className="mt-6 flex gap-4">
              <button type="submit" className="bg-black text-white px-4 py-2">SAVE & UPDATE</button>
              <button type="button" onClick={handleCancel} className="border border-black px-4 py-2">CANCEL</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
